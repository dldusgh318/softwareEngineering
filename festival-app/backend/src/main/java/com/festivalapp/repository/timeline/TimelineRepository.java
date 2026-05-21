package com.festivalapp.repository.timeline;

import com.festivalapp.domain.timeline.TimelineEvent;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public class TimelineRepository {

  private static final LocalDate DAY_1 = LocalDate.of(2026, 5, 13);
  private static final LocalDate DAY_2 = LocalDate.of(2026, 5, 14);
  private static final LocalDate DAY_3 = LocalDate.of(2026, 5, 15);

  private final List<TimelineEvent> timelineEvents =
      List.of(
          event(1L, "체험형 부스", "EXPERIENCE", DAY_1, 11, 0, DAY_1, 17, 0, "와우관 오른쪽, Q동 앞"),
          event(2L, "플리마켓", "MARKET", DAY_1, 11, 0, DAY_1, 17, 0, "홍문관 신한은행 앞"),
          event(3L, "굿즈샵", "GOODS", DAY_1, 12, 0, DAY_1, 18, 0, "아트앤디자인밸리 앞"),
          event(4L, "스탬프 투어", "TOUR", DAY_1, 12, 0, DAY_1, 17, 0, "축제장 일대"),
          event(5L, "낮 부스", "BOOTH", DAY_1, 12, 0, DAY_1, 16, 0, "운동장"),
          event(6L, "홍대존 입장", "ENTRY", DAY_1, 12, 30, DAY_1, 23, 59, "홍대존"),
          event(7L, "밤 주점 부스", "BAR", DAY_1, 16, 0, DAY_1, 23, 0, "운동장"),
          event(8L, "주류 판매 부스", "ALCOHOL", DAY_1, 16, 0, DAY_1, 23, 0, "운동장 내부"),
          event(9L, "재주꾼 선발대회", "STAGE", DAY_1, 17, 0, DAY_1, 19, 30, "메인무대"),
          event(10L, "와우 디제이 페스티벌", "DJ", DAY_1, 19, 0, DAY_2, 0, 0, "운동장"),
          event(11L, "메인무대", "STAGE", DAY_1, 19, 30, DAY_1, 22, 30, "메인무대"),
          event(12L, "체험형 부스", "EXPERIENCE", DAY_2, 11, 0, DAY_2, 17, 0, "와우관 오른쪽, Q동 앞"),
          event(13L, "플리마켓", "MARKET", DAY_2, 11, 0, DAY_2, 17, 0, "홍문관 신한은행 앞"),
          event(14L, "굿즈샵", "GOODS", DAY_2, 12, 0, DAY_2, 18, 0, "아트앤디자인밸리 앞"),
          event(15L, "스탬프 투어", "TOUR", DAY_2, 12, 0, DAY_2, 17, 0, "축제장 일대"),
          event(16L, "낮 부스", "BOOTH", DAY_2, 12, 0, DAY_2, 16, 0, "운동장"),
          event(17L, "홍대존 입장", "ENTRY", DAY_2, 12, 30, DAY_2, 23, 59, "홍대존"),
          event(18L, "밤 주점 부스", "BAR", DAY_2, 16, 0, DAY_2, 23, 0, "운동장"),
          event(19L, "주류 판매 부스", "ALCOHOL", DAY_2, 16, 0, DAY_2, 23, 0, "운동장 내부"),
          event(20L, "학생 중앙 무대", "STAGE", DAY_2, 17, 0, DAY_2, 19, 30, "메인무대"),
          event(21L, "와우 디제이 페스티벌", "DJ", DAY_2, 18, 30, DAY_3, 0, 0, "운동장"),
          event(22L, "메인무대", "STAGE", DAY_2, 19, 30, DAY_2, 22, 30, "메인무대"),
          event(23L, "체험형 부스", "EXPERIENCE", DAY_3, 11, 0, DAY_3, 17, 0, "와우관 오른쪽, Q동 앞"),
          event(24L, "플리마켓", "MARKET", DAY_3, 11, 0, DAY_3, 17, 0, "홍문관 신한은행 앞"),
          event(25L, "굿즈샵", "GOODS", DAY_3, 12, 0, DAY_3, 18, 0, "아트앤디자인밸리 앞"),
          event(26L, "스탬프 투어", "TOUR", DAY_3, 12, 0, DAY_3, 17, 0, "축제장 일대"),
          event(27L, "낮 부스", "BOOTH", DAY_3, 12, 0, DAY_3, 16, 0, "운동장"),
          event(28L, "홍대존 입장", "ENTRY", DAY_3, 12, 30, DAY_3, 23, 59, "홍대존"),
          event(29L, "밤 주점 부스", "BAR", DAY_3, 16, 0, DAY_3, 23, 0, "운동장"),
          event(30L, "주류 판매 부스", "ALCOHOL", DAY_3, 16, 0, DAY_3, 23, 0, "운동장 내부"),
          event(31L, "학생 중앙 무대", "STAGE", DAY_3, 17, 0, DAY_3, 19, 10, "메인무대"),
          event(32L, "와우 디제이 페스티벌", "DJ", DAY_3, 19, 0, DAY_3.plusDays(1), 0, 0, "운동장"),
          event(33L, "메인무대", "STAGE", DAY_3, 19, 10, DAY_3, 22, 30, "메인무대"),
          event(34L, "Memento:MORAE", "SPECIAL", DAY_3, 22, 30, DAY_3.plusDays(1), 1, 0, "메인무대"));

  public List<TimelineEvent> findAll() {
    return timelineEvents;
  }

  public List<TimelineEvent> findByDate(LocalDate date) {
    return timelineEvents.stream()
        .filter(event -> event.startsAt().toLocalDate().equals(date))
        .toList();
  }

  private static TimelineEvent event(
      Long id,
      String title,
      String category,
      LocalDate startDate,
      int startHour,
      int startMinute,
      LocalDate endDate,
      int endHour,
      int endMinute,
      String location) {
    return new TimelineEvent(
        id,
        title,
        category,
        LocalDateTime.of(startDate, LocalTime.of(startHour, startMinute)),
        LocalDateTime.of(endDate, LocalTime.of(endHour, endMinute)),
        location);
  }
}
