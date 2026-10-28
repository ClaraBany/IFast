import RequestIcon from "@assets/card-icons/request.png";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import ProfilePicture from "@shared/components/ProfilePicture";
import { formatDepartureDateTime } from "@shared/utils/formatDateTime";
import type { RideRequest } from "./requestTypes";
import { NeighborhoodsLabels } from "@shared/types/neighborhoods";

type RequestCardProps = {
  request: RideRequest;
};

export default function RequestCard({ request }: RequestCardProps) {
  const { weekday, date, time: startTime } = formatDepartureDateTime(request.startDateTime);
  const { time: endTime } = formatDepartureDateTime(request.endDateTime);

  return (
    <div className="card-container flex-col gap-2 border-tertiary">
    <div className="flex">
        <div className="card-badge bg-tertiary">
          <img src={RequestIcon} className="size-6" alt="icone pedido" />
        </div>
        <div className="flex flex-1 flex-col items-start gap-2.5 after:absolute after:inset-0 after:content-['']">
        <p className="pr-7">
          {NeighborhoodsLabels[request.origin]} <ArrowRight className="mb-1 inline size-4" />{" "}
          {NeighborhoodsLabels[request.destination]}
        </p>
        <p>
          {weekday} | {date}
        </p>
        <p>
          Horário: {startTime} - {endTime}
        </p>
        </div>
      <Link to={`/users/${request.passenger.id}`} className="relative flex-center shrink-0 flex-col gap-1">
        <ProfilePicture url={request.passenger.pictureUrl} size="md" />
        <span className="max-w-24 truncate text-center text-sm">{request.passenger.name}</span>
      </Link>
        </div>
      
      <button className="btn btn-sm bg-tertiary">Ofertar Carona</button>
    </div>
    //o button tem que abrir um modal
  );
}