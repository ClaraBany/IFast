import OfferIcon from "@assets/card-icons/offer.png";
import { RideOfferStatus, rideOfferStatusDisplay, type RideOfferSummary } from "./offerTypes";
import ProfilePicture from "@shared/components/ProfilePicture";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { formatDepartureDateTime } from "@shared/utils/formatDateTime";
import { NeighborhoodsLabels } from "@shared/types/neighborhoods";

type OfferCardProps = {
  offer: RideOfferSummary;
  style?: "ACCEPTED" | "PENDING";
  onSelect?: (offer: RideOfferSummary) => void;
  disabled?: boolean;
};

export default function OfferCard({ offer, style, onSelect, disabled }: OfferCardProps) {
  const needsAction = offer.pendingBookingsCount > 0 && offer.status === "AVAILABLE";
  const status = rideOfferStatusDisplay[style ? style : offer.status];
  const statusLabel = needsAction
    ? `${offer.pendingBookingsCount} ${offer.pendingBookingsCount === 1 ? "Solicitação" : "Solicitações"}`
    : status.label;
  const { date, time } = formatDepartureDateTime(offer.departureDateTime);

  const details = (
    <>
      <p>
        {NeighborhoodsLabels[offer.origin]} <ArrowRight className="mb-1 inline size-4" />{" "}
        {NeighborhoodsLabels[offer.destination]}
      </p>

      <p>
        {date} - Saída: {time}
      </p>

      {offer.status !== RideOfferStatus.COMPLETED && offer.status !== RideOfferStatus.CANCELLED && (
        <p>
          Vagas: {offer.seatsTaken}/{offer.seatsCapacity}
        </p>
      )}

      <div className={`flex-center rounded-[20px] px-4 text-white ${status.bg}`}>
        <p>{statusLabel}</p>
      </div>
    </>
  );

  const driver = (
    <>
      <ProfilePicture url={offer.driver.pictureUrl} size="lg" />
      <p className="text-center">{offer.driver.name}</p>
    </>
  );

  return (
    <div
      className={`card-container ${status.border} ${needsAction ? "bg-primary/10" : ""} ${disabled ? "opacity-60" : ""}`}
    >
      <div className={`card-badge ${status.bg}`}>
        <img src={OfferIcon} className="size-6" alt="icone oferta" />
      </div>

      {onSelect ? (
        <>
          <div className="flex-center flex-1 flex-col items-start gap-2.5">{details}</div>
          <div className="flex-center w-25 flex-col gap-1.25">{driver}</div>

          <button
            type="button"
            onClick={() => onSelect(offer)}
            disabled={disabled}
            aria-label="Ofertar esta carona"
            className="absolute inset-0 cursor-pointer disabled:cursor-not-allowed"
          />
        </>
      ) : (
        <>
          <Link
            to={`/offers/${offer.id}`}
            className="flex-center flex-1 flex-col items-start gap-2.5 after:absolute after:inset-0 after:content-['']"
          >
            {details}
          </Link>

          <div className="flex-center w-25 flex-col gap-1.25">{driver}</div>
        </>
      )}
    </div>
  );
}
