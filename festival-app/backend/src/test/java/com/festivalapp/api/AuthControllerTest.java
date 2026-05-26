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
class AuthControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Test
  void signupReturnsAccessTokenAndUser() throws Exception {
    mockMvc
        .perform(
            post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    objectMapper.writeValueAsString(
                        Map.of(
                            "name", "홍길동",
                            "email", "signup-success@hongik.ac.kr",
                            "password", "password123"))))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.accessToken", not(blankOrNullString())))
        .andExpect(jsonPath("$.user.email").value("signup-success@hongik.ac.kr"))
        .andExpect(jsonPath("$.user.role").value("USER"));
  }

  @Test
  void adminSignupReturnsAdminRole() throws Exception {
    mockMvc
        .perform(
            post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    objectMapper.writeValueAsString(
                        Map.of(
                            "name", "관리자",
                            "email", "admin-signup@hongik.ac.kr",
                            "password", "password123",
                            "role", "ADMIN"))))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.user.role").value("ADMIN"));
  }

  @Test
  void duplicateSignupReturnsConflict() throws Exception {
    String body =
        objectMapper.writeValueAsString(
            Map.of("name", "홍길동", "email", "wow@hongik.ac.kr", "password", "password123"));

    mockMvc.perform(post("/api/auth/signup").contentType(MediaType.APPLICATION_JSON).content(body));

    mockMvc
        .perform(post("/api/auth/signup").contentType(MediaType.APPLICATION_JSON).content(body))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.message").value("이미 가입된 이메일입니다."));
  }

  @Test
  void loginRejectsInvalidPassword() throws Exception {
    mockMvc.perform(
        post("/api/auth/signup")
            .contentType(MediaType.APPLICATION_JSON)
            .content(
                objectMapper.writeValueAsString(
                    Map.of(
                        "name", "홍길동",
                        "email", "login-failure@hongik.ac.kr",
                        "password", "password123"))));

    mockMvc
        .perform(
            post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    objectMapper.writeValueAsString(
                        Map.of("email", "login-failure@hongik.ac.kr", "password", "wrongpass"))))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.message").value("이메일 또는 비밀번호가 올바르지 않습니다."));
  }

  @Test
  void meRequiresAuthentication() throws Exception {
    mockMvc.perform(get("/api/auth/me")).andExpect(status().isUnauthorized());
  }

  @Test
  void meReturnsAuthenticatedUser() throws Exception {
    MvcResult signupResult =
        mockMvc
            .perform(
                post("/api/auth/signup")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        objectMapper.writeValueAsString(
                            Map.of(
                                "name", "홍길동",
                                "email", "me-success@hongik.ac.kr",
                                "password", "password123"))))
            .andReturn();
    String token =
        objectMapper
            .readTree(signupResult.getResponse().getContentAsString())
            .get("accessToken")
            .asText();

    mockMvc
        .perform(get("/api/auth/me").header("Authorization", "Bearer " + token))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.email").value("me-success@hongik.ac.kr"));
  }
}
