import { PageHeader } from "@shared/components/navigation/PageHeader";
import { RideOfferStatus, rideOfferStatusDisplay } from "./offerTypes";
import { useAuthStore } from "@auth/authStore";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowRight, Check, Info, LoaderCircle, SquarePen, Trash2, X } from "lucide-react";
import { Ripples } from "react-ripples-continued";
import ProfilePicture from "@shared/components/ProfilePicture";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancel, complete, get } from "./offerService";
import RetryError from "@shared/components/RetryError";
import { useEffect, useRef, useState } from "react";
import { DeleteModal } from "@shared/components/modals/DeleteModal";
import { formatDepartureDateTime } from "@shared/utils/formatDateTime";
import { SuccessModal } from "@shared/components/modals/SucessModal";
import { NeighborhoodsLabels } from "@shared/types/neighborhoods";
import { getByOffer, cancel as cancelBooking, createForOffer, accept, reject } from "@ride-booking/bookingService";
import BookingOfferCard from "@ride-booking/BookingOfferCard";

type OfferAction = {
  label: string;
  icon?: React.ElementType;
  buttonStyle: string;
  onClick?: () => void;
  isPending?: boolean;
  disabled?: boolean;
};

export default function OfferDetails() {
  const { id } = useParams();
  const user = useAuthStore((state) => state.user);
  const [successOpen, setSuccessOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [cancelBookingOpen, setCancelBookingOpen] = useState(false);
  const [justRequested, setJustRequested] = useState(false);
  const requestTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (requestTimeoutRef.current) {
        clearTimeout(requestTimeoutRef.current);
      }
    };
  }, []);

  const {
    data: offer,
    isLoading: isLoadingOffer,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["ride-offers", Number(id)],
    queryFn: () => get(Number(id)),
  });

  const { mutate: cancelOffer, isPending: isPendingCancel } = useMutation({
    mutationFn: (id: number) => cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ride-offers"] });
      setDeleteOpen(false);
    },
  });

  const { mutate: completeOffer, isPending: isPendingComplete } = useMutation({
    mutationFn: (id: number) => complete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ride-offers"] });
      setSuccessOpen(true);
    },
  });

  const {
    data: bookings = [],
    isLoading: isLoadingBookings,
    isError: isBookingsError,
    isFetching: isFetchingBookings,
    refetch: refetchBookings,
  } = useQuery({
    queryKey: ["ride-offers", Number(id), "bookings"],
    queryFn: () => getByOffer(Number(id)),
    enabled: Boolean(offer),
  });
  const pendingBookings = bookings.filter((b) => b.status === "PENDING");
  const passengers = bookings.filter((b) => b.status === "ACCEPTED");
  const userBooking = bookings.find(
    (b) => b.passenger.id === user?.id && (b.status === "ACCEPTED" || b.status === "PENDING"),
  );
  const isAccepted = userBooking?.status === "ACCEPTED";
  const isByDriverPending = userBooking?.initiatedBy === "DRIVER" && userBooking.status === "PENDING";

  const { mutate: createBooking, isPending: isPendingCreateBooking } = useMutation({
    mutationFn: (id: number) => createForOffer(id),
    onMutate: () => {
      setJustRequested(true);
      if (requestTimeoutRef.current) clearTimeout(requestTimeoutRef.current);
      requestTimeoutRef.current = setTimeout(() => {
        setJustRequested(false);
      }, 1800);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["ride-offers", Number(id), "bookings"] });
    },
    onError: () => {
      if (requestTimeoutRef.current) clearTimeout(requestTimeoutRef.current);
      setJustRequested(false);
    },
  });

  const { mutate: handleCancelBooking, isPending: isPendingCancelBooking } = useMutation({
    mutationFn: (id: number) => cancelBooking(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["ride-offers", Number(id)] });
      setCancelBookingOpen(false);
    },
  });

  const { mutate: acceptBooking, isPending: isAcceptPending } = useMutation({
    mutationFn: (id: number) => accept(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ride-requests"] });
      queryClient.invalidateQueries({ queryKey: ["ride-offers", Number(id)] });
    },
  });

  const { mutate: rejectBooking, isPending: isRejectPending } = useMutation({
    mutationFn: (id: number) => reject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ride-requests"] });
      queryClient.invalidateQueries({ queryKey: ["ride-offers", Number(id), "bookings"] });
      navigate(-1);
    },
  });

  if (isLoadingOffer) {
    return (
      <div className="flex-center flex-1">
        <LoaderCircle className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (isError || !offer) {
    return <RetryError onRetry={refetch} isFetching={isFetching} />;
  }

  const isDriver = offer.driver.id === user?.id;
  const isOpen = offer.status === "AVAILABLE" || offer.status === "FULL";
  const status = rideOfferStatusDisplay[offer.status];
  const { weekday, date, time } = formatDepartureDateTime(offer.departureDateTime);
  const hasDeparted = new Date() >= new Date(offer.departureDateTime);

  let action: OfferAction | null = null;
  if (isOpen) {
    if (isDriver) {
      action = {
        label: "Concluir Carona",
        buttonStyle: "bg-primary",
        onClick: () => completeOffer(offer.id),
        isPending: isPendingComplete,
        disabled: !hasDeparted,
      };
    } else if (isByDriverPending) {
      action = {
        label: "Aceitar",
        icon: Check,
        buttonStyle: "bg-primary",
        onClick: () => acceptBooking(userBooking.id),
        isPending: isAcceptPending,
      };
    } else if (justRequested) {
      action = {
        label: "Vaga Solicitada!",
        icon: Check,
        buttonStyle: "bg-white border border-primary text-primary pointer-events-none",
      };
    } else if (userBooking) {
      action = {
        label: isAccepted ? "Sair da Carona" : "Retirar Solicitação",
        buttonStyle: "bg-danger",
        onClick: () => setCancelBookingOpen(true),
        isPending: isPendingCancelBooking,
      };
    } else if (offer.status === RideOfferStatus.AVAILABLE) {
      action = {
        label: "Solicitar Vaga",
        buttonStyle: "bg-primary",
        onClick: () => createBooking(offer.id),
        isPending: isPendingCreateBooking,
      };
    }
  }

  return (
    <>
      <title>Detalhes Carona</title>
      <PageHeader title="Detalhes">
        {isDriver && isOpen && (
          <>
            <Link to={`/offers/${offer.id}/edit`} className="icon-btn">
              <SquarePen className="text-secondary" size={24} />
              <Ripples color="var(--ripple-dark)" />
            </Link>

            <button className="icon-btn text-danger" onClick={() => setDeleteOpen(true)} disabled={isPendingCancel}>
              {isPendingCancel ? <LoaderCircle className="animate-spin" /> : <Trash2 />}
              <Ripples color="var(--ripple-dark)" />
            </button>
          </>
        )}
      </PageHeader>

      <h3 className="text-center">
        {NeighborhoodsLabels[offer.origin]} <ArrowRight className="mb-1 inline" />{" "}
        {NeighborhoodsLabels[offer.destination]}
      </h3>

      <section className="card-container pointer-events-none border-0 px-6 shadow-none">
        <div className="flex flex-1 flex-col items-start gap-2.5">
          <p>
            {weekday} | {date}
          </p>
          <p>Saída às {time}</p>
          <p>
            Vagas: {offer.seatsTaken}/{offer.seatsCapacity}
          </p>
          <div className={`flex-center rounded-[20px] px-4 text-white ${status.bg}`}>
            <p>{status.label}</p>
          </div>
        </div>

        <Link to={`/users/${offer.driver.id}`} className="pointer-events-auto flex-center w-25 flex-col gap-1.25">
          <ProfilePicture url={offer.driver.pictureUrl} size="lg" />
          <p className="text-center">{offer.driver.name}</p>
        </Link>
      </section>

      <section className="flex-column w-full gap-2.5">
        <h3>Veículo</h3>

        <div className="flex-column w-full gap-2.5 rounded-2xl bg-white px-6 py-4">
          <div className="flex-center justify-between gap-2.5 md:flex-col md:items-start">
            <span>
              <span className="text-label">Modelo: </span>
              {offer.vehicle.model}
            </span>
            <span>
              <span className="text-label">Cor: </span>
              {offer.vehicle.color}
            </span>
          </div>

          {offer.vehicle.plate && (
            <p>
              <span className="text-label">Placa: </span>
              {offer.vehicle.plate}
            </p>
          )}
        </div>
      </section>

      {offer.description && (
        <section className="flex-column w-full gap-2.5">
          <h3>Descrição</h3>

          <div className="flex-column w-full gap-2.5 rounded-2xl bg-white px-6 py-4">
            <p className="text-pretty">{offer.description}</p>
          </div>
        </section>
      )}

      {passengers.length > 0 && (
        <section className="flex-column w-full gap-2.5">
          <h3>Passageiros</h3>

          <div className="w-full overflow-x-auto rounded-2xl bg-white">
            <div className="flex-center w-max min-w-full gap-5 px-6 py-4">
              {passengers.map((booking) => (
                <Link
                  key={booking.id}
                  to={`/users/${booking.passenger.id}`}
                  className="flex-center w-25 shrink-0 flex-col gap-1.25"
                >
                  <ProfilePicture url={booking.passenger.pictureUrl} size="lg" />
                  <p className="text-center">{booking.passenger.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {isDriver && offer.status === "AVAILABLE" && (
        <section className="flex-column w-full gap-2.5">
          <h3>Solicitações</h3>

          {isBookingsError ? (
            <RetryError
              onRetry={refetchBookings}
              isFetching={isFetchingBookings}
              message="Não foi possível carregar as solicitações."
            />
          ) : isLoadingBookings ? (
            <div className="flex-center py-6">
              <LoaderCircle className="animate-spin text-primary" size={36} />
            </div>
          ) : pendingBookings.length === 0 ? (
            <div className="flex-center w-full rounded-2xl bg-white px-6 py-4">
              <p className="text-neutral-dark">Nenhuma solicitação até o momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
              {pendingBookings.map((booking) => (
                <BookingOfferCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </section>
      )}

      {action && (
        <div className="mt-auto">
          {isDriver && !hasDeparted && (
            <p className="mb-1 text-neutral-dark">
              <Info className="mb-1 inline size-4" /> Será possível concluir a carona após o horário de saída
            </p>
          )}
          <div className="flex gap-2">
            <button
              className={`btn btn-lg transition-colors ${action.buttonStyle}`}
              onClick={action.onClick}
              disabled={action.isPending || action.disabled}
            >
              {action.icon && <action.icon />}
              {action.isPending ? <LoaderCircle className="animate-spin" /> : action.label}
              <Ripples color="var(--ripple-light)" />
            </button>

            {isByDriverPending && (
              <button
                className={`btn btn-lg bg-danger`}
                onClick={() => rejectBooking(userBooking.id)}
                disabled={isRejectPending || isAcceptPending}
              >
                <X />
                {isRejectPending ? <LoaderCircle className="animate-spin" /> : "Recusar"}
                <Ripples color="var(--ripple-light)" />
              </button>
            )}
          </div>
        </div>
      )}

      <SuccessModal open={successOpen} message="Oferta concluída com sucesso!" onClose={() => setSuccessOpen(false)} />

      <DeleteModal
        open={deleteOpen}
        title="Cancelar Oferta"
        message={`Tem certeza que deseja cancelar essa oferta?${offer.seatsTaken ? "\nOs passageiros serão notificados" : ""}`}
        buttonLabel="Cancelar"
        isLoading={isPendingCancel}
        onConfirm={() => cancelOffer(offer.id)}
        onCancel={() => setDeleteOpen(false)}
      />
      {userBooking && (
        <DeleteModal
          open={cancelBookingOpen}
          title={isAccepted ? "Sair da Carona" : "Retirar Solicitação"}
          message={
            isAccepted
              ? "Tem certeza que deseja sair dessa oferta?\nO motorista será notificado"
              : "Tem certeza que deseja retirar sua solicitação?"
          }
          buttonLabel={isAccepted ? "Sair" : "Retirar"}
          isLoading={isPendingCancelBooking}
          onConfirm={() => handleCancelBooking(userBooking.id)}
          onCancel={() => setCancelBookingOpen(false)}
        />
      )}
    </>
  );
}
