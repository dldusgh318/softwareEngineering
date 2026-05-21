package com.festivalapp.repository.timeline;

import com.festivalapp.domain.timeline.TimelineEvent;
import com.festivalapp.repository.timeline.datasource.TimelineDataSource;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class TimelineRepository {

  private final TimelineDataSource timelineDataSource;

  public List<TimelineEvent> findAll() {
    return timelineDataSource.findAll();
  }

  public List<TimelineEvent> findByDate(LocalDate date) {
    return timelineDataSource.findAll().stream()
        .filter(event -> overlapsDate(event, date))
        .toList();
  }

  private boolean overlapsDate(TimelineEvent event, LocalDate date) {
    LocalDateTime dayStart = date.atStartOfDay();
    LocalDateTime dayEnd = date.plusDays(1).atStartOfDay();

    return event.startsAt().isBefore(dayEnd) && !event.endsAt().isBefore(dayStart);
  }
}
