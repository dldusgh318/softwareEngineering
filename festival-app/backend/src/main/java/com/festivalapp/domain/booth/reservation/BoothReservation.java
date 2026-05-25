package com.festivalapp.domain.booth.reservation;

import java.time.LocalDateTime;

public record BoothReservation(
    String id,
    String boothId,
    String applicantId,
    String applicantName,
    int requestedTables,
    BoothReservationStatus status,
    LocalDateTime createdAt,
    LocalDateTime updatedAt) {}
