package com.festivalapp.service.ticket;

import com.festivalapp.domain.performance.Performance;
import com.festivalapp.domain.ticket.TicketReservation;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class TicketReservationSagaProcessor {

  private final TicketReservationTransactionService transactionService;
  private final TicketQrCodeIssuer ticketQrCodeIssuer;

  public TicketReservationSagaResult reserve(Performance performance, String userId) {
    TicketReservationSagaLogs logs = new TicketReservationSagaLogs();
    TicketReservation reservation = null;

    try {
      LocalDateTime checkedAt = LocalDateTime.now();
      LocalDateTime heldAt = LocalDateTime.now();
      LocalDateTime createdAt = LocalDateTime.now();
      reservation = transactionService.createReservation(performance, userId, heldAt, createdAt);
      logs.add("SEAT_CHECKED", "잔여 좌석을 확인했습니다.", checkedAt);
      logs.add("SEAT_HELD", "좌석을 선점했습니다.", heldAt);
      logs.add("RESERVATION_CREATED", "예매 정보를 생성했습니다.", createdAt);

      String qrCode = ticketQrCodeIssuer.issue(reservation);
      LocalDateTime issuedAt = LocalDateTime.now();
      reservation = transactionService.attachQr(reservation.id(), qrCode, issuedAt);
      logs.add("QR_ISSUED", "QR 티켓을 발급했습니다.", issuedAt);

      LocalDateTime completedAt = LocalDateTime.now();
      reservation = transactionService.complete(reservation.id(), completedAt);
      logs.add("COMPLETED", "예매를 완료했습니다.", completedAt);

      return new TicketReservationSagaResult(reservation, logs);
    } catch (ResponseStatusException exception) {
      throw exception;
    } catch (RuntimeException exception) {
      compensate(reservation);
      throw new ResponseStatusException(
          HttpStatus.INTERNAL_SERVER_ERROR,
          "티켓 예매 처리 중 오류가 발생했습니다.",
          exception);
    }
  }

  private void compensate(TicketReservation reservation) {
    if (reservation == null) {
      return;
    }

    transactionService.fail(reservation.id(), LocalDateTime.now());
  }
}
