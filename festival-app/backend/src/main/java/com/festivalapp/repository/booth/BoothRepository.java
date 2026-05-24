package com.festivalapp.repository.booth;

import com.festivalapp.domain.booth.Booth;
import com.festivalapp.repository.booth.datasource.BoothDataSource;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class BoothRepository {

  private final BoothDataSource boothDataSource;

  public List<Booth> findAll() {
    return boothDataSource.findAll();
  }

  public Optional<Booth> findById(String boothId) {
    return boothDataSource.findAll().stream()
        .filter(booth -> booth.id().equals(boothId))
        .findFirst();
  }
}
