package com.festivalapp.api;

import com.festivalapp.dto.TimelineEventResponse;
import com.festivalapp.service.TimelineService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/timeline")
public class TimelineController {

  private final TimelineService timelineService;

  public TimelineController(TimelineService timelineService) {
    this.timelineService = timelineService;
  }

  @GetMapping
  List<TimelineEventResponse> timeline() {
    return timelineService.getTimeline();
  }
}
