package com.festivalapp.domain.auth;

import java.time.LocalDateTime;

public record User(
    String id,
    String name,
    String email,
    String passwordHash,
    LocalDateTime createdAt) {}
