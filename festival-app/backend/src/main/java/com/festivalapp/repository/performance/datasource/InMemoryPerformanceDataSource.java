package com.festivalapp.repository.performance.datasource;

import com.festivalapp.domain.performance.Performance;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class InMemoryPerformanceDataSource implements PerformanceDataSource {

  private final List<Performance> performances =
      List.of(
          performance(
              1L,
              "와우 스테이지 헤드라이너",
              "헤드라이너 아티스트",
              2026,
              5,
              13,
              19,
              0,
              21,
              0,
              "대운동장 메인 스테이지",
              "축제 첫날 밤을 여는 메인 스테이지 공연입니다.",
              500,
              372),
          performance(
              2L,
              "동아리 밴드 쇼케이스",
              "학생 밴드 연합",
              2026,
              5,
              14,
              18,
              0,
              19,
              30,
              "학생회관 야외무대",
              "교내 밴드 동아리들이 준비한 라이브 쇼케이스입니다.",
              220,
              156),
          performance(
              3L,
              "WOW DJ Festival",
              "WOW DJ Crew",
              2026,
              5,
              15,
              20,
              0,
              23,
              30,
              "운동장 DJ 스테이지",
              "축제 마지막 밤을 채우는 DJ 페스티벌 공연입니다.",
              800,
              615));

  @Override
  public List<Performance> findAll() {
    return performances;
  }

  private static Performance performance(
      Long id,
      String title,
      String artist,
      int year,
      int month,
      int day,
      int startHour,
      int startMinute,
      int endHour,
      int endMinute,
      String location,
      String description,
      int totalSeats,
      int reservedSeats) {
    return new Performance(
        id,
        title,
        artist,
        LocalDateTime.of(year, month, day, startHour, startMinute),
        LocalDateTime.of(year, month, day, endHour, endMinute),
        location,
        description,
        totalSeats,
        reservedSeats);
  }
}
