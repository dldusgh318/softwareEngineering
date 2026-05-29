package com.festivalapp.service;

import com.festivalapp.domain.performance.Performance;
import com.festivalapp.domain.ticket.TicketReservation;
import com.festivalapp.dto.TicketReservationCreateRequest;
import com.festivalapp.dto.TicketReservationResponse;
import com.festivalapp.repository.performance.PerformanceRepository;
import com.festivalapp.repository.ticket.TicketReservationRepository;
import com.festivalapp.service.ticket.TicketReservationSagaProcessor;
import com.festivalapp.service.ticket.TicketReservationTransactionService;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class TicketReservationService {

  private final PerformanceRepository performanceRepository;
  private final TicketReservationRepository ticketReservationRepository;
  private final TicketReservationSagaProcessor ticketReservationSagaProcessor;
  private final TicketReservationTransactionService ticketReservationTransactionService;

  public TicketReservationResponse reserveTicket(
      String userId,
      TicketReservationCreateRequest request) {
    if (request == null || request.performanceId() == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "예매할 공연 정보가 필요합니다.");
    }

    Performance performance = performanceRepository.findById(request.performanceId())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "공연을 찾을 수 없습니다."));

    return ticketReservationSagaProcessor.reserve(performance, userId).toResponse();
  }

  public List<TicketReservationResponse> getMyReservations(String userId) {
    return ticketReservationRepository.findByUserId(userId).stream()
        .map(reservation -> TicketReservationResponse.from(reservation, List.of()))
        .toList();
  }

  public TicketReservationResponse getMyReservation(String userId, String reservationId) {
    TicketReservation reservation = ticketReservationRepository.findById(reservationId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "예매 정보를 찾을 수 없습니다."));

    if (!reservation.userId().equals(userId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인의 예매 정보만 확인할 수 있습니다.");
    }

    return TicketReservationResponse.from(reservation, List.of());
  }

  public TicketReservationResponse cancelMyReservation(String userId, String reservationId) {
    TicketReservation reservation =
        ticketReservationTransactionService.cancel(reservationId, userId, LocalDateTime.now());
    return TicketReservationResponse.from(reservation, List.of());
  }
}
