package com.festivalapp.service;

import com.festivalapp.dto.TimelineEventResponse;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class TimelineService {

  public List<TimelineEventResponse> getTimeline() {
    return List.of(
        new TimelineEventResponse(
            1L, "입장 오픈", "INFO", LocalDateTime.of(2026, 5, 22, 10, 0), LocalDateTime.of(2026, 5, 22, 10, 30), "정문"),
        new TimelineEventResponse(
            2L, "푸드존 운영", "FOOD", LocalDateTime.of(2026, 5, 22, 11, 0), LocalDateTime.of(2026, 5, 22, 20, 0), "푸드존"),
        new TimelineEventResponse(
            3L, "Opening Stage", "STAGE", LocalDateTime.of(2026, 5, 22, 18, 0), LocalDateTime.of(2026, 5, 22, 19, 30), "Main Stage"));
  }
}
