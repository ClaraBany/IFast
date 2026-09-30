import OfferCard from "./OfferCard";
import { Link } from "react-router";
import { LoaderCircle, Plus, SlidersHorizontal } from "lucide-react";
import RetryError from "@shared/components/RetryError";
import { useQuery } from "@tanstack/react-query";
import { getAll } from "./offerService";
import { Ripples } from "react-ripples-continued";
import { useState } from "react";
import FilterMenu from "@shared/components/FilterMenu";
import { mockOffers } from "./mock";

export default function Offers() {
  const [open, setOpen] = useState(false);

  const {
    data: offers = mockOffers.filter((offer) => offer.status !== "Completed"),
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
        <h2>Caronas Ofertadas</h2>

        <button className="icon-btn bg-white" onClick={() => setOpen(!open)}>
          <SlidersHorizontal size={30} />
          <Ripples color="var(--ripple-dark)" />
        </button>
        <FilterMenu open={open} setOpen={setOpen} />
      </div>

      <div className="mb-16 grid grid-cols-1 gap-7.5 md:grid-cols-2">
        {offers.length === 0 ? (
          <p className="text-pretty text-neutral-dark md:col-span-2">
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
