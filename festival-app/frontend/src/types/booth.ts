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
  | "QR_FAILED"
  | "RESERVED"
  | "CHECKED_IN";

export type CompensationLog = {
  id: string;
  reservationId: string;
  fromStatus: BoothReservationStatus;
  toStatus: BoothReservationStatus;
  reason: string;
  createdAt: string;
};

export type BoothReservation = {
  id: string;
  applicantName: string;
  boothName: string;
  location: string;
  status: BoothReservationStatus;
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
