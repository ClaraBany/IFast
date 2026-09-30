import OfferIcon from "@assets/card-icons/offer.png";
import { displayStatusMap, type Offer } from "./offerTypes";
import ProfilePicture from "@shared/components/ProfilePicture";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

type OfferCardProps = {
  offer: Offer;
};

export default function OfferCard({ offer }: OfferCardProps) {
  const status = displayStatusMap[offer.status];

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
          {offer.origin} <ArrowRight className="mb-1 inline size-4" /> {offer.destination}
        </p>

        <p>
          {offer.date} - Saída: {offer.departureTime}
        </p>

        {offer.status !== "Completed" && (
          <p>
            Vagas: {offer.passengers.length}/{offer.capacity}
          </p>
        )}

        <div className={`flex-center rounded-[20px] px-4 text-white ${status.bg}`}>
          <p>{status.label}</p>
        </div>
      </Link>

      <Link to={`/users/${offer.owner.id}`} className="relative flex-center w-25 flex-col gap-1.25">
        <ProfilePicture url={offer.owner.pictureUrl} size="lg" />
        <p className="text-center">{offer.owner.name}</p>
      </Link>
    </div>
  );
}
