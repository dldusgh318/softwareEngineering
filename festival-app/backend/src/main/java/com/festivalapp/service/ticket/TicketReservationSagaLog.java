package com.festivalapp.service.ticket;

import com.festivalapp.dto.TicketReservationSagaLogResponse;
import java.time.LocalDateTime;

public record TicketReservationSagaLog(
    String step,
    String message,
    LocalDateTime createdAt) {

  public TicketReservationSagaLogResponse toResponse() {
    return new TicketReservationSagaLogResponse(step, message, createdAt);
  }
}
