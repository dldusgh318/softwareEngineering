package com.festivalapp.api;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.festivalapp.domain.auth.UserRole;
import com.festivalapp.dto.TicketReservationCreateRequest;
import com.festivalapp.dto.TicketReservationResponse;
import com.festivalapp.dto.TicketReservationSagaLogResponse;
import com.festivalapp.security.AuthenticatedUser;
import com.festivalapp.service.TicketReservationService;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

class TicketReservationControllerTest {

  private final TicketReservationService ticketReservationService = mock(TicketReservationService.class);
  private MockMvc mockMvc;

  @BeforeEach
  void setUp() {
    mockMvc = MockMvcBuilders
        .standaloneSetup(new TicketReservationController(ticketReservationService))
        .build();
  }

  @Test
  void reserveTicketReturnsCreatedCompletedReservation() throws Exception {
    given(ticketReservationService.reserveTicket(
        eq("user-1"),
        any(TicketReservationCreateRequest.class)))
        .willReturn(ticketReservationResponse());

    mockMvc.perform(post("/api/ticket-reservations")
            .principal(authenticatedUser("user-1"))
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                  "performanceId": 1
                }
                """))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.status").value("COMPLETED"))
        .andExpect(jsonPath("$.qrCode")
            .value("http://localhost:3000/performances/tickets/ticket-1"))
        .andExpect(jsonPath("$.sagaLogs[0].step").value("SEAT_CHECKED"))
        .andExpect(jsonPath("$.sagaLogs[4].step").value("COMPLETED"));
  }

  @Test
  void reserveTicketRequiresAuthentication() throws Exception {
    mockMvc.perform(post("/api/ticket-reservations")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                  "performanceId": 1
                }
                """))
        .andExpect(status().isUnauthorized());
  }

  @Test
  void getMyReservationReturnsReservation() throws Exception {
    given(ticketReservationService.getMyReservation("user-1", "ticket-1"))
        .willReturn(ticketReservationResponse());

    mockMvc.perform(get("/api/ticket-reservations/ticket-1")
            .principal(authenticatedUser("user-1")))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value("ticket-1"));
  }

  private TicketReservationResponse ticketReservationResponse() {
    LocalDateTime now = LocalDateTime.of(2026, 5, 13, 19, 0);
    return new TicketReservationResponse(
        "ticket-1",
        1L,
        "user-1",
        "COMPLETED",
        "예매 완료",
        "http://localhost:3000/performances/tickets/ticket-1",
        List.of(
            new TicketReservationSagaLogResponse("SEAT_CHECKED", "잔여 좌석을 확인했습니다.", now),
            new TicketReservationSagaLogResponse("SEAT_HELD", "좌석을 선점했습니다.", now),
            new TicketReservationSagaLogResponse("RESERVATION_CREATED", "예매 정보를 생성했습니다.", now),
            new TicketReservationSagaLogResponse("QR_ISSUED", "QR 티켓을 발급했습니다.", now),
            new TicketReservationSagaLogResponse("COMPLETED", "예매를 완료했습니다.", now)),
        now,
        now);
  }

  private Authentication authenticatedUser(String userId) {
    return new TestingAuthenticationToken(
        new AuthenticatedUser(userId, userId + "@hongik.ac.kr", UserRole.USER),
        null);
  }
}
