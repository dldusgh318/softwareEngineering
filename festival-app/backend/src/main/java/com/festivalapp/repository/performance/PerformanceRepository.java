package com.festivalapp.repository.performance;

import com.festivalapp.domain.performance.Performance;
import com.festivalapp.repository.performance.datasource.PerformanceDataSource;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class PerformanceRepository {

  private final PerformanceDataSource performanceDataSource;

  public List<Performance> findAll() {
    return performanceDataSource.findAll().stream()
        .sorted(Comparator.comparing(Performance::startsAt))
        .toList();
  }

  public Optional<Performance> findById(Long performanceId) {
    return performanceDataSource.findAll().stream()
        .filter(performance -> performance.id().equals(performanceId))
        .findFirst();
  }
}
