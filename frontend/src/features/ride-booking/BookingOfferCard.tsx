import ProfilePicture from "@shared/components/ProfilePicture";
import { Link } from "react-router";
import type { RideBooking } from "./bookingTypes";
import { Ripples } from "react-ripples-continued";
import { Check, LoaderCircle, RotateCcwClock, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accept, reject } from "./bookingService";

type BookingOfferCardProps = {
  booking: RideBooking;
};

export default function BookingOfferCard({ booking }: BookingOfferCardProps) {
  const queryClient = useQueryClient();

  const { mutate: acceptBooking, isPending: isAcceptPending } = useMutation({
    mutationFn: (id: number) => accept(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["ride-offers", Number(booking.rideOffer.id)] });
    },
  });

  const { mutate: rejectBooking, isPending: isRejectPending } = useMutation({
    mutationFn: (id: number) => reject(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["ride-offers", Number(booking.rideOffer.id), "bookings"] });
    },
  });

  return (
    <div className={`card-container flex-col justify-start gap-2.5 border-primary`}>
      <Link to={`/users/${booking.passenger.id}`} className="relative flex items-center justify-start gap-1.25">
        <ProfilePicture url={booking.passenger.pictureUrl} size="sm" />
        <p className="text-center">{booking.passenger.name}</p>
      </Link>

      {booking.initiatedBy === "DRIVER" ? (
        <div className="mx-auto flex-center h-8.5 w-fit rounded-2xl bg-pending px-2 py-1.5 text-label text-slate-900">
          <RotateCcwClock />
          <p className="text-button">Aguardando Resposta</p>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            className="btn btn-sm bg-primary"
            onClick={() => acceptBooking(booking.id)}
            disabled={isAcceptPending || isRejectPending}
          >
            {isAcceptPending ? <LoaderCircle className="animate-spin" /> : <Check />}
            Aceitar
            <Ripples color="var(--ripple-light)" />
          </button>

          <button
            className="btn btn-sm bg-danger"
            onClick={() => rejectBooking(booking.id)}
            disabled={isAcceptPending || isRejectPending}
          >
            {isRejectPending ? <LoaderCircle className="animate-spin" /> : <X />}
            Recusar
            <Ripples color="var(--ripple-light)" />
          </button>
        </div>
      )}
    </div>
  );
}
