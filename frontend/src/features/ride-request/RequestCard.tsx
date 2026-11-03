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
  const { weekday, date, time: startTime } = formatDepartureDateTime(request.desiredDepartureStart);
  const { time: endTime } = formatDepartureDateTime(request.desiredDepartureEnd);

  return (
    <div className="card-container flex-col gap-2 border-tertiary">
      <div className="flex">
        <div className="card-badge bg-tertiary">
          <img src={RequestIcon} className="size-6" alt="icone pedido" />
        </div>
        <div className="flex flex-1 flex-col justify-center gap-2.5 after:absolute after:inset-0 after:content-['']">
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
        </div>
        <Link to={`/users/${request.requester.id}`} className="relative flex-center w-25 flex-col gap-1.25">
          <ProfilePicture url={request.requester.pictureUrl} size="lg" />
          <p className="text-center">{request.requester.name}</p>
        </Link>
      </div>

      <button className="btn btn-sm bg-tertiary">Ofertar Carona</button>
    </div>
  );
}
