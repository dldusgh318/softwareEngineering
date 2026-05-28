package com.festivalapp.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.festivalapp.domain.performance.Performance;
import com.festivalapp.domain.ticket.TicketReservation;
import com.festivalapp.domain.ticket.TicketReservationStatus;
import com.festivalapp.dto.TicketReservationCreateRequest;
import com.festivalapp.dto.TicketReservationResponse;
import com.festivalapp.dto.TicketReservationSagaLogResponse;
import com.festivalapp.repository.performance.PerformanceRepository;
import com.festivalapp.repository.ticket.TestTicketReservationDataSource;
import com.festivalapp.repository.ticket.TicketReservationRepository;
import com.festivalapp.service.ticket.TicketQrCodeIssuer;
import com.festivalapp.service.ticket.TicketReservationSagaProcessor;
import com.festivalapp.service.ticket.TicketReservationTransactionService;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

class TicketReservationServiceTest {

  @Test
  void reserveTicketCompletesNormalSagaAndIssuesQrTicket() {
    List<TicketReservation> reservations = new ArrayList<>();
    TicketReservationService ticketReservationService = serviceWith(reservations, performance(2));

    TicketReservationResponse response =
        ticketReservationService.reserveTicket("user-1", new TicketReservationCreateRequest(1L));

    assertThat(response.status()).isEqualTo("COMPLETED");
    assertThat(response.qrCode()).contains("/performances/tickets/");
    assertThat(response.sagaLogs())
        .extracting(TicketReservationSagaLogResponse::step)
        .containsExactly(
            "SEAT_CHECKED",
            "SEAT_HELD",
            "RESERVATION_CREATED",
            "QR_ISSUED",
            "COMPLETED");
    assertThat(reservations).hasSize(1);
    assertThat(reservations.get(0).status()).isEqualTo(TicketReservationStatus.COMPLETED);
  }

  @Test
  void reserveTicketRejectsWhenNoRemainingSeats() {
    List<TicketReservation> reservations =
        new ArrayList<>(List.of(ticketReservation("ticket-1", "user-1", 1L)));
    TicketReservationService ticketReservationService = serviceWith(reservations, performance(1));

    assertThatThrownBy(
            () -> ticketReservationService.reserveTicket("user-2", new TicketReservationCreateRequest(1L)))
        .isInstanceOf(ResponseStatusException.class)
        .extracting("statusCode")
        .isEqualTo(HttpStatus.CONFLICT);
  }

  @Test
  void reserveTicketRejectsDuplicateActiveReservation() {
    List<TicketReservation> reservations =
        new ArrayList<>(List.of(ticketReservation("ticket-1", "user-1", 1L)));
    TicketReservationService ticketReservationService = serviceWith(reservations, performance(2));

    assertThatThrownBy(
            () -> ticketReservationService.reserveTicket("user-1", new TicketReservationCreateRequest(1L)))
        .isInstanceOf(ResponseStatusException.class)
        .extracting("statusCode")
        .isEqualTo(HttpStatus.CONFLICT);
  }

  @Test
  void reserveTicketMarksReservationFailedWhenQrIssueFails() {
    List<TicketReservation> reservations = new ArrayList<>();
    TicketReservationService ticketReservationService =
        serviceWith(
            reservations,
            performance(2),
            new TicketQrCodeIssuer("http://localhost:3000") {
              @Override
              public String issue(TicketReservation reservation) {
                throw new IllegalStateException("QR 발급 실패");
              }
            });

    assertThatThrownBy(
            () -> ticketReservationService.reserveTicket("user-1", new TicketReservationCreateRequest(1L)))
        .isInstanceOf(ResponseStatusException.class)
        .extracting("statusCode")
        .isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    assertThat(reservations).hasSize(1);
    assertThat(reservations.get(0).status()).isEqualTo(TicketReservationStatus.FAILED);
    assertThat(reservations.get(0).isSeatOccupying()).isFalse();
  }

  private TicketReservationService serviceWith(
      List<TicketReservation> reservations,
      Performance performance) {
    return serviceWith(reservations, performance, new TicketQrCodeIssuer("http://localhost:3000"));
  }

  private TicketReservationService serviceWith(
      List<TicketReservation> reservations,
      Performance performance,
      TicketQrCodeIssuer ticketQrCodeIssuer) {
    TicketReservationRepository ticketReservationRepository =
        new TicketReservationRepository(new TestTicketReservationDataSource(reservations));
    TicketReservationTransactionService transactionService =
        new TicketReservationTransactionService(ticketReservationRepository);

    return new TicketReservationService(
        new PerformanceRepository(() -> List.of(performance)),
        ticketReservationRepository,
        new TicketReservationSagaProcessor(transactionService, ticketQrCodeIssuer));
  }

  private Performance performance(int totalSeats) {
    return new Performance(
        1L,
        "와우 스테이지 헤드라이너",
        "헤드라이너 아티스트",
        LocalDateTime.of(2026, 5, 13, 19, 0),
        LocalDateTime.of(2026, 5, 13, 21, 0),
        "대운동장 메인 스테이지",
        "축제 첫날 밤을 여는 메인 스테이지 공연입니다.",
        totalSeats);
  }

  private TicketReservation ticketReservation(String id, String userId, Long performanceId) {
    LocalDateTime now = LocalDateTime.of(2026, 5, 13, 18, 0);
    return new TicketReservation(
        id,
        performanceId,
        userId,
        TicketReservationStatus.COMPLETED,
        "http://localhost:3000/performances/tickets/" + id,
        now,
        now);
  }
}
