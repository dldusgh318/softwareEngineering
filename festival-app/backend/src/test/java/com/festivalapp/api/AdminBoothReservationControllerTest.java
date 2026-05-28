package com.festivalapp.api;

import static org.hamcrest.Matchers.nullValue;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.festivalapp.dto.BoothReservationApprovalRequest;
import com.festivalapp.dto.BoothReservationResponse;
import com.festivalapp.service.BoothReservationApprovalService;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

class AdminBoothReservationControllerTest {

  private final BoothReservationApprovalService approvalService =
      mock(BoothReservationApprovalService.class);
  private MockMvc mockMvc;

  @BeforeEach
  void setUp() {
    mockMvc = MockMvcBuilders
        .standaloneSetup(new AdminBoothReservationController(approvalService))
        .build();
  }

  @Test
  void getPendingReservationsReturnsPendingApprovalReservations() throws Exception {
    given(approvalService.getPendingReservations())
        .willReturn(List.of(reservationResponse("reservation-1", "PENDING_APPROVAL", null)));

    mockMvc.perform(get("/api/admin/booth-reservations/pending"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].id").value("reservation-1"))
        .andExpect(jsonPath("$[0].status").value("PENDING_APPROVAL"));
  }

  @Test
  void approveReservationReturnsReservedReservationWithQrCode() throws Exception {
    given(approvalService.approveReservation(
        org.mockito.ArgumentMatchers.eq("reservation-1"),
        org.mockito.ArgumentMatchers.any(BoothReservationApprovalRequest.class)))
        .willReturn(reservationResponse(
            "reservation-1",
            "RESERVED",
            "http://localhost:3000/booths/reservations/reservation-1"));

    mockMvc.perform(post("/api/admin/booth-reservations/reservation-1/approve")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                  "approverId": "admin-1",
                  "approverName": "관리자"
                }
                """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.status").value("RESERVED"))
        .andExpect(jsonPath("$.qrCode")
            .value("http://localhost:3000/booths/reservations/reservation-1"));
  }

  @Test
  void approveReservationCanReturnQrFailureCompensationResult() throws Exception {
    given(approvalService.approveReservation(
        org.mockito.ArgumentMatchers.eq("reservation-1"),
        org.mockito.ArgumentMatchers.any(BoothReservationApprovalRequest.class)))
        .willReturn(reservationResponse("reservation-1", "QR_FAILED", null));

    mockMvc.perform(post("/api/admin/booth-reservations/reservation-1/approve")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                  "approverId": "admin-1",
                  "approverName": "관리자",
                  "simulateQrFailure": true
                }
                """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.status").value("QR_FAILED"))
        .andExpect(jsonPath("$.qrCode").value(nullValue()));
  }

  private BoothReservationResponse reservationResponse(String id, String status, String qrCode) {
    LocalDateTime now = LocalDateTime.of(2026, 5, 24, 10, 0);
    return new BoothReservationResponse(
        id,
        "booth-1",
        "user-1",
        "홍길동",
        2,
        status,
        status,
        qrCode,
        List.of(),
        List.of(),
        now,
        now);
  }
}
