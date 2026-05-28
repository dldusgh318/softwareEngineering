export type TicketReservationStatus =
  | "SEAT_HELD"
  | "RESERVATION_CREATED"
  | "QR_ISSUED"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export type TicketReservationSagaLog = {
  step: string;
  message: string;
  createdAt: string;
};

export type TicketReservation = {
  id: string;
  performanceId: number;
  userId: string;
  status: TicketReservationStatus;
  statusDescription: string;
  qrCode: string | null;
  sagaLogs: TicketReservationSagaLog[];
  createdAt: string;
  updatedAt: string;
};

export type TicketReservationCreateRequest = {
  performanceId: number;
};
