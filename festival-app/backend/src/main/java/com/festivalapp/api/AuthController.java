package com.festivalapp.api;

import com.festivalapp.dto.auth.AuthResponse;
import com.festivalapp.dto.auth.LoginRequest;
import com.festivalapp.dto.auth.SignupRequest;
import com.festivalapp.dto.auth.UserResponse;
import com.festivalapp.security.AuthenticatedUser;
import com.festivalapp.service.auth.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

  private final AuthService authService;

  @PostMapping("/signup")
  ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
    return ResponseEntity.ok(authService.signup(request));
  }

  @PostMapping("/login")
  ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
    return ResponseEntity.ok(authService.login(request));
  }

  @GetMapping("/me")
  ResponseEntity<UserResponse> me(@AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
    return authService
        .getCurrentUser(authenticatedUser.id())
        .map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.notFound().build());
  }
}
