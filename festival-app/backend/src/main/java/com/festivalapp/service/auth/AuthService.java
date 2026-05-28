package com.festivalapp.service.auth;

import com.festivalapp.domain.auth.User;
import com.festivalapp.domain.auth.UserRole;
import com.festivalapp.dto.auth.AuthResponse;
import com.festivalapp.dto.auth.LoginRequest;
import com.festivalapp.dto.auth.SignupRequest;
import com.festivalapp.dto.auth.UserResponse;
import com.festivalapp.repository.auth.UserRepository;
import com.festivalapp.security.JwtTokenProvider;
import java.util.Optional;
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
    return signupWithRole(request, UserRole.USER);
  }

  public AuthResponse signupAdmin(SignupRequest request) {
    return signupWithRole(request, UserRole.ADMIN);
  }

  private AuthResponse signupWithRole(SignupRequest request, UserRole role) {
    String email = normalizeEmail(request.email());

    if (userRepository.existsByEmail(email)) {
      throw new DuplicateEmailException("이미 가입된 이메일입니다.");
    }

    User user =
        User.create(
            UUID.randomUUID().toString(),
            request.name(),
            email,
            passwordEncoder.encode(request.password()),
            role);
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

  public Optional<UserResponse> getCurrentUser(String userId) {
    return userRepository.findById(userId).map(UserResponse::from);
  }

  private AuthResponse toAuthResponse(User user) {
    return new AuthResponse(jwtTokenProvider.createToken(user), UserResponse.from(user));
  }

  private String normalizeEmail(String email) {
    return email.trim().toLowerCase();
  }
}
