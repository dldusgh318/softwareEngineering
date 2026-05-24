package com.festivalapp.service;

import com.festivalapp.dto.BoothResponse;
import com.festivalapp.repository.booth.BoothRepository;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BoothService {

  private final BoothRepository boothRepository;

  public List<BoothResponse> getBooths() {
    return boothRepository.findAll().stream()
        .map(BoothResponse::from)
        .toList();
  }

  public Optional<BoothResponse> getBooth(String boothId) {
    return boothRepository.findById(boothId)
        .map(BoothResponse::from);
  }
}
