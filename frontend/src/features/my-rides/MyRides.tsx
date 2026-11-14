import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";
import { getMyBookings } from "@ride-booking/bookingService";
import OfferCard from "@ride-offer/OfferCard";
import { getMyOffers } from "@ride-offer/offerService";
import RequestCard from "@ride-request/RequestCard";
import { getMyRequests } from "@ride-request/requestService";
import RetryError from "@shared/components/RetryError";
import { useQuery } from "@tanstack/react-query";
import { CircleCheck, LoaderCircle, RotateCcwClock } from "lucide-react";

export default function MyRides() {
  const {
    data: myOffers = [],
    isLoading: isLoadingMyOffers,
    isFetching: isFetchingMyOffers,
    refetch: refetchMyOffers,
    isError: isErrorMyOffers,
  } = useQuery({
    queryKey: ["ride-offers", "my-offers"],
    queryFn: () => getMyOffers("OPEN"),
  });

  const {
    data: myRequests = [],
    isLoading: isLoadingMyRequests,
    isFetching: isFetchingMyRequests,
    refetch: refetchMyRequests,
    isError: isErrorMyRequests,
  } = useQuery({
    queryKey: ["ride-requests", "my-requests"],
    queryFn: () => getMyRequests("OPEN"),
  });

  const {
    data: myBookings = [],
    isLoading: isLoadingMyBookings,
    isFetching: isFetchingMyBookings,
    refetch: refetchMyBookings,
    isError: isErrorMyBookings,
  } = useQuery({
    queryKey: ["ride-bookings", "my-bookings"],
    queryFn: () => getMyBookings("OPEN"),
  });
  const acceptedBookings = myBookings.filter((b) => b.status === "ACCEPTED");
  const pendingBookings = myBookings.filter((b) => b.status === "PENDING");

  return (
    <>
      <h2>Minhas Caronas</h2>
      <title>Minhas Caronas</title>

      <TabGroup className="flex-1">
        <TabList className="flex h-10.5 overflow-hidden rounded-full border border-primary bg-white">
          <Tab
            key={"driver"}
            className="flex-1 cursor-pointer rounded-l-full text-label text-primary transition-colors outline-none data-selected:bg-primary data-selected:text-white"
          >
            Motorista
          </Tab>
          <Tab
            key={"passenger"}
            className="flex-1 cursor-pointer rounded-r-full text-label text-primary transition-colors outline-none data-selected:bg-primary data-selected:text-white"
          >
            Passageiro
          </Tab>
        </TabList>

        <TabPanels className="mt-6">
          <TabPanel key={"driver"}>
            {isErrorMyOffers ? (
              <RetryError onRetry={refetchMyOffers} isFetching={isFetchingMyOffers} />
            ) : isLoadingMyOffers ? (
              <div className="flex-center flex-1">
                <LoaderCircle className="animate-spin text-primary" size={40} />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-7.5 md:grid-cols-2">
                {myOffers.length === 0 ? (
                  <p className="text-pretty text-neutral-dark md:col-span-2">Não encontramos nenhuma oferta sua.</p>
                ) : (
                  myOffers.map((offer) => <OfferCard key={offer.id} offer={offer} />)
                )}
              </div>
            )}
          </TabPanel>

          <TabPanel key={"passenger"} className="flex flex-col gap-6">
            <section>
              <div className="mb-3 flex items-center gap-2">
                <CircleCheck className="text-primary" />
                <h3>Confirmadas</h3>
              </div>
              {isErrorMyBookings ? (
                <RetryError onRetry={refetchMyBookings} isFetching={isFetchingMyBookings} />
              ) : isLoadingMyBookings ? (
                <div className="flex-center flex-1">
                  <LoaderCircle className="animate-spin text-primary" size={40} />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-7.5 md:grid-cols-2">
                  {acceptedBookings.length === 0 ? (
                    <p className="text-pretty text-neutral-dark md:col-span-2">
                      Não encontramos nenhuma oferta confirmada sua.
                    </p>
                  ) : (
                    acceptedBookings.map((booking) => <OfferCard key={booking.id} offer={booking.rideOffer} style="ACCEPTED" />)
                  )}
                </div>
              )}
            </section>

            <section>
              <div className="mb-3 flex items-center gap-2">
                <RotateCcwClock className="text-pending" />
                <h3>Pendentes</h3>
              </div>
              {isErrorMyRequests ? (
                <RetryError onRetry={refetchMyRequests} isFetching={isFetchingMyRequests} />
              ) : isLoadingMyRequests ? (
                <div className="flex-center flex-1">
                  <LoaderCircle className="animate-spin text-primary" size={40} />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-7.5 md:grid-cols-2">
                  {pendingBookings.length === 0 && myRequests.length === 0 ? (
                    <p className="text-pretty text-neutral-dark md:col-span-2">Não encontramos nenhum pedido seu.</p>
                  ) : (
                    <>
                      {pendingBookings.map((booking) => (
                        <OfferCard key={booking.id} offer={booking.rideOffer} style="PENDING"/>
                      ))}
                      {myRequests.map((request) => (
                        <RequestCard key={request.id} request={request} />
                      ))}
                    </>
                  )}
                </div>
              )}
            </section>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </>
  );
}
