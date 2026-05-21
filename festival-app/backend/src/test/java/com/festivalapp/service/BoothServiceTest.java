package com.festivalapp.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.festivalapp.domain.booth.Booth;
import com.festivalapp.domain.booth.BoothLocation;
import com.festivalapp.dto.BoothResponse;
import com.festivalapp.repository.booth.BoothRepository;
import java.util.List;
import org.junit.jupiter.api.Test;

class BoothServiceTest {

  private final Booth booth =
      new Booth(
          "booth-1",
          "타코야끼 라운지",
          "일식조리 동아리 오코노미",
          "즉석 타코야끼 부스",
          "FOOD",
          "12:00 - 21:00",
          4,
          new BoothLocation("A", "학생회관 앞", "A-03", 26, 34));

  @Test
  void getBoothsMapsBoothAndLocationToResponse() {
    BoothService boothService = boothServiceWith(List.of(booth));

    List<BoothResponse> booths = boothService.getBooths();

    assertThat(booths).hasSize(1);
    assertThat(booths.get(0))
        .extracting(
            BoothResponse::id,
            BoothResponse::name,
            BoothResponse::teamName,
            BoothResponse::category,
            BoothResponse::operatingHours,
            BoothResponse::availableTables)
        .containsExactly(
            "booth-1",
            "타코야끼 라운지",
            "일식조리 동아리 오코노미",
            "FOOD",
            "12:00 - 21:00",
            4);
    assertThat(booths.get(0).location())
        .extracting("zone", "area", "detail", "mapX", "mapY")
        .containsExactly("A", "학생회관 앞", "A-03", 26, 34);
  }

  @Test
  void getBoothReturnsEmptyWhenRepositoryHasNoMatchingBooth() {
    BoothService boothService = boothServiceWith(List.of(booth));

    assertThat(boothService.getBooth("missing-booth")).isEmpty();
  }

  private BoothService boothServiceWith(List<Booth> booths) {
    return new BoothService(new BoothRepository(() -> booths));
  }
}
