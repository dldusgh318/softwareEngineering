package com.festivalapp.domain.booth.reservation;

import java.time.LocalDateTime;

public class BoothReservation {

  private final String id;
  private final String boothId;
  private final String applicantId;
  private final String applicantName;
  private final int requestedTables;
  private BoothReservationStatus status;
  private String qrCode;
  private final LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  public BoothReservation(
      String id,
      String boothId,
      String applicantId,
      String applicantName,
      int requestedTables,
      BoothReservationStatus status,
      String qrCode,
      LocalDateTime createdAt,
      LocalDateTime updatedAt) {
    this.id = id;
    this.boothId = boothId;
    this.applicantId = applicantId;
    this.applicantName = applicantName;
    this.requestedTables = requestedTables;
    this.status = status;
    this.qrCode = qrCode;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public void approve(LocalDateTime now) {
    status = BoothReservationStatus.APPROVED;
    updatedAt = now;
  }

  public boolean canApprove() {
    return status == BoothReservationStatus.PENDING_APPROVAL
        || status == BoothReservationStatus.QR_FAILED;
  }

  public void reserve(String issuedQrCode, LocalDateTime now) {
    status = BoothReservationStatus.RESERVED;
    qrCode = issuedQrCode;
    updatedAt = now;
  }

  public void checkIn(LocalDateTime now) {
    status = BoothReservationStatus.CHECKED_IN;
    updatedAt = now;
  }

  public void compensateApprovalAfterQrFailure(LocalDateTime now) {
    status = BoothReservationStatus.QR_FAILED;
    qrCode = null;
    updatedAt = now;
  }

  public String id() {
    return id;
  }

  public String boothId() {
    return boothId;
  }

  public String applicantId() {
    return applicantId;
  }

  public String applicantName() {
    return applicantName;
  }

  public int requestedTables() {
    return requestedTables;
  }

  public BoothReservationStatus status() {
    return status;
  }

  public String qrCode() {
    return qrCode;
  }

  public LocalDateTime createdAt() {
    return createdAt;
  }

  public LocalDateTime updatedAt() {
    return updatedAt;
  }
}
