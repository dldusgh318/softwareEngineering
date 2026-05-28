package com.festivalapp.api;

import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.festivalapp.domain.map.MapLocationCategory;
import com.festivalapp.dto.MapLocationResponse;
import com.festivalapp.service.MapLocationService;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

class MapLocationControllerTest {

  private final MapLocationService mapLocationService = mock(MapLocationService.class);
  private MockMvc mockMvc;

  @BeforeEach
  void setUp() {
    mockMvc = MockMvcBuilders.standaloneSetup(new MapLocationController(mapLocationService)).build();
  }

  @Test
  void getMapLocationsReturnsMapLocations() throws Exception {
    given(mapLocationService.getMapLocations(null)).willReturn(List.of(mainStageResponse()));

    mockMvc.perform(get("/api/map-locations"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].name").value("메인무대"))
        .andExpect(jsonPath("$[0].category").value("STAGE"));
  }

  @Test
  void getMapLocationsFiltersByCategory() throws Exception {
    given(mapLocationService.getMapLocations(MapLocationCategory.BOOTH))
        .willReturn(List.of(boothResponse()));

    mockMvc.perform(get("/api/map-locations").param("category", "BOOTH"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].name").value("낮 부스존"))
        .andExpect(jsonPath("$[0].category").value("BOOTH"));
  }

  private MapLocationResponse mainStageResponse() {
    return new MapLocationResponse(1L, "메인무대", "STAGE", 50, 30, 18, 12, "중앙 공연장입니다.");
  }

  private MapLocationResponse boothResponse() {
    return new MapLocationResponse(2L, "낮 부스존", "BOOTH", 31, 49, 22, 16, "체험 부스 구역입니다.");
  }
}
