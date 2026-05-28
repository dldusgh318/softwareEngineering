package com.festivalapp.service;

import static org.assertj.core.api.Assertions.assertThat;

import com.festivalapp.domain.booth.reservation.BoothReservation;
import com.festivalapp.domain.booth.reservation.BoothReservationStatus;
import com.festivalapp.dto.BoothReservationCompensationLogResponse;
import com.festivalapp.dto.BoothReservationResponse;
import com.festivalapp.dto.BoothReservationSagaLogResponse;
import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;

class BoothReservationApprovalResultFactoryTest {

  private final BoothReservationApprovalResultFactory factory =
      new BoothReservationApprovalResultFactory();

  @Test
  void qrIssuedBuildsSuccessSagaResponse() {
    LocalDateTime now = LocalDateTime.of(2026, 5, 24, 10, 0);
    BoothReservation reservation = reservation(BoothReservationStatus.RESERVED);
    BoothReservationSagaLogResponse approvalLog = factory.approvalLog("관리자", now);

    BoothReservationResponse response = factory.qrIssued(reservation, approvalLog, now);

    assertThat(response.sagaLogs())
        .extracting(BoothReservationSagaLogResponse::step)
        .containsExactly("APPROVED", "QR_ISSUED");
    assertThat(response.compensationLogs()).isEmpty();
  }

  @Test
  void qrIssueFailedBuildsCompensationResponse() {
    LocalDateTime now = LocalDateTime.of(2026, 5, 24, 10, 0);
    BoothReservation reservation = reservation(BoothReservationStatus.QR_FAILED);
    BoothReservationSagaLogResponse approvalLog = factory.approvalLog("관리자", now);

    BoothReservationResponse response =
        factory.qrIssueFailed(reservation, approvalLog, "QR 발급 시뮬레이션 실패", now);

    assertThat(response.sagaLogs())
        .extracting(BoothReservationSagaLogResponse::step)
        .containsExactly("APPROVED", "QR_ISSUE_FAILED", "APPROVAL_COMPENSATED");
    assertThat(response.compensationLogs())
        .extracting(BoothReservationCompensationLogResponse::step)
        .containsExactly("APPROVAL_ROLLBACK", "RETRY_REQUIRED");
  }

  private BoothReservation reservation(BoothReservationStatus status) {
    LocalDateTime now = LocalDateTime.of(2026, 5, 24, 10, 0);
    return new BoothReservation(
        "reservation-1",
        "booth-1",
        "user-1",
        "홍길동",
        2,
        status,
        null,
        now,
        now);
  }
}
