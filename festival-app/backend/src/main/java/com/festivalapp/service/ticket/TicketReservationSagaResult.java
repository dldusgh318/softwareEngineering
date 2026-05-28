package com.festivalapp.service.ticket;

import com.festivalapp.domain.ticket.TicketReservation;
import com.festivalapp.dto.TicketReservationResponse;

public record TicketReservationSagaResult(
    TicketReservation reservation,
    TicketReservationSagaLogs logs) {

  public TicketReservationResponse toResponse() {
    return TicketReservationResponse.from(reservation, logs.toResponses());
  }
}
