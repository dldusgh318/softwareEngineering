package com.festivalapp.repository.booth.reservation.datasource;

import com.festivalapp.domain.booth.reservation.BoothReservation;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BoothReservationDataSource {

  List<BoothReservation> findAll();

  Optional<BoothReservation> findById(String reservationId);

  BoothReservation save(BoothReservation reservation);

  BoothReservation saveIfAvailable(BoothReservation reservation, int availableTables);

  BoothReservation checkInByQrCode(String qrCode, LocalDateTime checkedInAt);

  BoothReservation update(BoothReservation reservation);
}
