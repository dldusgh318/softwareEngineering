package com.festivalapp.service;

import com.festivalapp.domain.booth.reservation.BoothReservation;
import com.festivalapp.domain.booth.reservation.BoothReservationStatus;
import com.festivalapp.dto.BoothReservationApprovalRequest;
import com.festivalapp.dto.BoothReservationResponse;
import com.festivalapp.dto.BoothReservationSagaLogResponse;
import com.festivalapp.repository.booth.reservation.BoothReservationRepository;
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

  @Transactional(readOnly = true)
  public List<BoothReservationResponse> getPendingReservations() {
    return boothReservationRepository.findByStatus(BoothReservationStatus.PENDING_APPROVAL).stream()
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
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "예약 정보를 찾을 수 없습니다."));

    if (reservation.status() != BoothReservationStatus.PENDING_APPROVAL) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "승인 대기 상태의 예약만 승인할 수 있습니다.");
    }

    LocalDateTime now = LocalDateTime.now();
    reservation.approve(now);

    String qrCode = qrCodeIssuer.issue(reservation);
    reservation.reserve(qrCode, now);

    BoothReservation savedReservation = boothReservationRepository.update(reservation);
    return BoothReservationResponse.from(savedReservation, List.of(
        new BoothReservationSagaLogResponse(
            "APPROVED",
            request.approverName() + "가 예약 신청을 승인했습니다.",
            now),
        new BoothReservationSagaLogResponse(
            "QR_ISSUED",
            "QR 발급에 성공해 예약 완료 상태로 전환했습니다.",
            now)));
  }

  private boolean isBlank(String value) {
    return value == null || value.isBlank();
  }
}
