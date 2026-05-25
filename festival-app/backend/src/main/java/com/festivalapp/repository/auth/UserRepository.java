package com.festivalapp.repository.auth;

import com.festivalapp.domain.auth.User;
import com.festivalapp.repository.auth.datasource.UserDataSource;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class UserRepository {

  private final UserDataSource userDataSource;

  public Optional<User> findByEmail(String email) {
    return userDataSource.findByEmail(email);
  }

  public Optional<User> findById(String id) {
    return userDataSource.findById(id);
  }

  public boolean existsByEmail(String email) {
    return userDataSource.findByEmail(email).isPresent();
  }

  public User save(User user) {
    return userDataSource.save(user);
  }
}
