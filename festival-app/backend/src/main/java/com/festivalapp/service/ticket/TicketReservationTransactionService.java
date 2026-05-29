package com.festivalapp.service.ticket;

import com.festivalapp.domain.performance.Performance;
import com.festivalapp.domain.ticket.TicketReservation;
import com.festivalapp.domain.ticket.TicketReservationStatus;
import com.festivalapp.repository.ticket.TicketReservationRepository;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class TicketReservationTransactionService {

  private final TicketReservationRepository ticketReservationRepository;

  @Transactional
  public TicketReservation createReservation(
      Performance performance,
      String userId,
      LocalDateTime heldAt,
      LocalDateTime createdAt) {
    validateReservable(performance, userId);

    TicketReservation reservation =
        ticketReservationRepository.save(new TicketReservation(
            UUID.randomUUID().toString(),
            performance.id(),
            userId,
            TicketReservationStatus.SEAT_HELD,
            null,
            heldAt,
            heldAt));
    reservation.markReservationCreated(createdAt);
    return ticketReservationRepository.update(reservation);
  }

  @Transactional
  public TicketReservation attachQr(String reservationId, String qrCode, LocalDateTime issuedAt) {
    TicketReservation reservation = getReservation(reservationId);
    reservation.issueQr(qrCode, issuedAt);
    return ticketReservationRepository.update(reservation);
  }

  @Transactional
  public TicketReservation complete(String reservationId, LocalDateTime completedAt) {
    TicketReservation reservation = getReservation(reservationId);
    reservation.complete(completedAt);
    return ticketReservationRepository.update(reservation);
  }

  @Transactional
  public void fail(String reservationId, LocalDateTime failedAt) {
    TicketReservation reservation = getReservation(reservationId);
    reservation.fail(failedAt);
    ticketReservationRepository.update(reservation);
  }

  @Transactional
  public TicketReservation cancel(String reservationId, String userId, LocalDateTime cancelledAt) {
    TicketReservation reservation = getReservation(reservationId);

    if (!reservation.userId().equals(userId)) {
      throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인의 예매만 취소할 수 있습니다.");
    }

    if (!reservation.isCancellable()) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "취소할 수 없는 예매 상태입니다.");
    }

    reservation.cancel(cancelledAt);
    return ticketReservationRepository.update(reservation);
  }

  private void validateReservable(Performance performance, String userId) {
    int reservedSeats = ticketReservationRepository.countReservedSeatsByPerformanceId(performance.id());

    if (reservedSeats >= performance.totalSeats()) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "잔여 좌석이 없습니다.");
    }

    if (ticketReservationRepository.existsActiveByPerformanceIdAndUserId(performance.id(), userId)) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 예매한 공연입니다.");
    }
  }

  private TicketReservation getReservation(String reservationId) {
    return ticketReservationRepository.findById(reservationId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "예매 정보를 찾을 수 없습니다."));
  }
}
