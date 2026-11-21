import RequestIcon from "@assets/card-icons/request.png";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import ProfilePicture from "@shared/components/ProfilePicture";
import { formatDepartureDateTime } from "@shared/utils/formatDateTime";
import type { RideRequest } from "./requestTypes";
import { NeighborhoodsLabels } from "@shared/types/neighborhoods";
import { useState } from "react";
import { useAuthStore } from "@auth/authStore";
import BookingRequestModal from "@ride-booking/BookingRequestModal";

type RequestCardProps = {
  request: RideRequest;
};

export default function RequestCard({ request }: RequestCardProps) {
  const authUser = useAuthStore((state) => state.user);
  const isRequester = authUser?.id === request.requester.id;
  const [requestOfferOpen, setRequestOfferOpen] = useState(false);
  const { weekday, date, time: startTime } = formatDepartureDateTime(request.desiredDepartureStart);
  const { time: endTime } = formatDepartureDateTime(request.desiredDepartureEnd);
  const needsAction = request.pendingBookingsCount > 0 && isRequester;
  const style = {
    bg: needsAction || !isRequester ? "bg-tertiary" : "bg-neutral-dark",
    border: needsAction || !isRequester ? "border-tertiary" : "border-neutral-dark",
    card: needsAction ? "bg-tertiary/10" : "",
  };

  return (
    <div className={`card-container flex-col gap-2 ${style.border} ${style.card}`}>
      <div className="flex">
        <div className={`card-badge ${style.bg}`}>
          <img src={RequestIcon} className="size-6" alt="icone pedido" />
        </div>
        <Link
          to={isRequester ? `/requests/${request.id}` : ""}
          className="flex flex-1 flex-col items-start justify-center gap-2.5 after:absolute after:inset-0 after:content-['']"
        >
          <p>
            {NeighborhoodsLabels[request.origin]} <ArrowRight className="mb-1 inline size-4" />{" "}
            {NeighborhoodsLabels[request.destination]}
          </p>
          <p>
            {weekday} | {date}
          </p>
          <p>
            Horário: {startTime} - {endTime}
          </p>

          {isRequester && (
            <div className={`flex-center rounded-[20px] px-4 text-white ${style.bg}`}>
              {needsAction
                ? `${request.pendingBookingsCount} ${request.pendingBookingsCount === 1 ? "Oferta Recebida" : "Ofertas Recebidas"}`
                : "Procurando Oferta"}
            </div>
          )}
        </Link>
        <div className="flex-center w-25 flex-col gap-1.25">
          <ProfilePicture url={request.requester.pictureUrl} size="lg" />
          <p className="text-center">{request.requester.name}</p>
        </div>
      </div>

      {!isRequester && (
        <button className="btn btn-sm bg-tertiary" onClick={() => setRequestOfferOpen(true)}>
          Ofertar Carona
        </button>
      )}

      <BookingRequestModal request={request} open={requestOfferOpen} onClose={() => setRequestOfferOpen(false)} />
    </div>
  );
}
