package com.festivalapp.service;

import com.festivalapp.domain.performance.Performance;
import com.festivalapp.domain.ticket.TicketReservation;
import com.festivalapp.domain.ticket.TicketReservationStatus;
import com.festivalapp.dto.TicketReservationCreateRequest;
import com.festivalapp.dto.TicketReservationResponse;
import com.festivalapp.dto.TicketReservationSagaLogResponse;
import com.festivalapp.repository.performance.PerformanceRepository;
import com.festivalapp.repository.ticket.TicketReservationRepository;
import com.festivalapp.service.ticket.TicketQrCodeIssuer;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class TicketReservationService {

  private final PerformanceRepository performanceRepository;
  private final TicketReservationRepository ticketReservationRepository;
  private final TicketQrCodeIssuer ticketQrCodeIssuer;

  @Transactional
  public TicketReservationResponse reserveTicket(
      String userId,
      TicketReservationCreateRequest request) {
    if (request == null || request.performanceId() == null) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "예매할 공연 정보가 필요합니다.");
    }

    Performance performance = performanceRepository.findById(request.performanceId())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "공연을 찾을 수 없습니다."));
    List<TicketReservationSagaLogResponse> sagaLogs = new ArrayList<>();

    LocalDateTime checkedAt = LocalDateTime.now();
    validateRemainingSeat(performance);
    sagaLogs.add(log("SEAT_CHECKED", "잔여 좌석을 확인했습니다.", checkedAt));

    if (ticketReservationRepository.existsActiveByPerformanceIdAndUserId(performance.id(), userId)) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 예매한 공연입니다.");
    }

    LocalDateTime heldAt = LocalDateTime.now();
    TicketReservation reservation =
        ticketReservationRepository.save(new TicketReservation(
            UUID.randomUUID().toString(),
            performance.id(),
            userId,
            TicketReservationStatus.SEAT_HELD,
            null,
            heldAt,
            heldAt));
    sagaLogs.add(log("SEAT_HELD", "좌석을 선점했습니다.", heldAt));

    LocalDateTime createdAt = LocalDateTime.now();
    reservation.markReservationCreated(createdAt);
    ticketReservationRepository.update(reservation);
    sagaLogs.add(log("RESERVATION_CREATED", "예매 정보를 생성했습니다.", createdAt));

    LocalDateTime issuedAt = LocalDateTime.now();
    reservation.issueQr(ticketQrCodeIssuer.issue(reservation), issuedAt);
    ticketReservationRepository.update(reservation);
    sagaLogs.add(log("QR_ISSUED", "QR 티켓을 발급했습니다.", issuedAt));

    LocalDateTime completedAt = LocalDateTime.now();
    reservation.complete(completedAt);
    TicketReservation savedReservation = ticketReservationRepository.update(reservation);
    sagaLogs.add(log("COMPLETED", "예매를 완료했습니다.", completedAt));

    return TicketReservationResponse.from(savedReservation, sagaLogs);
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

  private void validateRemainingSeat(Performance performance) {
    int reservedSeats = ticketReservationRepository.countReservedSeatsByPerformanceId(performance.id());

    if (reservedSeats >= performance.totalSeats()) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "잔여 좌석이 없습니다.");
    }
  }

  private TicketReservationSagaLogResponse log(
      String step,
      String message,
      LocalDateTime createdAt) {
    return new TicketReservationSagaLogResponse(step, message, createdAt);
  }
}
