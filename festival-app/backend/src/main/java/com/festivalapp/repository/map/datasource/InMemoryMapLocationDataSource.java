package com.festivalapp.repository.map.datasource;

import com.festivalapp.domain.map.MapLocation;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class InMemoryMapLocationDataSource implements MapLocationDataSource {

  private final List<MapLocation> mapLocations =
      List.of(
          location(1L, "메인무대", "STAGE", 35, 28, 11, 18, "운동장 왼쪽 상단에 위치한 메인 공연 무대입니다."),
          location(2L, "무대존", "STAGE", 43, 78, 36, 18, "메인무대 관람과 주요 무대 프로그램을 위한 관람 구역입니다."),
          location(3L, "낮/밤 주점 부스", "BOOTH", 54, 42, 30, 25, "운동장 중앙에 배치된 낮 부스와 야간 주점 운영 구역입니다."),
          location(4L, "WOW DJ Festival", "STAGE", 80, 46, 15, 23, "운동장 오른쪽에서 진행되는 DJ 페스티벌 구역입니다."),
          location(5L, "체험형 부스", "BOOTH", 58, 8, 20, 6, "G동과 Q동 방향 상단 보행로에 위치한 체험형 부스 구역입니다."),
          location(6L, "플리마켓", "BOOTH", 8, 57, 11, 6, "R동 인근 왼쪽 보행로에 위치한 플리마켓 구역입니다."),
          location(7L, "입장 부스", "INFO", 70, 32, 10, 11, "입장 확인과 현장 안내가 진행되는 입장 부스입니다."),
          location(8L, "화장실", "AMENITY", 88, 34, 9, 7, "Z2동 방향에 위치한 행사장 인근 화장실입니다."));

  @Override
  public List<MapLocation> findAll() {
    return mapLocations;
  }

  private static MapLocation location(
      Long id,
      String name,
      String category,
      double x,
      double y,
      double width,
      double height,
      String description) {
    return new MapLocation(id, name, category, x, y, width, height, description);
  }
}
