package com.festivalapp.service;

import com.festivalapp.dto.BoothReservationCheckInRequest;
import com.festivalapp.dto.BoothReservationResponse;
import com.festivalapp.repository.booth.reservation.BoothReservationAlreadyCheckedInException;
import com.festivalapp.repository.booth.reservation.BoothReservationCancelledException;
import com.festivalapp.repository.booth.reservation.BoothReservationInvalidQrException;
import com.festivalapp.repository.booth.reservation.BoothReservationQrExpiredException;
import com.festivalapp.repository.booth.reservation.BoothReservationRepository;
import com.festivalapp.repository.booth.reservation.BoothReservationStatusNotCheckInReadyException;
import java.time.LocalDateTime;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class BoothReservationCheckInService {

  private final BoothReservationRepository boothReservationRepository;

  @Transactional
  public BoothReservationResponse checkIn(BoothReservationCheckInRequest request) {
    if (request == null || isBlank(request.qrCode())) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "체크인할 QR 정보가 필요합니다.");
    }

    try {
      return BoothReservationResponse.from(
          boothReservationRepository.checkInByQrCode(request.qrCode(), LocalDateTime.now()));
    } catch (BoothReservationInvalidQrException exception) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, exception.getMessage());
    } catch (BoothReservationAlreadyCheckedInException
        | BoothReservationCancelledException
        | BoothReservationQrExpiredException
        | BoothReservationStatusNotCheckInReadyException exception) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, exception.getMessage());
    }
  }

  private boolean isBlank(String value) {
    return value == null || value.isBlank();
  }
}
