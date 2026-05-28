package com.festivalapp.service;

import com.festivalapp.domain.performance.Performance;
import com.festivalapp.dto.PerformanceResponse;
import com.festivalapp.repository.performance.PerformanceRepository;
import com.festivalapp.repository.ticket.TicketReservationRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class PerformanceService {

  private final PerformanceRepository performanceRepository;
  private final TicketReservationRepository ticketReservationRepository;

  public List<PerformanceResponse> getPerformances() {
    return performanceRepository.findAll().stream()
        .map(this::toResponse)
        .toList();
  }

  public PerformanceResponse getPerformance(Long performanceId) {
    return performanceRepository.findById(performanceId)
        .map(this::toResponse)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "공연을 찾을 수 없습니다."));
  }

  private PerformanceResponse toResponse(Performance performance) {
    int reservedSeats =
        ticketReservationRepository.countReservedSeatsByPerformanceId(performance.id());
    return PerformanceResponse.from(performance, reservedSeats);
  }
}
