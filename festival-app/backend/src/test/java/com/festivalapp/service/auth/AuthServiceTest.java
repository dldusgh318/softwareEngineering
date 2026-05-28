package com.festivalapp.service.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.festivalapp.domain.auth.UserRole;
import com.festivalapp.dto.auth.AuthResponse;
import com.festivalapp.dto.auth.LoginRequest;
import com.festivalapp.dto.auth.SignupRequest;
import com.festivalapp.repository.auth.FakeUserDataSource;
import com.festivalapp.repository.auth.UserRepository;
import com.festivalapp.security.JwtProperties;
import com.festivalapp.security.JwtTokenProvider;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

class AuthServiceTest {

  private final UserRepository userRepository = new UserRepository(new FakeUserDataSource());
  private final AuthService authService =
      new AuthService(
          userRepository,
          new BCryptPasswordEncoder(),
          new JwtTokenProvider(new JwtProperties("test-secret-key-must-be-at-least-32-bytes", 3600000)));

  @Test
  void signupCreatesUserAndReturnsToken() {
    AuthResponse response =
        authService.signup(new SignupRequest("홍길동", "WOW@hongik.ac.kr", "password123"));

    assertThat(response.accessToken()).isNotBlank();
    assertThat(response.user().name()).isEqualTo("홍길동");
    assertThat(response.user().email()).isEqualTo("wow@hongik.ac.kr");
    assertThat(response.user().role()).isEqualTo(UserRole.USER);
    assertThat(userRepository.findByEmail("wow@hongik.ac.kr")).isPresent();
  }

  @Test
  void signupCreatesUserEvenWhenRoleIsAdmin() {
    AuthResponse response =
        authService.signup(
            new SignupRequest("관리자", "admin@hongik.ac.kr", "password123", UserRole.ADMIN));

    assertThat(response.user().role()).isEqualTo(UserRole.USER);
    assertThat(userRepository.findByEmail("admin@hongik.ac.kr"))
        .get()
        .extracting("role")
        .isEqualTo(UserRole.USER);
  }

  @Test
  void signupAdminCreatesAdminUser() {
    AuthResponse response =
        authService.signupAdmin(new SignupRequest("관리자", "real-admin@hongik.ac.kr", "password123"));

    assertThat(response.user().role()).isEqualTo(UserRole.ADMIN);
    assertThat(userRepository.findByEmail("real-admin@hongik.ac.kr"))
        .get()
        .extracting("role")
        .isEqualTo(UserRole.ADMIN);
  }

  @Test
  void signupRejectsDuplicateEmail() {
    authService.signup(new SignupRequest("홍길동", "wow@hongik.ac.kr", "password123"));

    assertThatThrownBy(
            () -> authService.signup(new SignupRequest("김철수", "WOW@hongik.ac.kr", "password456")))
        .isInstanceOf(DuplicateEmailException.class)
        .hasMessage("이미 가입된 이메일입니다.");
  }

  @Test
  void loginReturnsTokenForMatchingCredentials() {
    authService.signup(new SignupRequest("홍길동", "wow@hongik.ac.kr", "password123"));

    AuthResponse response = authService.login(new LoginRequest("wow@hongik.ac.kr", "password123"));

    assertThat(response.accessToken()).isNotBlank();
    assertThat(response.user().email()).isEqualTo("wow@hongik.ac.kr");
  }

  @Test
  void loginRejectsWrongPassword() {
    authService.signup(new SignupRequest("홍길동", "wow@hongik.ac.kr", "password123"));

    assertThatThrownBy(() -> authService.login(new LoginRequest("wow@hongik.ac.kr", "wrongpass")))
        .isInstanceOf(InvalidCredentialsException.class)
        .hasMessage("이메일 또는 비밀번호가 올바르지 않습니다.");
  }
}
