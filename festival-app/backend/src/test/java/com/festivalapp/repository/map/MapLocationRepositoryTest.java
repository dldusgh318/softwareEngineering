package com.festivalapp.repository.map;

import static org.assertj.core.api.Assertions.assertThat;

import com.festivalapp.domain.map.MapLocation;
import java.util.List;
import org.junit.jupiter.api.Test;

class MapLocationRepositoryTest {

  @Test
  void findAllReturnsMapLocationsWithCoordinatesAndCategory() {
    MapLocation mainStage =
        new MapLocation(1L, "메인무대", "STAGE", 50, 30, 18, 12, "중앙 공연장입니다.");
    MapLocation boothZone =
        new MapLocation(2L, "낮 부스존", "BOOTH", 31, 49, 22, 16, "체험 부스 구역입니다.");
    MapLocationRepository mapLocationRepository =
        new MapLocationRepository(() -> List.of(mainStage, boothZone));

    List<MapLocation> mapLocations = mapLocationRepository.findAll();

    assertThat(mapLocations).containsExactly(mainStage, boothZone);
    assertThat(mapLocations)
        .allSatisfy(location -> {
          assertThat(location.category()).isNotBlank();
          assertThat(location.x()).isBetween(0.0, 100.0);
          assertThat(location.y()).isBetween(0.0, 100.0);
        });
  }
}
