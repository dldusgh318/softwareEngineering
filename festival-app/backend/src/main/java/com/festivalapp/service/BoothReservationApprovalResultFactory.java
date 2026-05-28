package com.festivalapp.service;

import com.festivalapp.domain.booth.reservation.BoothReservation;
import com.festivalapp.domain.booth.reservation.BoothReservationStatus;
import com.festivalapp.dto.BoothReservationCompensationLogResponse;
import com.festivalapp.dto.BoothReservationResponse;
import com.festivalapp.dto.BoothReservationSagaLogResponse;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class BoothReservationApprovalResultFactory {

  public BoothReservationSagaLogResponse approvalLog(String approverName, LocalDateTime approvedAt) {
    return new BoothReservationSagaLogResponse(
        "APPROVED",
        approverName + "가 예약 신청을 승인했습니다.",
        approvedAt);
  }

  public BoothReservationResponse qrIssued(
      BoothReservation reservation,
      BoothReservationSagaLogResponse approvalLog,
      LocalDateTime issuedAt) {
    return BoothReservationResponse.from(
        reservation,
        List.of(
            approvalLog,
            new BoothReservationSagaLogResponse(
                "QR_ISSUED",
                "QR 발급에 성공해 예약 완료 상태로 전환했습니다.",
                issuedAt)));
  }

  public BoothReservationResponse qrIssueFailed(
      BoothReservation reservation,
      BoothReservationSagaLogResponse approvalLog,
      String failureReason,
      LocalDateTime failedAt) {
    return BoothReservationResponse.from(
        reservation,
        List.of(
            approvalLog,
            new BoothReservationSagaLogResponse(
                "QR_ISSUE_FAILED",
                failureReason,
                failedAt),
            new BoothReservationSagaLogResponse(
                "APPROVAL_COMPENSATED",
                "QR 발급 실패로 승인 상태를 보상 처리했습니다.",
                failedAt)),
        compensationLogs(failureReason, failedAt));
  }

  private List<BoothReservationCompensationLogResponse> compensationLogs(
      String failureReason,
      LocalDateTime failedAt) {
    return List.of(
        new BoothReservationCompensationLogResponse(
            "APPROVAL_ROLLBACK",
            failureReason,
            BoothReservationStatus.APPROVED.name(),
            BoothReservationStatus.QR_FAILED.name(),
            failedAt),
        new BoothReservationCompensationLogResponse(
            "RETRY_REQUIRED",
            "관리자 재승인이 필요합니다.",
            BoothReservationStatus.QR_FAILED.name(),
            BoothReservationStatus.QR_FAILED.name(),
            failedAt));
  }
}
