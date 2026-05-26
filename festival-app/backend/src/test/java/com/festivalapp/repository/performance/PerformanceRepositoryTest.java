package com.festivalapp.repository.performance;

import static org.assertj.core.api.Assertions.assertThat;

import com.festivalapp.domain.performance.Performance;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;

class PerformanceRepositoryTest {

  @Test
  void findAllReturnsPerformancesSortedByStartTime() {
    Performance latePerformance =
        performance(2L, "늦은 공연", LocalDateTime.of(2026, 5, 14, 20, 0));
    Performance earlyPerformance =
        performance(1L, "이른 공연", LocalDateTime.of(2026, 5, 14, 18, 0));
    PerformanceRepository performanceRepository =
        new PerformanceRepository(() -> List.of(latePerformance, earlyPerformance));

    List<Performance> performances = performanceRepository.findAll();

    assertThat(performances).containsExactly(earlyPerformance, latePerformance);
  }

  @Test
  void findByIdReturnsMatchingPerformance() {
    Performance performance =
        performance(1L, "와우 스테이지 헤드라이너", LocalDateTime.of(2026, 5, 13, 19, 0));
    PerformanceRepository performanceRepository = new PerformanceRepository(() -> List.of(performance));

    assertThat(performanceRepository.findById(1L)).contains(performance);
    assertThat(performanceRepository.findById(999L)).isEmpty();
  }

  private Performance performance(Long id, String title, LocalDateTime startsAt) {
    return new Performance(
        id,
        title,
        "아티스트",
        startsAt,
        startsAt.plusHours(2),
        "메인무대",
        "공연 설명입니다.",
        100);
  }
}
