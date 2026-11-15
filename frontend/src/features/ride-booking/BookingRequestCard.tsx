import OfferIcon from "@assets/card-icons/offer.png";
import { rideOfferStatusDisplay } from "@ride-offer/offerTypes";
import ProfilePicture from "@shared/components/ProfilePicture";
import { Link, useNavigate } from "react-router";
import { ArrowRight, Check, LoaderCircle, X } from "lucide-react";
import { formatDepartureDateTime } from "@shared/utils/formatDateTime";
import { NeighborhoodsLabels } from "@shared/types/neighborhoods";
import type { RideBooking } from "./bookingTypes";
import { Ripples } from "react-ripples-continued";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accept, reject } from "./bookingService";

type BookingRequestCardProps = {
  booking: RideBooking;
};

export default function BookingRequestCard({ booking }: BookingRequestCardProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const status = rideOfferStatusDisplay[booking.rideOffer.status];
  const { date, time } = formatDepartureDateTime(booking.rideOffer.departureDateTime);

  const { mutate: acceptBooking, isPending: isAcceptPending } = useMutation({
    mutationFn: (id: number) => accept(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ride-requests", Number(booking.rideRequestId)] });
      queryClient.invalidateQueries({ queryKey: ["ride-offers", Number(booking.rideOffer.id)] });
      navigate(`/offers/${booking.rideOffer.id}`, { replace: true });
    },
  });

  const { mutate: rejectBooking, isPending: isRejectPending } = useMutation({
    mutationFn: (id: number) => reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ride-requests", Number(booking.rideRequestId)] });
      queryClient.invalidateQueries({ queryKey: ["ride-offers", Number(booking.rideOffer.id)] });
    },
  });

  return (
    <div className={`card-container flex-col gap-3 ${status.border}`}>
      <div className={`card-badge ${status.bg}`}>
        <img src={OfferIcon} className="size-6" alt="icone oferta" />
      </div>

      <div className="flex-center justify-between">
        <Link
          to={`/offers/${booking.rideOffer.id}`}
          className="flex flex-1 flex-col items-start gap-2.5 after:absolute after:inset-0 after:content-['']"
        >
          <p>
            {NeighborhoodsLabels[booking.rideOffer.origin]} <ArrowRight className="mb-1 inline size-4" />{" "}
            {NeighborhoodsLabels[booking.rideOffer.destination]}
          </p>

          <p>
            {date} - Saída: {time}
          </p>
        </Link>

        <Link to={`/users/${booking.rideOffer.driver.id}`} className="relative flex-center w-25 flex-col gap-1.25">
          <ProfilePicture url={booking.rideOffer.driver.pictureUrl} size="lg" />
          <p className="text-center">{booking.rideOffer.driver.name}</p>
        </Link>
      </div>

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
    </div>
  );
}
