package com.festivalapp.repository.booth;

import static org.assertj.core.api.Assertions.assertThat;

import com.festivalapp.domain.booth.Booth;
import com.festivalapp.domain.booth.BoothLocation;
import java.util.List;
import org.junit.jupiter.api.Test;

class BoothRepositoryTest {

  private final Booth tacoBooth =
      new Booth(
          "booth-1",
          "타코야끼 라운지",
          "일식조리 동아리 오코노미",
          "즉석 푸드 부스",
          "FOOD",
          "12:00 - 21:00",
          4,
          new BoothLocation("A", "학생회관 앞", "A-03", 26, 34));
  private final Booth gameBooth =
      new Booth(
          "booth-2",
          "미니 게임 스테이션",
          "게임제작팀",
          "체험형 게임 부스",
          "EXPERIENCE",
          "13:00 - 22:00",
          5,
          new BoothLocation("D", "운동장 입구", "D-02", 40, 70));

  @Test
  void findAllReturnsEveryBoothFromDataSource() {
    BoothRepository boothRepository = new BoothRepository(() -> List.of(tacoBooth, gameBooth));

    List<Booth> booths = boothRepository.findAll();

    assertThat(booths).containsExactly(tacoBooth, gameBooth);
  }

  @Test
  void findByIdReturnsMatchingBooth() {
    BoothRepository boothRepository = new BoothRepository(() -> List.of(tacoBooth, gameBooth));

    assertThat(boothRepository.findById("booth-2")).contains(gameBooth);
  }

  @Test
  void findByIdReturnsEmptyWhenBoothDoesNotExist() {
    BoothRepository boothRepository = new BoothRepository(() -> List.of(tacoBooth));

    assertThat(boothRepository.findById("missing-booth")).isEmpty();
  }
}
