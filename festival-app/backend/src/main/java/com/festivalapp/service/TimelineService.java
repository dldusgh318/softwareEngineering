package com.festivalapp.service;

import com.festivalapp.domain.timeline.TimelineEvent;
import com.festivalapp.domain.timeline.TimelineEventStatus;
import com.festivalapp.dto.TimelineEventResponse;
import com.festivalapp.repository.timeline.TimelineRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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

  public TimelineEventResponse getTimelineEvent(Long timelineId) {
    return timelineRepository.findById(timelineId)
        .map(this::toResponse)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "행사를 찾을 수 없습니다."));
  }

  private TimelineEventResponse toResponse(TimelineEvent event) {
    return new TimelineEventResponse(
        event.id(),
        event.title(),
        event.category(),
        event.startsAt(),
        event.endsAt(),
        event.location(),
        event.description(),
        resolveStatus(event).name());
  }

  private TimelineEventStatus resolveStatus(TimelineEvent event) {
    LocalDateTime now = LocalDateTime.now();

    if (now.isBefore(event.startsAt())) {
      return TimelineEventStatus.SCHEDULED;
    }

    if (now.isAfter(event.endsAt()) || now.isEqual(event.endsAt())) {
      return TimelineEventStatus.ENDED;
    }

    return TimelineEventStatus.ONGOING;
  }
}
