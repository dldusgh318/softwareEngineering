package com.festivalapp.domain.timeline;

import java.time.LocalDateTime;

public record TimelineEvent(
    Long id,
    String title,
    String category,
    LocalDateTime startsAt,
    LocalDateTime endsAt,
    String location) {}
