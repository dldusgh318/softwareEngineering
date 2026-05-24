package com.festivalapp.repository.auth.datasource;

import com.festivalapp.domain.auth.User;
import java.util.Collection;
import java.util.Optional;

public interface UserDataSource {

  Collection<User> findAll();

  Optional<User> findByEmail(String email);

  Optional<User> findById(String id);

  User save(User user);
}
