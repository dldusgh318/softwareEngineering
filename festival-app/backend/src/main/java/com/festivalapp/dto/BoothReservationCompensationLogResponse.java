package com.festivalapp.dto;

import java.time.LocalDateTime;

public record BoothReservationCompensationLogResponse(
    String step,
    String reason,
    String fromStatus,
    String toStatus,
    LocalDateTime createdAt) {}
