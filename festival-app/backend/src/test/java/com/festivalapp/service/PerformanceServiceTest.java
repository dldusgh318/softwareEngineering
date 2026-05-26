package com.festivalapp.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.festivalapp.domain.performance.Performance;
import com.festivalapp.dto.PerformanceResponse;
import com.festivalapp.repository.performance.PerformanceRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

class PerformanceServiceTest {

  @Test
  void getPerformancesIncludesRemainingSeats() {
    Performance performance =
        new Performance(
            1L,
            "와우 스테이지 헤드라이너",
            "헤드라이너 아티스트",
            LocalDateTime.of(2026, 5, 13, 19, 0),
            LocalDateTime.of(2026, 5, 13, 21, 0),
            "대운동장 메인 스테이지",
            "축제 첫날 밤을 여는 메인 스테이지 공연입니다.",
            500,
            372);
    PerformanceService performanceService =
        new PerformanceService(new PerformanceRepository(() -> List.of(performance)));

    List<PerformanceResponse> performances = performanceService.getPerformances();

    assertThat(performances).hasSize(1);
    assertThat(performances.get(0).remainingSeats()).isEqualTo(128);
  }

  @Test
  void getPerformanceThrowsNotFoundWhenPerformanceDoesNotExist() {
    PerformanceService performanceService =
        new PerformanceService(new PerformanceRepository(List::of));

    assertThatThrownBy(() -> performanceService.getPerformance(999L))
        .isInstanceOf(ResponseStatusException.class)
        .extracting("statusCode")
        .isEqualTo(HttpStatus.NOT_FOUND);
  }
}
