import { PageHeader } from "@shared/components/PageHeader";
import { displayStatusMap, type Offer } from "./offerTypes";
import { useAuthStore } from "@auth/authStore";
import { Link } from "react-router";
import { SquarePen, Trash2 } from "lucide-react";
import { Ripples } from "react-ripples-continued";
import ProfilePicture from "@shared/components/ProfilePicture";

const offer: Offer = {
  id: 1,
  status: "Available",
  owner: {
    id: 101,
    name: "Carlos Silva",
    email: "carlos.silva@email.com",
    pictureUrl: "https://i.pravatar.cc/150?u=carlos",
    phoneNumber: "+55 11 99999-1111",
    address: "Rua das Flores, 123, São Paulo - SP",
  },
  passengers: [
    {
      id: 201,
      name: "Ana Souza",
      email: "ana.souza@email.com",
      pictureUrl: "https://i.pravatar.cc/150?u=ana",
      phoneNumber: "+55 11 98888-2222",
      address: "Av. Paulista, 1000, São Paulo - SP",
    },
    {
      id: 201,
      name: "Ana Souza",
      email: "ana.souza@email.com",
      pictureUrl: "https://i.pravatar.cc/150?u=ana",
      phoneNumber: "+55 11 98888-2222",
      address: "Av. Paulista, 1000, São Paulo - SP",
    },
    {
      id: 201,
      name: "Ana Souza",
      email: "ana.souza@email.com",
      pictureUrl: "https://i.pravatar.cc/150?u=ana",
      phoneNumber: "+55 11 98888-2222",
      address: "Av. Paulista, 1000, São Paulo - SP",
    },
    {
      id: 201,
      name: "Ana Souza",
      email: "ana.souza@email.com",
      pictureUrl: "https://i.pravatar.cc/150?u=ana",
      phoneNumber: "+55 11 98888-2222",
      address: "Av. Paulista, 1000, São Paulo - SP",
    },
    {
      id: 201,
      name: "Ana Souza",
      email: "ana.souza@email.com",
      pictureUrl: "https://i.pravatar.cc/150?u=ana",
      phoneNumber: "+55 11 98888-2222",
      address: "Av. Paulista, 1000, São Paulo - SP",
    },
  ],
  vehicle: {
    id: 301,
    model: "Chevrolet Onix",
    color: "Prata",
    plate: "ABC-1234",
    capacity: 5,
  },
  capacity: 3,
  origin: "São Paulo, SP",
  destination: "IFNMG",
  date: "10/12",
  departureTime: "08:30",
  description: "Vou a trabalho para Campinas. Posso parar no trevo de Jundiaí se necessário. Ar condicionado ligado.",
};

export default function OfferDetails() {
  const user = useAuthStore((state) => state.user);

  const isOwner = offer.owner.id === user?.id;

  const isFull = offer.passengers.length >= offer.capacity;

  const statusMessage = offer.status === "Completed" ? "Concluída" : isFull ? "Lotada" : "Disponível";

  const style = displayStatusMap[offer.status === "Completed" ? "Completed" : isFull ? "Full" : "Available"];
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

            <Link to={`/offers/${offer.id}`} className="icon-btn">
              <Trash2 className="text-danger" size={24} />
              <Ripples color="var(--ripple-dark)" />
            </Link>
          </>
        )}
      </PageHeader>

      <h3 className="text-center">
        {offer.origin} -{">"} {offer.destination}
      </h3>

      <section className="card-container border-0">
        <div className="flex flex-1 flex-col items-start gap-2.5">
          <p>Segunda | {offer.date}</p> {/* TODO: Converter data que recebe em dia da semana */}
          <p>
            {offer.date} - Saída: {offer.departureTime}
          </p>
          <p>
            Vagas: {offer.passengers.length}/{offer.capacity}
          </p>
          <div className={`flex-center rounded-[20px] px-4 text-white ${style.bg}`}>
            <p>{statusMessage}</p>
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
          <div className="flex-center justify-between">
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
          <p>{offer.description}</p>
        </div>
      </section>

      <section className="flex-column w-full gap-2.5">
        <h3>Passageiros</h3>

        <div className="w-full overflow-x-auto rounded-2xl bg-white">
          <div className="flex-center w-max min-w-full gap-5 px-6 py-4">
            {offer.passengers.map((passenger) => (
              <Link
                key={passenger.id}
                to={`/users/${passenger.id}`}
                className="flex-center w-25 shrink-0 flex-col gap-1.25"
              >
                <ProfilePicture url={passenger.pictureUrl} size="lg" />
                <p className="text-center">{passenger.name}</p>
              </Link>
            ))}
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

      {offer.status !== "Completed" && (
        <button className="btn btn-lg mt-auto bg-primary">
          {isOwner ? "Concluir Viagem" : "Solicitar vaga"}
          <Ripples color="var(--ripple-light)" />
        </button>
      )}
    </>
  );
}
