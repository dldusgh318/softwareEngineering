package com.festivalapp.service.ticket;

import com.festivalapp.dto.TicketReservationSagaLogResponse;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class TicketReservationSagaLogs {

  private final List<TicketReservationSagaLog> logs = new ArrayList<>();

  public void add(String step, String message, LocalDateTime createdAt) {
    logs.add(new TicketReservationSagaLog(step, message, createdAt));
  }

  public List<TicketReservationSagaLogResponse> toResponses() {
    return logs.stream()
        .map(TicketReservationSagaLog::toResponse)
        .toList();
  }
}
