package com.festivalapp.api;

import com.festivalapp.dto.auth.AuthResponse;
import com.festivalapp.dto.auth.SignupRequest;
import com.festivalapp.service.auth.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/auth")
@RequiredArgsConstructor
public class AdminAuthController {

  private final AuthService authService;

  @PostMapping("/signup")
  ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
    return ResponseEntity.ok(authService.signupAdmin(request));
  }
}
