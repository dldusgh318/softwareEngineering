package com.festivalapp.service;

import com.festivalapp.domain.booth.reservation.BoothReservation;
import com.festivalapp.dto.BoothReservationApprovalRequest;
import com.festivalapp.dto.BoothReservationResponse;
import com.festivalapp.dto.BoothReservationSagaLogResponse;
import com.festivalapp.repository.booth.reservation.BoothReservationRepository;
import com.festivalapp.service.qr.QrCodeIssueCommand;
import com.festivalapp.service.qr.QrCodeIssueException;
import com.festivalapp.service.qr.QrCodeIssuer;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class BoothReservationApprovalService {

  private final BoothReservationRepository boothReservationRepository;
  private final QrCodeIssuer qrCodeIssuer;
  private final BoothReservationApprovalResultFactory resultFactory;

  @Transactional(readOnly = true)
  public List<BoothReservationResponse> getPendingReservations() {
    return boothReservationRepository.findAll().stream()
        .filter(BoothReservation::canApprove)
        .map(BoothReservationResponse::from)
        .toList();
  }

  @Transactional
  public BoothReservationResponse approveReservation(
      String reservationId,
      BoothReservationApprovalRequest request) {
    if (request == null || isBlank(request.approverId()) || isBlank(request.approverName())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "승인자 정보가 필요합니다.");
    }

    BoothReservation reservation = boothReservationRepository.findById(reservationId)
        .orElseThrow(
            () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "예약 정보를 찾을 수 없습니다."));

    if (!reservation.canApprove()) {
      throw new ResponseStatusException(
          HttpStatus.CONFLICT,
          "승인 대기 또는 QR 발급 실패 상태의 예약만 승인할 수 있습니다.");
    }

    LocalDateTime now = LocalDateTime.now();
    reservation.approve(now);
    BoothReservationSagaLogResponse approvalLog =
        resultFactory.approvalLog(request.approverName(), now);

    try {
      return reserveAfterQrIssued(reservation, request, now, approvalLog);
    } catch (QrCodeIssueException exception) {
      return compensateQrIssueFailure(reservation, approvalLog, exception);
    }
  }

  private BoothReservationResponse reserveAfterQrIssued(
      BoothReservation reservation,
      BoothReservationApprovalRequest request,
      LocalDateTime approvedAt,
      BoothReservationSagaLogResponse approvalLog) {
    String qrCode = qrCodeIssuer.issue(new QrCodeIssueCommand(
        reservation,
        request.shouldSimulateQrFailure()));
    reservation.reserve(qrCode, approvedAt);

    BoothReservation savedReservation = boothReservationRepository.update(reservation);
    return resultFactory.qrIssued(savedReservation, approvalLog, approvedAt);
  }

  private BoothReservationResponse compensateQrIssueFailure(
      BoothReservation reservation,
      BoothReservationSagaLogResponse approvalLog,
      QrCodeIssueException exception) {
    LocalDateTime failedAt = LocalDateTime.now();
    reservation.compensateApprovalAfterQrFailure(failedAt);
    BoothReservation savedReservation = boothReservationRepository.update(reservation);

    return resultFactory.qrIssueFailed(
        savedReservation,
        approvalLog,
        exception.getMessage(),
        failedAt);
  }

  private boolean isBlank(String value) {
    return value == null || value.isBlank();
  }
}
