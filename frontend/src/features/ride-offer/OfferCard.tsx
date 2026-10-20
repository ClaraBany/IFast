import OfferIcon from "@assets/card-icons/offer.png";
import { RideOfferStatus, rideOfferStatusDisplay, type RideOfferSummary } from "./offerTypes";
import ProfilePicture from "@shared/components/ProfilePicture";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { formatDepartureDateTime } from "@shared/utils/formatDateTime";
import { NeighborhoodsLabels } from "@shared/types/neighborhoods";

type OfferCardProps = {
  offer: RideOfferSummary;
};

export default function OfferCard({ offer }: OfferCardProps) {
  const status = rideOfferStatusDisplay[offer.status];
  const { date, time } = formatDepartureDateTime(offer.departureDateTime);

  return (
    <div className={`card-container ${status.border}`}>
      <div className={`card-badge ${status.bg}`}>
        <img src={OfferIcon} className="size-6" alt="icone oferta" />
      </div>

      <Link
        to={`/offers/${offer.id}`}
        className="flex flex-1 flex-col items-start gap-2.5 after:absolute after:inset-0 after:content-['']"
      >
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
          <p>{status.label}</p>
        </div>
      </Link>

      <Link to={`/users/${offer.driver.id}`} className="relative flex-center w-25 flex-col gap-1.25">
        <ProfilePicture url={offer.driver.pictureUrl} size="lg" />
        <p className="text-center">{offer.driver.name}</p>
      </Link>
    </div>
  );
}
