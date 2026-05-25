package com.festivalapp.dto.auth;

public record AuthResponse(String accessToken, UserResponse user) {}
