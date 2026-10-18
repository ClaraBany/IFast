import { PageHeader } from "@shared/components/PageHeader";
import { RideOfferStatus, rideOfferStatusDisplay } from "./offerTypes";
import { useAuthStore } from "@auth/authStore";
import { Link, useParams } from "react-router";
import { ArrowRight, Info, LoaderCircle, SquarePen, Trash2 } from "lucide-react";
import { Ripples } from "react-ripples-continued";
import ProfilePicture from "@shared/components/ProfilePicture";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cancel, complete, get } from "./offerService";
import RetryError from "@shared/components/RetryError";
import { useState } from "react";
import { DeleteModal } from "@shared/components/DeleteModal";
import { formatDepartureDateTime } from "@shared/utils/formatDateTime";
import { SuccessModal } from "@shared/components/SucessModal";
import { NeighborhoodsLabels } from "@user/userTypes";

type OfferAction = {
  label: string;
  onClick?: () => void;
  isPending?: boolean;
  disabled?: boolean;
};

export default function OfferDetails() {
  const { id } = useParams();
  const user = useAuthStore((state) => state.user);
  const [successOpen, setSuccessOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: offer,
    isLoading: isLoadingOffer,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["ride-offers", id],
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
  const status = rideOfferStatusDisplay[offer.status];
  const { weekday, date, time } = formatDepartureDateTime(offer.departureDateTime);
  const hasDeparted = new Date() >= new Date(offer.departureDateTime);

  let action: OfferAction | null = null;
  if (isDriver) {
    if (offer.status === RideOfferStatus.AVAILABLE || offer.status === RideOfferStatus.FULL) {
      action = {
        label: "Concluir carona",
        onClick: () => completeOffer(offer.id),
        isPending: isPendingComplete,
        disabled: !hasDeparted,
      };
    }
  } else if (offer.status === RideOfferStatus.AVAILABLE) {
    action = { label: "Solicitar vaga" };
  }

  return (
    <>
      <title>Detalhes Carona</title>
      <PageHeader title="Detalhes">
        {isDriver && (offer.status === RideOfferStatus.AVAILABLE || offer.status === RideOfferStatus.FULL) && (
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
      {/* TODO: implementar na feat booking-request */}
      {/* {isDriver && (
        <section className="flex-column w-full gap-2.5">
          <h3>Passageiros</h3>

          <div className="w-full overflow-x-auto rounded-2xl bg-white">
            <div className="flex-center w-max min-w-full gap-5 px-6 py-4">
              {offer.passengers.length === 0 ? (
                <p className="text-neutral-dark">Nenhum passageiro até o momento</p>
              ) : (
                offer.passengers.map((passenger) => (
                  <Link
                    key={passenger.id}
                    to={`/users/${passenger.id}`}
                    className="flex-center w-25 shrink-0 flex-col gap-1.25"
                  >
                    <ProfilePicture url={passenger.pictureUrl} size="lg" />
                    <p className="text-center">{passenger.name}</p>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>
      )} */}

      {isDriver && (
        <section className="flex-column w-full gap-2.5">
          <h3>Solicitações</h3>

          <div className="flex-column w-full gap-2.5 rounded-2xl bg-white px-6 py-4">
            <p className="text-center text-neutral-dark">Nenhuma solicitação até o momento</p>
          </div>
        </section>
      )}

      {action && (
        <div className="mt-auto">
          {isDriver && !hasDeparted && (
            <p className="mb-1 text-neutral-dark">
              <Info className="mb-1 inline size-4" /> Será possível concluir a carona após o horário de saída
            </p>
          )}
          <button
            className="btn btn-lg bg-primary"
            onClick={action.onClick}
            disabled={action.isPending || action.disabled}
          >
            {action.isPending ? <LoaderCircle className="animate-spin" /> : action.label}
            <Ripples color="var(--ripple-light)" />
          </button>
        </div>
      )}

      <SuccessModal open={successOpen} message="Oferta concluída com sucesso!" onClose={() => setSuccessOpen(false)} />

      <DeleteModal
        open={deleteOpen}
        title="Excluir Oferta"
        message={`Tem certeza que deseja excluir essa oferta?${offer.seatsTaken ? "\nOs passageiros serão notificados" : ""}`}
        isLoading={isPendingCancel}
        onConfirm={() => cancelOffer(offer.id)}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  );
}
