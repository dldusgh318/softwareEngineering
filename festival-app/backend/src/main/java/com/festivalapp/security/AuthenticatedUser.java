package com.festivalapp.security;

import com.festivalapp.domain.auth.UserRole;

public record AuthenticatedUser(String id, String email, UserRole role) {}
