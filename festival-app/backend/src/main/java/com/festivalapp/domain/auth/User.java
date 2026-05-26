package com.festivalapp.domain.auth;

import java.time.LocalDateTime;

public record User(
    String id,
    String name,
    String email,
    String passwordHash,
    UserRole role,
    LocalDateTime createdAt) {

  public static User create(String id, String name, String email, String passwordHash) {
    return create(id, name, email, passwordHash, UserRole.USER);
  }

  public static User create(
      String id,
      String name,
      String email,
      String passwordHash,
      UserRole role) {
    return new User(
        id,
        name.trim(),
        email,
        passwordHash,
        role == null ? UserRole.USER : role,
        LocalDateTime.now());
  }
}
