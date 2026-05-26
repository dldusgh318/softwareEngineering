package com.festivalapp.dto;

import com.festivalapp.domain.ticket.TicketReservation;
import java.time.LocalDateTime;
import java.util.List;

public record TicketReservationResponse(
    String id,
    Long performanceId,
    String userId,
    String status,
    String statusDescription,
    String qrCode,
    List<TicketReservationSagaLogResponse> sagaLogs,
    LocalDateTime createdAt,
    LocalDateTime updatedAt) {

  public static TicketReservationResponse from(
      TicketReservation reservation,
      List<TicketReservationSagaLogResponse> sagaLogs) {
    return new TicketReservationResponse(
        reservation.id(),
        reservation.performanceId(),
        reservation.userId(),
        reservation.status().name(),
        reservation.status().getDescription(),
        reservation.qrCode(),
        sagaLogs,
        reservation.createdAt(),
        reservation.updatedAt());
  }
}
