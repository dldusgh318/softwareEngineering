package com.festivalapp.domain.performance;

import java.time.LocalDateTime;

public record Performance(
    Long id,
    String title,
    String artist,
    LocalDateTime startsAt,
    LocalDateTime endsAt,
    String location,
    String description,
    int totalSeats) {}
