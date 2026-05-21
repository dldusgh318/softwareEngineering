package com.festivalapp.service;

import com.festivalapp.domain.timeline.TimelineEvent;
import com.festivalapp.dto.TimelineEventResponse;
import com.festivalapp.repository.timeline.TimelineRepository;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TimelineService {

  private final TimelineRepository timelineRepository;

  public List<TimelineEventResponse> getTimeline(LocalDate date) {
    var timelineEvents = date == null
        ? timelineRepository.findAll()
        : timelineRepository.findByDate(date);

    return timelineEvents.stream()
        .map(this::toResponse)
        .toList();
  }

  private TimelineEventResponse toResponse(TimelineEvent event) {
    return new TimelineEventResponse(
        event.id(),
        event.title(),
        event.category(),
        event.startsAt(),
        event.endsAt(),
        event.location());
  }
}
