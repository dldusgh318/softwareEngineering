package com.festivalapp.api;

import static org.hamcrest.Matchers.blankOrNullString;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest(properties = "app.jwt.secret=test-secret-key-must-be-at-least-32-bytes")
@AutoConfigureMockMvc
class AdminBoothReservationSecurityTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Test
  void adminReservationApiRequiresAdminRole() throws Exception {
    mockMvc.perform(get("/api/admin/booth-reservations/pending"))
        .andExpect(status().isUnauthorized());

    mockMvc.perform(
            get("/api/admin/booth-reservations/pending")
                .header(
                    "Authorization",
                    "Bearer " + signupAndGetToken("user-admin-api@hongik.ac.kr", "USER")))
        .andExpect(status().isForbidden());

    mockMvc.perform(
            get("/api/admin/booth-reservations/pending")
                .header(
                    "Authorization",
                    "Bearer " + signupAndGetToken("admin-api@hongik.ac.kr", "ADMIN")))
        .andExpect(status().isOk());
  }

  private String signupAndGetToken(String email, String role) throws Exception {
    MvcResult result =
        mockMvc
            .perform(
                post("/api/auth/signup")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        objectMapper.writeValueAsString(
                            Map.of(
                                "name", "테스트",
                                "email", email,
                                "password", "password123",
                                "role", role))))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.accessToken", not(blankOrNullString())))
            .andReturn();

    return objectMapper
        .readTree(result.getResponse().getContentAsString())
        .get("accessToken")
        .asText();
  }
}
