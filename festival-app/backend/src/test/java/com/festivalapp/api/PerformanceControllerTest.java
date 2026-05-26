package com.festivalapp.api;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.festivalapp.dto.PerformanceResponse;
import com.festivalapp.service.PerformanceService;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

class PerformanceControllerTest {

  private final PerformanceService performanceService = mock(PerformanceService.class);
  private MockMvc mockMvc;

  @BeforeEach
  void setUp() {
    mockMvc = MockMvcBuilders.standaloneSetup(new PerformanceController(performanceService)).build();
  }

  @Test
  void getPerformancesReturnsPerformanceSummaries() throws Exception {
    given(performanceService.getPerformances()).willReturn(List.of(performanceResponse()));

    mockMvc.perform(get("/api/performances"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].title").value("와우 스테이지 헤드라이너"))
        .andExpect(jsonPath("$[0].remainingSeats").value(128));
  }

  @Test
  void getPerformanceReturnsPerformanceDetail() throws Exception {
    given(performanceService.getPerformance(1L)).willReturn(performanceResponse());

    mockMvc.perform(get("/api/performances/1"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.title").value("와우 스테이지 헤드라이너"))
        .andExpect(jsonPath("$.description").value("축제 첫날 밤을 여는 메인 스테이지 공연입니다."))
        .andExpect(jsonPath("$.remainingSeats").value(128));
  }

  private PerformanceResponse performanceResponse() {
    return new PerformanceResponse(
        1L,
        "와우 스테이지 헤드라이너",
        "헤드라이너 아티스트",
        LocalDateTime.of(2026, 5, 13, 19, 0),
        LocalDateTime.of(2026, 5, 13, 21, 0),
        "대운동장 메인 스테이지",
        "축제 첫날 밤을 여는 메인 스테이지 공연입니다.",
        500,
        372,
        128);
  }
}
