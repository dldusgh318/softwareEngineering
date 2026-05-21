package com.festivalapp.repository.booth.datasource;

import com.festivalapp.domain.booth.Booth;
import com.festivalapp.domain.booth.BoothLocation;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class InMemoryBoothDataSource implements BoothDataSource {

  private final List<Booth> booths =
      List.of(
          booth("booth-1", "타코야끼 라운지", "일식조리 동아리 오코노미",
              "즉석 타코야끼와 야키소바를 판매하는 푸드 부스입니다. 저녁 시간대 예약 수요가 높습니다.",
              "FOOD", "12:00 - 21:00", 4, "A", "학생회관 앞", "A-03", 26, 34),
          booth("booth-2", "포토카드 교환소", "미디어콘텐츠학회 Lens",
              "축제 한정 포토카드와 굿즈를 교환하고 보관할 수 있는 커뮤니티 부스입니다.",
              "GOODS", "10:00 - 19:00", 2, "B", "중앙광장", "B-11", 58, 46),
          booth("booth-3", "동아리 굿즈 마켓", "창작연합 편집부",
              "학생 창작 굿즈, 스티커, 엽서를 판매하는 마켓형 부스입니다.",
              "GOODS", "11:00 - 20:00", 3, "C", "홍문관 뒤", "C-07", 72, 28),
          booth("booth-4", "미니 게임 스테이션", "컴퓨터공학 게임제작팀",
              "간단한 리듬 게임과 랭킹 이벤트를 운영하는 체험형 부스입니다.",
              "EXPERIENCE", "13:00 - 22:00", 5, "D", "운동장 입구", "D-02", 40, 70));

  @Override
  public List<Booth> findAll() {
    return booths;
  }

  private static Booth booth(
      String id,
      String name,
      String teamName,
      String description,
      String category,
      String operatingHours,
      int availableTables,
      String zone,
      String area,
      String detail,
      int mapX,
      int mapY) {
    return new Booth(
        id, name, teamName, description, category, operatingHours, availableTables,
        new BoothLocation(zone, area, detail, mapX, mapY));
  }
}
