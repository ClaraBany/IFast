import type { Offer } from "./offerTypes";
import OfferCard from "./OfferCard";
import { Link } from "react-router";
import { LoaderCircle, Plus, SlidersHorizontal } from "lucide-react";
import RetryError from "@shared/components/RetryError";
import { useQuery } from "@tanstack/react-query";
import { getAll } from "./offerService";
import { Ripples } from "react-ripples-continued";
import { useState } from "react";
import FilterMenu from "@shared/components/FilterMenu";

const mockOffers: Offer[] = [
  {
    id: 1,
    status: "Available",
    owner: {
      id: 1,
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
  },
  {
    id: 2,
    status: "Completed",
    owner: {
      id: 2,
      name: "Mariana Costa",
      email: "mari.costa@email.com",
      pictureUrl: "https://i.pravatar.cc/150?u=mariana",
      phoneNumber: "+55 21 97777-3333",
      address: "Rua do Catete, 45, Rio de Janeiro - RJ",
    },
    passengers: [
      {
        id: 202,
        name: "João Pedro",
        email: "joao.pedro@email.com",
        pictureUrl: "https://i.pravatar.cc/150?u=joao",
        phoneNumber: "+55 21 96666-4444",
        address: "Copacabana, Rio de Janeiro - RJ",
      },
      {
        id: 203,
        name: "Beatriz Lima",
        email: "bia.lima@email.com",
        pictureUrl: "https://i.pravatar.cc/150?u=beatriz",
        phoneNumber: "+55 21 95555-5555",
        address: "Botafogo, Rio de Janeiro - RJ",
      },
    ],
    vehicle: {
      id: 302,
      model: "Hyundai HB20",
      color: "Branco",
      plate: null,
      capacity: 5,
    },
    capacity: 2,
    origin: "Rio de Janeiro, RJ",
    destination: "IFNMG",
    date: "10/12",
    departureTime: "07:00",
    description: "Viagem concluída. Ocorreu tudo bem no feriado.",
  },
  {
    id: 3,
    status: "Available",
    owner: {
      id: 3,
      name: "Rafael Mendes",
      email: "rafa.mendes@email.com",
      pictureUrl: "https://i.pravatar.cc/150?u=rafael",
      phoneNumber: "+55 41 94444-6666",
      address: "Bairro Batel, Curitiba - PR",
    },
    passengers: [
      {
        id: 202,
        name: "João Pedro",
        email: "joao.pedro@email.com",
        pictureUrl: "https://i.pravatar.cc/150?u=joao",
        phoneNumber: "+55 21 96666-4444",
        address: "Copacabana, Rio de Janeiro - RJ",
      },
      {
        id: 202,
        name: "João Pedro",
        email: "joao.pedro@email.com",
        pictureUrl: "https://i.pravatar.cc/150?u=joao",
        phoneNumber: "+55 21 96666-4444",
        address: "Copacabana, Rio de Janeiro - RJ",
      },
    ],
    vehicle: {
      id: 303,
      model: "Honda Civic",
      color: "Preto",
      plate: "DEF-5678",
      capacity: 5,
    },
    capacity: 2,
    origin: "Curitiba, PR",
    destination: "IFNMG",
    date: "10/12",
    departureTime: "18:00",
    description: "Saindo na sexta à noite. Tenho espaço para malas médias no porta-malas. Dividimos o pedágio.",
  },
];

export default function Offers() {
  const [open, setOpen] = useState(false);

  const {
    data: offers = mockOffers,
    isLoading,
    isFetching,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["offers"],
    queryFn: getAll,
    enabled: false,
  });

  if (isLoading) {
    return (
      <div className="flex-center flex-1">
        <LoaderCircle className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (isError) {
    return <RetryError onRetry={refetch} isFetching={isFetching} />;
  }

  return (
    <>
      <title>Ofertas</title>
      <div className="flex-center w-full justify-between">
        <h2>Ofertas</h2>

        <button className="icon-btn bg-white" onClick={() => setOpen(!open)}>
          <SlidersHorizontal size={30} />
          <Ripples color="var(--ripple-dark)" />
        </button>
        <FilterMenu open={open} setOpen={setOpen} />
      </div>

      <div className="mb-16 grid grid-cols-1 gap-7.5 md:grid-cols-2">
        {offers.length === 0 ? (
          <p className="text-center text-pretty text-neutral-dark">
            Não encontramos nenhuma oferta. Por favor volte mais tarde
          </p>
        ) : (
          offers.map((offer) => <OfferCard key={offer.id} offer={offer} />)
        )}
      </div>

      <Link to={"/offers/create"} className="btn btn-lg fixed right-5 bottom-25 w-fit bg-primary">
        <Plus size={24} />
        Criar Oferta
      </Link>
    </>
  );
}
