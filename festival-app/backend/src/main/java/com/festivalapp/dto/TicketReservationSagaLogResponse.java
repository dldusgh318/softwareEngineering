package com.festivalapp.dto;

import java.time.LocalDateTime;

public record TicketReservationSagaLogResponse(
    String step,
    String message,
    LocalDateTime createdAt) {}
