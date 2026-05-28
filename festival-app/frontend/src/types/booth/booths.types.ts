export type BoothLocation = {
  zone: string;
  area: string;
  detail: string;
  mapX: number;
  mapY: number;
};

export type Booth = {
  id: string;
  name: string;
  teamName: string;
  description: string;
  category: "FOOD" | "GOODS" | "EXPERIENCE" | "EVENT";
  operatingHours: string;
  availableTables: number;
  location: BoothLocation;
};

export type BoothReservationStatus =
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "RESERVED"
  | "QR_FAILED"
  | "CHECKED_IN"
  | "COMPLETED"
  | "CANCELLED";

export type BoothReservationApplicationRequest = {
  boothId: string;
  applicantId: string;
  applicantName: string;
  requestedTables: number;
};

export type BoothReservationApplication = {
  id: string;
  boothId: string;
  applicantId: string;
  applicantName: string;
  requestedTables: number;
  status: BoothReservationStatus;
  statusDescription: string;
  qrCode: string | null;
  sagaLogs: BoothReservationSagaLog[];
  compensationLogs: BoothReservationCompensationLog[];
  createdAt: string;
  updatedAt: string;
};

export type BoothReservationSagaLog = {
  step: string;
  message: string;
  createdAt: string;
};

export type BoothReservationApprovalRequest = {
  approverId: string;
  approverName: string;
  simulateQrFailure?: boolean;
};

export type BoothReservationCompensationLog = {
  step: string;
  reason: string;
  fromStatus: BoothReservationStatus;
  toStatus: BoothReservationStatus;
  createdAt: string;
};

export type QrFailureReservationStatus = BoothReservationStatus;

export type CompensationLog = {
  id: string;
  reservationId: string;
  fromStatus: QrFailureReservationStatus;
  toStatus: QrFailureReservationStatus;
  reason: string;
  createdAt: string;
};

export type BoothReservation = {
  id: string;
  applicantName: string;
  boothName: string;
  location: string;
  status: QrFailureReservationStatus;
  approvedAt: string | null;
  qrCode: string | null;
  qrFailureReason: string | null;
  compensationLogs: CompensationLog[];
};

export type QrFailureRollbackResponse = {
  reservation: BoothReservation;
  compensationLog: CompensationLog;
  message: string;
};
