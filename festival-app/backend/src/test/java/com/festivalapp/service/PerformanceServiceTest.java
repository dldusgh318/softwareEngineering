package com.festivalapp.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.festivalapp.domain.performance.Performance;
import com.festivalapp.domain.ticket.TicketReservation;
import com.festivalapp.domain.ticket.TicketReservationStatus;
import com.festivalapp.dto.PerformanceResponse;
import com.festivalapp.repository.performance.PerformanceRepository;
import com.festivalapp.repository.ticket.TestTicketReservationDataSource;
import com.festivalapp.repository.ticket.TicketReservationRepository;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

class PerformanceServiceTest {

  @Test
  void getPerformancesIncludesReservedAndRemainingSeats() {
    Performance performance = performance(1L, 500);
    PerformanceService performanceService =
        serviceWith(List.of(performance), List.of(ticketReservation("ticket-1", 1L)));

    List<PerformanceResponse> performances = performanceService.getPerformances();

    assertThat(performances).hasSize(1);
    assertThat(performances.get(0).reservedSeats()).isEqualTo(1);
    assertThat(performances.get(0).remainingSeats()).isEqualTo(499);
  }

  @Test
  void getPerformanceReturnsRemainingSeats() {
    Performance performance = performance(1L, 2);
    PerformanceService performanceService =
        serviceWith(List.of(performance), List.of(ticketReservation("ticket-1", 1L)));

    PerformanceResponse response = performanceService.getPerformance(1L);

    assertThat(response.reservedSeats()).isEqualTo(1);
    assertThat(response.remainingSeats()).isEqualTo(1);
  }

  @Test
  void getPerformanceThrowsNotFoundWhenPerformanceDoesNotExist() {
    PerformanceService performanceService = serviceWith(List.of(), List.of());

    assertThatThrownBy(() -> performanceService.getPerformance(999L))
        .isInstanceOf(ResponseStatusException.class)
        .extracting("statusCode")
        .isEqualTo(HttpStatus.NOT_FOUND);
  }

  private PerformanceService serviceWith(
      List<Performance> performances,
      List<TicketReservation> reservations) {
    return new PerformanceService(
        new PerformanceRepository(() -> performances),
        new TicketReservationRepository(
            new TestTicketReservationDataSource(new ArrayList<>(reservations))));
  }

  private Performance performance(Long id, int totalSeats) {
    return new Performance(
        id,
        "와우 스테이지 헤드라이너",
        "헤드라이너 아티스트",
        LocalDateTime.of(2026, 5, 13, 19, 0),
        LocalDateTime.of(2026, 5, 13, 21, 0),
        "대운동장 메인 스테이지",
        "축제 첫날 밤을 여는 메인 스테이지 공연입니다.",
        totalSeats);
  }

  private TicketReservation ticketReservation(String id, Long performanceId) {
    LocalDateTime now = LocalDateTime.of(2026, 5, 13, 18, 0);
    return new TicketReservation(
        id,
        performanceId,
        "user-1",
        TicketReservationStatus.COMPLETED,
        "http://localhost:3000/performances/tickets/" + id,
        now,
        now);
  }
}
