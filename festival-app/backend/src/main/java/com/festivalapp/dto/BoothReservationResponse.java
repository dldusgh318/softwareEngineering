package com.festivalapp.dto;

import com.festivalapp.domain.booth.reservation.BoothReservation;
import java.time.LocalDateTime;

public record BoothReservationResponse(
    String id,
    String boothId,
    String applicantId,
    String applicantName,
    int requestedTables,
    String status,
    String statusDescription,
    LocalDateTime createdAt,
    LocalDateTime updatedAt) {

  public static BoothReservationResponse from(BoothReservation reservation) {
    return new BoothReservationResponse(
        reservation.id(),
        reservation.boothId(),
        reservation.applicantId(),
        reservation.applicantName(),
        reservation.requestedTables(),
        reservation.status().name(),
        reservation.status().getDescription(),
        reservation.createdAt(),
        reservation.updatedAt());
  }
}
