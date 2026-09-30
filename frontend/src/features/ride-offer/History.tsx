import OfferCard from "./OfferCard";
import { LoaderCircle } from "lucide-react";
import RetryError from "@shared/components/RetryError";
import { useQuery } from "@tanstack/react-query";
import { getAll } from "./offerService";
import { PageHeader } from "@shared/components/PageHeader";
import { mockOffers } from "./mock";

export default function History() {
  const {
    data: offers = mockOffers.filter((offer) => offer.status === "Completed"),
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
      <title>Histórico de Caronas</title>
      <PageHeader title="Histórico de Caronas" />

      <div className="grid grid-cols-1 gap-7.5 md:grid-cols-2">
        {offers.length === 0 ? (
          <p className="text-pretty text-neutral-dark md:col-span-2">
            Você ainda não tem ofertas concluídas. Quando tiver, elas serão exibidas nesta página.
          </p>
        ) : (
          offers.map((offer) => <OfferCard key={offer.id} offer={offer} />)
        )}
      </div>
    </>
  );
}
