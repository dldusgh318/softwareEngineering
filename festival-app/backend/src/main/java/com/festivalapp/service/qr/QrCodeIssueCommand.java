package com.festivalapp.service.qr;

import com.festivalapp.domain.booth.reservation.BoothReservation;

public record QrCodeIssueCommand(
    BoothReservation reservation,
    boolean simulateFailure) {}
