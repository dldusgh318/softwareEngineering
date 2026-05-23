package com.festivalapp.dto;

import java.time.LocalDateTime;

public record TimelineEventResponse(
    Long id,
    String title,
    String category,
    LocalDateTime startsAt,
    LocalDateTime endsAt,
    String location,
    String description,
    String status) {}
