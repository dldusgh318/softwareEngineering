package com.festivalapp.dto.auth;

import com.festivalapp.domain.auth.User;

public record UserResponse(String id, String name, String email) {

  public static UserResponse from(User user) {
    return new UserResponse(user.id(), user.name(), user.email());
  }
}
