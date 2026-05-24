package com.festivalapp.repository.auth;

import com.festivalapp.domain.auth.User;
import com.festivalapp.repository.auth.datasource.UserDataSource;
import java.util.Collection;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

public class FakeUserDataSource implements UserDataSource {

  private final Map<String, User> usersById = new ConcurrentHashMap<>();
  private final Map<String, String> userIdsByEmail = new ConcurrentHashMap<>();

  @Override
  public Collection<User> findAll() {
    return usersById.values();
  }

  @Override
  public Optional<User> findByEmail(String email) {
    return Optional.ofNullable(userIdsByEmail.get(email.trim().toLowerCase())).map(usersById::get);
  }

  @Override
  public Optional<User> findById(String id) {
    return Optional.ofNullable(usersById.get(id));
  }

  @Override
  public User save(User user) {
    usersById.put(user.id(), user);
    userIdsByEmail.put(user.email().trim().toLowerCase(), user.id());
    return user;
  }
}
