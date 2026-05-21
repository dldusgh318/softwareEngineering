package com.festivalapp.repository.timeline;

import static org.assertj.core.api.Assertions.assertThat;

import com.festivalapp.domain.timeline.TimelineEvent;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;

class TimelineRepositoryTest {

  @Test
  void findByDateReturnsEventsThatOverlapTheDate() {
    LocalDate day1 = LocalDate.of(2026, 5, 13);
    LocalDate day2 = LocalDate.of(2026, 5, 14);
    TimelineEvent previousDayEvent =
        new TimelineEvent(
            1L,
            "와우 디제이 페스티벌",
            "DJ",
            LocalDateTime.of(2026, 5, 13, 19, 0),
            LocalDateTime.of(2026, 5, 14, 0, 0),
            "운동장");
    TimelineEvent selectedDayEvent =
        new TimelineEvent(
            2L,
            "체험형 부스",
            "EXPERIENCE",
            LocalDateTime.of(2026, 5, 14, 11, 0),
            LocalDateTime.of(2026, 5, 14, 17, 0),
            "와우관 오른쪽, Q동 앞");
    TimelineEvent nextDayEvent =
        new TimelineEvent(
            3L,
            "다음날 행사",
            "STAGE",
            LocalDateTime.of(2026, 5, 15, 17, 0),
            LocalDateTime.of(2026, 5, 15, 19, 0),
            "메인무대");
    TimelineRepository timelineRepository =
        new TimelineRepository(() -> List.of(previousDayEvent, selectedDayEvent, nextDayEvent));

    List<TimelineEvent> timelineEvents = timelineRepository.findByDate(day2);

    assertThat(timelineEvents).containsExactly(previousDayEvent, selectedDayEvent);
    assertThat(timelineRepository.findByDate(day1)).contains(previousDayEvent);
  }
}
