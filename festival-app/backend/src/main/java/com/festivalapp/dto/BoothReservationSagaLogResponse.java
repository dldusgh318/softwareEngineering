package com.festivalapp.dto;

import java.time.LocalDateTime;

public record BoothReservationSagaLogResponse(
    String step,
    String message,
    LocalDateTime createdAt) {}
