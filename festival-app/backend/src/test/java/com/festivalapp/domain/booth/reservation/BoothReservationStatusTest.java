package com.festivalapp.domain.booth.reservation;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class BoothReservationStatusTest {

  @Test
  void pendingApprovalHasDescription() {
    assertThat(BoothReservationStatus.PENDING_APPROVAL.getDescription())
        .isEqualTo("관리자 승인 대기");
  }
}
