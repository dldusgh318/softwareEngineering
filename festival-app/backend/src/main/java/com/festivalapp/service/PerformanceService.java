package com.festivalapp.service;

import com.festivalapp.dto.PerformanceResponse;
import com.festivalapp.repository.performance.PerformanceRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class PerformanceService {

  private final PerformanceRepository performanceRepository;

  public List<PerformanceResponse> getPerformances() {
    return performanceRepository.findAll().stream()
        .map(PerformanceResponse::from)
        .toList();
  }

  public PerformanceResponse getPerformance(Long performanceId) {
    return performanceRepository.findById(performanceId)
        .map(PerformanceResponse::from)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "공연을 찾을 수 없습니다."));
  }
}
