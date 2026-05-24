package com.festivalapp.api;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.festivalapp.dto.BoothLocationResponse;
import com.festivalapp.dto.BoothResponse;
import com.festivalapp.service.BoothService;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

class BoothControllerTest {

  private final BoothService boothService = mock(BoothService.class);
  private MockMvc mockMvc;

  @BeforeEach
  void setUp() {
    mockMvc = MockMvcBuilders.standaloneSetup(new BoothController(boothService)).build();
  }

  @Test
  void getBoothsReturnsBoothListWithLocation() throws Exception {
    given(boothService.getBooths()).willReturn(List.of(boothResponse()));

    mockMvc.perform(get("/api/booths"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].id").value("booth-1"))
        .andExpect(jsonPath("$[0].name").value("타코야끼 라운지"))
        .andExpect(jsonPath("$[0].location.zone").value("A"))
        .andExpect(jsonPath("$[0].location.detail").value("A-03"));
  }

  @Test
  void getBoothReturnsMatchingBooth() throws Exception {
    given(boothService.getBooth("booth-1")).willReturn(Optional.of(boothResponse()));

    mockMvc.perform(get("/api/booths/booth-1"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value("booth-1"))
        .andExpect(jsonPath("$.location.area").value("학생회관 앞"));
  }

  @Test
  void getBoothReturnsNotFoundWhenBoothDoesNotExist() throws Exception {
    given(boothService.getBooth("missing-booth")).willReturn(Optional.empty());

    mockMvc.perform(get("/api/booths/missing-booth"))
        .andExpect(status().isNotFound());
  }

  private BoothResponse boothResponse() {
    return new BoothResponse(
        "booth-1",
        "타코야끼 라운지",
        "일식조리 동아리 오코노미",
        "즉석 타코야끼 부스",
        "FOOD",
        "12:00 - 21:00",
        4,
        new BoothLocationResponse("A", "학생회관 앞", "A-03", 26, 34));
  }
}
