package com.festivalapp.dto.auth;

import com.festivalapp.domain.auth.User;
import com.festivalapp.domain.auth.UserRole;

public record UserResponse(String id, String name, String email, UserRole role) {

  public static UserResponse from(User user) {
    return new UserResponse(user.id(), user.name(), user.email(), user.role());
  }
}
