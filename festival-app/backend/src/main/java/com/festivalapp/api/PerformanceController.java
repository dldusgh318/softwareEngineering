package com.festivalapp.api;

import com.festivalapp.dto.PerformanceResponse;
import com.festivalapp.service.PerformanceService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/performances")
@RequiredArgsConstructor
public class PerformanceController {

  private final PerformanceService performanceService;

  @GetMapping
  ResponseEntity<List<PerformanceResponse>> getPerformances() {
    return ResponseEntity.ok(performanceService.getPerformances());
  }

  @GetMapping("/{performanceId}")
  ResponseEntity<PerformanceResponse> getPerformance(@PathVariable Long performanceId) {
    return ResponseEntity.ok(performanceService.getPerformance(performanceId));
  }
}
