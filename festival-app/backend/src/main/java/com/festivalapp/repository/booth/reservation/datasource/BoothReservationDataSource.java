package com.festivalapp.repository.booth.reservation.datasource;

import com.festivalapp.domain.booth.reservation.BoothReservation;
import java.util.List;

public interface BoothReservationDataSource {

  List<BoothReservation> findAll();

  BoothReservation save(BoothReservation reservation);
}
