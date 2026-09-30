import { PageHeader } from "@shared/components/PageHeader";
import { displayStatusMap } from "./offerTypes";
import { useAuthStore } from "@auth/authStore";
import { Link, useParams } from "react-router";
import { ArrowRight, LoaderCircle, SquarePen, Trash2 } from "lucide-react";
import { Ripples } from "react-ripples-continued";
import ProfilePicture from "@shared/components/ProfilePicture";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { del, get } from "./offerService";
import RetryError from "@shared/components/RetryError";
import { mockOffers } from "./mock";
import { useState } from "react";
import { DeleteModal } from "@shared/components/DeleteModal";

export default function OfferDetails() {
  const { id } = useParams();
  const user = useAuthStore((state) => state.user);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    data: offer = mockOffers.find((o) => o.id === Number(id)),
    isLoading: isLoadingOffer,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["offers", id],
    queryFn: () => get(Number(id)),
    enabled: false,
  });

  const { mutate: deleteOffer, isPending } = useMutation({
    mutationFn: (id: number) => del(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
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

  if (!offer) {
    return <p className="text-center text-neutral-dark">Carona não encontrada</p>;
  }

  const isOwner = offer.owner.id === user?.id;
  const status = displayStatusMap[offer.status];

  let buttonLabel: string | null = null;
  if (offer.status !== "Completed") {
    if (isOwner) {
      buttonLabel = "Concluir carona";
    } else if (offer.status === "Available") {
      buttonLabel = "Solicitar vaga";
    }
  }

  return (
    <>
      <title>Detalhes Carona</title>
      <PageHeader title="Detalhes da Carona">
        {isOwner && (
          <>
            <Link to={`/offers/${offer.id}/edit`} className="icon-btn">
              <SquarePen className="text-secondary" size={24} />
              <Ripples color="var(--ripple-dark)" />
            </Link>

            <button className="icon-btn text-danger" onClick={() => setDeleteOpen(true)} disabled={isPending}>
              {isPending ? <LoaderCircle className="animate-spin" /> : <Trash2 />}
              <Ripples color="var(--ripple-dark)" />
            </button>
          </>
        )}
      </PageHeader>

      <h3 className="text-center">
        {offer.origin} <ArrowRight className="mb-1 inline" /> {offer.destination}
      </h3>

      <section className="card-container pointer-events-none border-0 px-6">
        <div className="flex flex-1 flex-col items-start gap-2.5">
          <p>Segunda | {offer.date}</p> {/* TODO: Converter data que recebe em dia da semana */}
          <p>
            {offer.date} - Saída: {offer.departureTime}
          </p>
          <p>
            Vagas: {offer.passengers.length}/{offer.capacity}
          </p>
          <div className={`flex-center rounded-[20px] px-4 text-white ${status.bg}`}>
            <p>{status.label}</p>
          </div>
        </div>

        <Link to={`/users/${offer.owner.id}`} className="flex-center w-25 flex-col gap-1.25">
          <ProfilePicture url={offer.owner.pictureUrl} size="lg" />
          <p className="text-center">{offer.owner.name}</p>
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

      <section className="flex-column w-full gap-2.5">
        <h3>Descrição</h3>

        <div className="flex-column w-full gap-2.5 rounded-2xl bg-white px-6 py-4">
          <p className="text-pretty">{offer.description}</p>
        </div>
      </section>

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

      {isOwner && (
        <section className="flex-column w-full gap-2.5">
          <h3>Solicitações</h3>

          <div className="flex-column w-full gap-2.5 rounded-2xl bg-white px-6 py-4">
            <p className="text-center text-neutral-dark">Nenhuma solicitação até o momento</p>
          </div>
        </section>
      )}

      {buttonLabel && (
        <button className="btn btn-lg mt-auto bg-primary">
          {buttonLabel}
          <Ripples color="var(--ripple-light)" />
        </button>
      )}
      <DeleteModal
        open={deleteOpen}
        title="Excluir Oferta"
        message={`Tem certeza que deseja excluir essa oferta?`}
        isLoading={isPending}
        onConfirm={() => deleteOffer(offer.id)}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  );
}
