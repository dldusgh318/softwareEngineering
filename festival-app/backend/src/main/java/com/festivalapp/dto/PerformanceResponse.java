package com.festivalapp.dto;

import com.festivalapp.domain.performance.Performance;
import java.time.LocalDateTime;

public record PerformanceResponse(
    Long id,
    String title,
    String artist,
    LocalDateTime startsAt,
    LocalDateTime endsAt,
    String location,
    String description,
    int totalSeats,
    int remainingSeats) {

  public static PerformanceResponse from(Performance performance, int remainingSeats) {
    return new PerformanceResponse(
        performance.id(),
        performance.title(),
        performance.artist(),
        performance.startsAt(),
        performance.endsAt(),
        performance.location(),
        performance.description(),
        performance.totalSeats(),
        remainingSeats);
  }
}
