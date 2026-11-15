import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, LoaderCircle, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Ripples } from "react-ripples-continued";
import RetryError from "@shared/components/RetryError";
import { formatDepartureDateTime } from "@shared/utils/formatDateTime";
import OfferCard from "@ride-offer/OfferCard";
import { get, getMatchingOffers, cancel } from "./requestService";
import { useAuthStore } from "@auth/authStore";
import { RideRequestStatus } from "./requestTypes";
import { NeighborhoodsLabels } from "@shared/types/neighborhoods";
import { DeleteModal } from "@shared/components/modals/DeleteModal";
import { PageHeader } from "@shared/components/navigation/PageHeader";
import BookingRequestCard from "@ride-booking/BookingRequestCard";
import { getByRequest } from "@ride-booking/bookingService";

export default function RequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const requestId = Number(id);

  const {
    data: request,
    isLoading: isLoadingRequest,
    isError: isRequestError,
    isFetching: isFetchingRequest,
    refetch: refetchRequest,
  } = useQuery({
    queryKey: ["ride-requests", Number(id)],
    queryFn: () => get(requestId),
    enabled: Number.isInteger(requestId) && requestId > 0,
  });
  const canManageRequest = request?.requester.id === user?.id && request?.status === RideRequestStatus.PENDING;

  const {
    data: bookingOffers = [],
    isLoading: isLoadingBookingOffers,
    isError: isBookingOffersError,
    isFetching: isFetchingBookingOffers,
    refetch: refetchBookingOffers,
  } = useQuery({
    queryKey: ["ride-requests", Number(id), "bookings"],
    queryFn: () => getByRequest(requestId, "PENDING"),
    enabled: canManageRequest,
  });

  const {
    data: compatibleOffers = [],
    isLoading: isLoadingCompatibleOffers,
    isError: isCompatibleOffersError,
    isFetching: isFetchingCompatibleOffers,
    refetch: refetchCompatibleOffers,
  } = useQuery({
    queryKey: ["ride-requests", Number(id), "matching-offers"],
    queryFn: () => getMatchingOffers(requestId),
    enabled: Boolean(request),
  });

  const { mutate: cancelRequest, isPending: isDeleting } = useMutation({
    mutationFn: () => cancel(requestId),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["ride-requests", Number(id)] });
      queryClient.invalidateQueries({ queryKey: ["ride-requests"] });
      navigate(-1);
    },
  });

  if (isLoadingRequest) {
    return (
      <div className="flex-center flex-1">
        <LoaderCircle className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (isRequestError || !request) {
    return (
      <RetryError
        onRetry={refetchRequest}
        isFetching={isFetchingRequest}
        message="Não foi possível carregar o pedido."
      />
    );
  }

  const { weekday, date, time: startTime } = formatDepartureDateTime(request.desiredDepartureStart);
  const { time: endTime } = formatDepartureDateTime(request.desiredDepartureEnd);

  return (
    <>
      <title>Detalhes do Pedido</title>
      <PageHeader title="Detalhes">
        {canManageRequest && (
          <>
            <Link to={`/requests/${request.id}/edit`} className="icon-btn text-secondary" aria-label="Editar pedido">
              <Pencil size={22} />
              <Ripples color="var(--ripple-dark)" on="mouseDown" />
            </Link>
            <button
              type="button"
              className="icon-btn text-danger"
              aria-label="Cancelar pedido"
              onClick={() => setDeleteOpen(true)}
              disabled={isDeleting}
            >
              <Trash2 size={22} />
              <Ripples color="var(--ripple-dark)" on="mouseDown" />
            </button>
          </>
        )}
      </PageHeader>

      <h3 className="text-center">
        {NeighborhoodsLabels[request.origin]} <ArrowRight className="mb-1 inline" />{" "}
        {NeighborhoodsLabels[request.destination]}
      </h3>

      <section className="flex-column w-full gap-1 rounded-2xl bg-white px-5 py-3">
        <p>
          <span className="text-label">Data: </span>
          {weekday} | {date}
        </p>
        <p>
          <span className="text-label">Horário desejado: </span>
          {startTime} - {endTime}
        </p>
      </section>

      {canManageRequest && (
        <section className="flex-column w-full gap-3">
          <h3>Ofertas</h3>

          {isBookingOffersError ? (
            <RetryError
              onRetry={refetchBookingOffers}
              isFetching={isFetchingBookingOffers}
              message="Não foi possível carregar as ofertas."
            />
          ) : isLoadingBookingOffers ? (
            <div className="flex-center py-6">
              <LoaderCircle className="animate-spin text-primary" size={36} />
            </div>
          ) : bookingOffers.length === 0 ? (
            <div className="flex-center w-full rounded-2xl bg-white px-6 py-4">
              <p className="text-neutral-dark">Nenhuma oferta de carona até o momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
              {bookingOffers.map((booking) => (
                <BookingRequestCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </section>
      )}

      <section className="flex-column w-full gap-3">
        <h3>Ofertas compatíveis</h3>

        {isCompatibleOffersError ? (
          <RetryError
            onRetry={refetchCompatibleOffers}
            isFetching={isFetchingCompatibleOffers}
            message="Não foi possível carregar as ofertas compatíveis."
          />
        ) : isLoadingCompatibleOffers ? (
          <div className="flex-center py-6">
            <LoaderCircle className="animate-spin text-primary" size={36} />
          </div>
        ) : compatibleOffers.length === 0 ? (
          <div className="flex-center w-full rounded-2xl bg-white px-6 py-4">
            <p className="text-neutral-dark">Ainda não há ofertas compatíveis com este pedido.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
            {compatibleOffers.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        )}
      </section>

      {canManageRequest && (
        <DeleteModal
          open={deleteOpen}
          title="Cancelar Pedido"
          message="Tem certeza que deseja cancelar este pedido?"
          isLoading={isDeleting}
          onConfirm={() => cancelRequest()}
          onCancel={() => setDeleteOpen(false)}
        />
      )}
    </>
  );
}
