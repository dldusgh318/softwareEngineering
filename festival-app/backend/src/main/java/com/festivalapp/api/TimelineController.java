package com.festivalapp.api;

import com.festivalapp.dto.TimelineEventResponse;
import com.festivalapp.service.TimelineService;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/timeline")
@RequiredArgsConstructor
public class TimelineController {

  private final TimelineService timelineService;

  @GetMapping
  ResponseEntity<List<TimelineEventResponse>> getTimeline(
      @RequestParam(required = false) LocalDate date) {
    return ResponseEntity.ok(timelineService.getTimeline(date));
  }
}
