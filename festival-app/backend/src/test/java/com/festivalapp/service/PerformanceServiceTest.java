package com.festivalapp.service;

import static org.assertj.core.api.Assertions.assertThat;

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

class PerformanceServiceTest {

  @Test
  void getPerformanceReturnsRemainingSeats() {
    Performance performance =
        new Performance(
            1L,
            "와우 스테이지 헤드라이너",
            "헤드라이너 아티스트",
            LocalDateTime.of(2026, 5, 13, 19, 0),
            LocalDateTime.of(2026, 5, 13, 21, 0),
            "대운동장 메인 스테이지",
            "축제 첫날 밤을 여는 메인 스테이지 공연입니다.",
            2);
    TicketReservationRepository ticketReservationRepository =
        new TicketReservationRepository(
            new TestTicketReservationDataSource(
                new ArrayList<>(List.of(ticketReservation("ticket-1", 1L)))));
    PerformanceService performanceService =
        new PerformanceService(new PerformanceRepository(() -> List.of(performance)), ticketReservationRepository);

    PerformanceResponse response = performanceService.getPerformance(1L);

    assertThat(response.remainingSeats()).isEqualTo(1);
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
