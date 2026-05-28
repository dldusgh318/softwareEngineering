package com.festivalapp.service.qr;

public interface QrCodeIssuer {

  String issue(QrCodeIssueCommand command);
}
