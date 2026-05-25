package com.festivalapp.domain.auth;

import java.time.LocalDateTime;

public record User(
    String id,
    String name,
    String email,
    String passwordHash,
    LocalDateTime createdAt) {

  public static User create(String id, String name, String email, String passwordHash) {
    return new User(id, name.trim(), email, passwordHash, LocalDateTime.now());
  }
}
