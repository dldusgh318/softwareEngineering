package com.festivalapp.dto;

public record BoothReservationApprovalRequest(
    String approverId,
    String approverName,
    Boolean simulateQrFailure) {

  public BoothReservationApprovalRequest(String approverId, String approverName) {
    this(approverId, approverName, false);
  }

  public boolean shouldSimulateQrFailure() {
    return Boolean.TRUE.equals(simulateQrFailure);
  }
}
