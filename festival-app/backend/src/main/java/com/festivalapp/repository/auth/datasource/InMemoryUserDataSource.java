package com.festivalapp.repository.auth.datasource;

import com.festivalapp.domain.auth.User;
import java.util.Collection;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;

@Component
public class InMemoryUserDataSource implements UserDataSource {

  private final Map<String, User> usersById = new ConcurrentHashMap<>();
  private final Map<String, String> userIdsByEmail = new ConcurrentHashMap<>();

  @Override
  public Collection<User> findAll() {
    return usersById.values();
  }

  @Override
  public Optional<User> findByEmail(String email) {
    return Optional.ofNullable(userIdsByEmail.get(normalizeEmail(email)))
        .map(usersById::get);
  }

  @Override
  public Optional<User> findById(String id) {
    return Optional.ofNullable(usersById.get(id));
  }

  @Override
  public User save(User user) {
    usersById.put(user.id(), user);
    userIdsByEmail.put(normalizeEmail(user.email()), user.id());
    return user;
  }

  private String normalizeEmail(String email) {
    return email.trim().toLowerCase();
  }
}
