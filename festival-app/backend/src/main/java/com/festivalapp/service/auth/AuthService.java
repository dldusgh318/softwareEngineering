package com.festivalapp.service.auth;

import com.festivalapp.domain.auth.User;
import com.festivalapp.dto.auth.AuthResponse;
import com.festivalapp.dto.auth.LoginRequest;
import com.festivalapp.dto.auth.SignupRequest;
import com.festivalapp.dto.auth.UserResponse;
import com.festivalapp.repository.auth.UserRepository;
import com.festivalapp.security.JwtTokenProvider;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtTokenProvider jwtTokenProvider;

  public AuthResponse signup(SignupRequest request) {
    String email = normalizeEmail(request.email());

    if (userRepository.existsByEmail(email)) {
      throw new DuplicateEmailException("이미 가입된 이메일입니다.");
    }

    User user =
        new User(
            UUID.randomUUID().toString(),
            request.name().trim(),
            email,
            passwordEncoder.encode(request.password()),
            LocalDateTime.now());

    User savedUser = userRepository.save(user);
    return toAuthResponse(savedUser);
  }

  public AuthResponse login(LoginRequest request) {
    User user =
        userRepository
            .findByEmail(normalizeEmail(request.email()))
            .orElseThrow(() -> new InvalidCredentialsException("이메일 또는 비밀번호가 올바르지 않습니다."));

    if (!passwordEncoder.matches(request.password(), user.passwordHash())) {
      throw new InvalidCredentialsException("이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    return toAuthResponse(user);
  }

  private AuthResponse toAuthResponse(User user) {
    return new AuthResponse(jwtTokenProvider.createToken(user), UserResponse.from(user));
  }

  private String normalizeEmail(String email) {
    return email.trim().toLowerCase();
  }
}
