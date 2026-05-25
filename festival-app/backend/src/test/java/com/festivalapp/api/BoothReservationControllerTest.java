package com.festivalapp.api;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.festivalapp.dto.BoothReservationCreateRequest;
import com.festivalapp.dto.BoothReservationResponse;
import com.festivalapp.service.BoothReservationService;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

class BoothReservationControllerTest {

  private final BoothReservationService boothReservationService = mock(BoothReservationService.class);
  private MockMvc mockMvc;

  @BeforeEach
  void setUp() {
    mockMvc = MockMvcBuilders
        .standaloneSetup(new BoothReservationController(boothReservationService))
        .build();
  }

  @Test
  void createReservationReturnsCreatedPendingApprovalReservation() throws Exception {
    given(boothReservationService.createReservation(any(BoothReservationCreateRequest.class)))
        .willReturn(reservationResponse("reservation-1", "user-1"));

    mockMvc.perform(post("/api/booth-reservations")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                  "boothId": "booth-1",
                  "applicantId": "user-1",
                  "applicantName": "홍길동",
                  "requestedTables": 2
                }
                """))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").value("reservation-1"))
        .andExpect(jsonPath("$.status").value("PENDING_APPROVAL"))
        .andExpect(jsonPath("$.statusDescription").value("관리자 승인 대기"));
  }

  @Test
  void getReservationsByApplicantReturnsUsersReservations() throws Exception {
    given(boothReservationService.getReservationsByApplicant("user-1"))
        .willReturn(List.of(reservationResponse("reservation-1", "user-1")));

    mockMvc.perform(get("/api/booth-reservations/applicants/user-1"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].id").value("reservation-1"))
        .andExpect(jsonPath("$[0].applicantId").value("user-1"));
  }

  private BoothReservationResponse reservationResponse(String id, String applicantId) {
    LocalDateTime now = LocalDateTime.of(2026, 5, 24, 10, 0);
    return new BoothReservationResponse(
        id, "booth-1", applicantId, "홍길동", 2, "PENDING_APPROVAL", "관리자 승인 대기", now, now);
  }
}
