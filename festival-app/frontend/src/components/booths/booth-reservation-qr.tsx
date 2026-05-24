type BoothReservationQrProps = {
  qrCode: string;
};

export function BoothReservationQr({ qrCode }: BoothReservationQrProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-[112px_1fr] sm:items-center">
      <div className="grid size-28 grid-cols-5 grid-rows-5 gap-1 border border-emerald-300 bg-white p-2">
        {Array.from({ length: 25 }, (_, index) => (
          <span
            aria-hidden="true"
            className={isFilledQrCell(qrCode, index) ? "bg-zinc-950" : "bg-white"}
            key={index}
          />
        ))}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-emerald-100">예약 QR</p>
        <p className="mt-1 font-mono text-sm break-all text-white">{qrCode}</p>
      </div>
    </div>
  );
}

function isFilledQrCell(qrCode: string, index: number) {
  const charCode = qrCode.charCodeAt(index % qrCode.length);
  return (charCode + index) % 3 !== 0;
}
