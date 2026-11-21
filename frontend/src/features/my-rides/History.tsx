import { LoaderCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@shared/components/navigation/PageHeader";
import OfferCard from "@ride-offer/OfferCard";
import { getMyOffers } from "@ride-offer/offerService";
import { getMyBookings } from "@ride-booking/bookingService";
import { useMemo } from "react";

export default function History() {
  const { data: offers = [], isLoading: isLoadingMyOffers } = useQuery({
    queryKey: ["ride-offers", "CLOSED"],
    queryFn: () => getMyOffers("CLOSED"),
  });

  const { data: myBookings = [], isLoading: isLoadingMyBookings } = useQuery({
    queryKey: ["ride-bookings", "CLOSED"],
    queryFn: () => getMyBookings("CLOSED"),
  });

  const history = useMemo(
    () =>
      [...offers, ...myBookings.map((booking) => booking.rideOffer)].sort(
        (a, b) => new Date(b.departureDateTime).getTime() - new Date(a.departureDateTime).getTime(),
      ),
    [offers, myBookings],
  );

  if (isLoadingMyOffers || isLoadingMyBookings) {
    return (
      <div className="flex-center flex-1">
        <LoaderCircle className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <>
      <title>Histórico de Caronas</title>
      <PageHeader title="Histórico de Caronas" />

      <div className="grid grid-cols-1 gap-7.5 md:grid-cols-2">
        {history.length === 0 ? (
          <p className="text-pretty text-neutral-dark md:col-span-2">
            Você ainda não tem ofertas concluídas. Quando tiver, elas serão exibidas nesta página.
          </p>
        ) : (
          history.map((offer) => <OfferCard key={offer.id} offer={offer} />)
        )}
      </div>
    </>
  );
}
