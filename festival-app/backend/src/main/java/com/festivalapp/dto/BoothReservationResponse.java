package com.festivalapp.dto;

import com.festivalapp.domain.booth.reservation.BoothReservation;
import java.time.LocalDateTime;
import java.util.List;

public record BoothReservationResponse(
    String id,
    String boothId,
    String applicantId,
    String applicantName,
    int requestedTables,
    String status,
    String statusDescription,
    String qrCode,
    List<BoothReservationSagaLogResponse> sagaLogs,
    LocalDateTime createdAt,
    LocalDateTime updatedAt) {

  public static BoothReservationResponse from(BoothReservation reservation) {
    return from(reservation, List.of());
  }

  public static BoothReservationResponse from(
      BoothReservation reservation,
      List<BoothReservationSagaLogResponse> sagaLogs) {
    return new BoothReservationResponse(
        reservation.id(),
        reservation.boothId(),
        reservation.applicantId(),
        reservation.applicantName(),
        reservation.requestedTables(),
        reservation.status().name(),
        reservation.status().getDescription(),
        reservation.qrCode(),
        sagaLogs,
        reservation.createdAt(),
        reservation.updatedAt());
  }
}
