import { QRCodeSVG } from "qrcode.react";

type TicketQrProps = {
  qrCode: string;
};

export default function TicketQr({ qrCode }: TicketQrProps) {
  return (
    <div className="inline-flex flex-col items-center gap-3 border border-white/12 bg-white p-4 text-zinc-950">
      <QRCodeSVG aria-label={`공연 티켓 QR ${qrCode}`} value={qrCode} size={156} />
      <span className="max-w-64 text-center text-xs font-bold break-all">{qrCode}</span>
    </div>
  );
}
