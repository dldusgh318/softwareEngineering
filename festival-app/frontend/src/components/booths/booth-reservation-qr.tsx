import { QRCodeSVG } from "qrcode.react";

type BoothReservationQrProps = {
  qrCode: string;
};

export function BoothReservationQr({ qrCode }: BoothReservationQrProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-[112px_1fr] sm:items-center">
      <div className="grid size-28 place-items-center border border-emerald-300 bg-white p-2">
        <QRCodeSVG
          aria-label={`예약 QR ${qrCode}`}
          bgColor="#ffffff"
          fgColor="#18181b"
          level="M"
          marginSize={1}
          size={96}
          value={qrCode}
        />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-emerald-100">예약 QR</p>
        <p className="mt-1 font-mono text-sm break-all text-white">{qrCode}</p>
      </div>
    </div>
  );
}
