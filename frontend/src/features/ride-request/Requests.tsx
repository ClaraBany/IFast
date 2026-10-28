import { useState } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle, Plus, SlidersHorizontal } from "lucide-react";
import { Ripples } from "react-ripples-continued";
import RetryError from "@shared/components/RetryError";
import { useFilters } from "@shared/hooks/useFilter";
import RequestCard from "./RequestCard";
import { getAll } from "./requestService";
import FilterMenu from "@shared/components/filter/FilterMenu";
import ActiveFilters from "@shared/components/filter/ActiveFilters";

export default function Requests() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { filters, hasFilters } = useFilters();

  const {
    data: requests = [],
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["ride-requests", filters],
    queryFn: () => getAll(filters),
  });

  if (isError) {
    return <RetryError onRetry={refetch} isFetching={isFetching} />;
  }

  return (
    <>
      <title>Pedidos de carona</title>

      <div className="flex-center w-full justify-between">
        <h2>Pedidos de carona</h2>
        <button
          type="button"
          aria-label="Abrir filtros"
          className="icon-btn bg-white"
          onClick={() => setFiltersOpen((open) => !open)}
        >
          <SlidersHorizontal size={30} />
          <Ripples color="var(--ripple-dark)" />
        </button>
        <FilterMenu open={filtersOpen} setOpen={setFiltersOpen} />
      </div>

      <ActiveFilters />

      {isLoading ? (
        <div className="flex-center flex-1">
          <LoaderCircle className="animate-spin text-primary" size={40} />
        </div>
      ) : (
        <div className="mb-16 grid grid-cols-1 gap-3.5 md:grid-cols-2">
          {requests.length === 0 ? (
            <p className="text-pretty text-neutral-dark md:col-span-2">
              Não encontramos nenhum pedido. {hasFilters ? "Tente remover os filtros" : "Volte mais tarde"}
            </p>
          ) : (
            requests.map((request) => <RequestCard key={request.id} request={request} />)
          )}
        </div>
      )}

      <Link to="/request/create" className="btn btn-lg fixed right-5 bottom-21 w-fit bg-primary">
        <Plus size={24} />
        Pedir Carona
      </Link>
    </>
  );
}
