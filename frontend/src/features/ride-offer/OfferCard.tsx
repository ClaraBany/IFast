import OfferIcon from "@assets/card-icons/offer.png";
import { displayStatusMap, type Offer } from "./offerTypes";
import ProfilePicture from "@shared/components/ProfilePicture";
import { Link } from "react-router";

type OfferCardProps = {
  offer: Offer;
};

export default function OfferCard({ offer }: OfferCardProps) {
  const isFull = offer.passengers.length === offer.capacity;

  const status = displayStatusMap[offer.status === "Completed" ? "Completed" : isFull ? "Full" : "Available"];

  return (
    <div className={`card-container ${status.border} cursor-pointer transition-all hover:box-shadow`}>
      <div className={`card-badge ${status.bg}`}>
        <img src={OfferIcon} className="size-6" alt="icone oferta" />
      </div>

      <div className="flex flex-1 flex-col items-start gap-2.5">
        <p>
          <Link to={`/offers/${offer.id}`} className="after:absolute after:inset-0 after:content-['']">
            {offer.origin} -{">"} {offer.destination}
          </Link>
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
      </div>

      <Link to={`/users/${offer.owner.id}`} className="relative flex-center w-25 flex-col gap-1.25">
        <ProfilePicture url={offer.owner.pictureUrl} size="lg" />
        <p className="text-center">{offer.owner.name}</p>
      </Link>
    </div>
  );
}
