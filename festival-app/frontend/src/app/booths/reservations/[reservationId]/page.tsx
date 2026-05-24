import { BoothReservationVerification } from "@/components/booths/booth-reservation-verification";

type BoothReservationVerificationPageProps = {
  params: Promise<{
    reservationId: string;
  }>;
};

export default async function BoothReservationVerificationPage({
  params,
}: BoothReservationVerificationPageProps) {
  const { reservationId } = await params;

  return <BoothReservationVerification reservationId={reservationId} />;
}
