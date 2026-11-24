import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";
import { getMyBookings } from "@ride-booking/bookingService";
import OfferCard from "@ride-offer/OfferCard";
import { getMyOffers } from "@ride-offer/offerService";
import RequestCard from "@ride-request/RequestCard";
import { getMyRequests } from "@ride-request/requestService";
import RetryError from "@shared/components/RetryError";
import { useQuery } from "@tanstack/react-query";
import { BellRing, CircleCheck, LoaderCircle, RotateCcwClock } from "lucide-react";
import { useSearchParams } from "react-router";

export default function MyRides() {
  const TABS = ["driver", "passenger"] as const;
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedIndex = Math.max(0, TABS.indexOf(searchParams.get("tab") as (typeof TABS)[number]));

  function handleTabChange(index: number) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.set("tab", TABS[index]);
        return next;
      },
      { replace: true },
    );
  }

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
  const pendingBookings = myBookings.filter((b) => b.status === "PENDING" && b.initiatedBy === "PASSENGER");

  const offersNeedingAction = myOffers.filter((o) => o.pendingBookingsCount > 0 && o.status === "AVAILABLE");
  const otherOffers = myOffers.filter((o) => o.pendingBookingsCount === 0 || o.status === "FULL");
  const requestsNeedingAction = myRequests.filter((r) => r.pendingBookingsCount > 0);
  const searchingRequests = myRequests.filter((r) => r.pendingBookingsCount === 0);

  return (
    <>
      <h2>Minhas Caronas</h2>
      <title>Minhas Caronas</title>

      <TabGroup className="flex-1" selectedIndex={selectedIndex} onChange={handleTabChange}>
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
          <TabPanel key={"driver"} className="flex flex-col gap-6">
            {isErrorMyOffers ? (
              <RetryError onRetry={refetchMyOffers} isFetching={isFetchingMyOffers} />
            ) : isLoadingMyOffers ? (
              <div className="flex-center flex-1">
                <LoaderCircle className="animate-spin text-primary" size={40} />
              </div>
            ) : (
              <>
                {myOffers.length === 0 ? (
                  <p className="text-pretty text-neutral-dark md:col-span-2">Não encontramos nenhuma oferta sua.</p>
                ) : (
                  <>
                    {offersNeedingAction.length > 0 && (
                      <section>
                        <div className="mb-3 flex items-center gap-2">
                          <BellRing className="text-primary" />
                          <h3>Ação Necessária</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-7.5 md:grid-cols-2">
                          {offersNeedingAction.map((offer) => (
                            <OfferCard key={offer.id} offer={offer} />
                          ))}
                        </div>
                      </section>
                    )}

                    {otherOffers.length > 0 && (
                      <section>
                        {offersNeedingAction.length > 0 && (
                          <div className="mb-3 flex items-center gap-2">
                            <CircleCheck className="text-primary" />
                            <h3>Confirmadas</h3>
                          </div>
                        )}
                        <div className="grid grid-cols-1 gap-7.5 md:grid-cols-2">
                          {otherOffers.map((offer) => (
                            <OfferCard key={offer.id} offer={offer} />
                          ))}
                        </div>
                      </section>
                    )}
                  </>
                )}
              </>
            )}
          </TabPanel>

          <TabPanel key={"passenger"} className="flex flex-col gap-6">
            {isErrorMyBookings || isErrorMyRequests ? (
              <RetryError
                onRetry={() => {
                  if (isErrorMyBookings) refetchMyBookings();
                  if (isErrorMyRequests) refetchMyRequests();
                }}
                isFetching={isFetchingMyBookings || isFetchingMyRequests}
              />
            ) : isLoadingMyBookings || isLoadingMyRequests ? (
              <div className="flex-center flex-1">
                <LoaderCircle className="animate-spin text-primary" size={40} />
              </div>
            ) : (
              <>
                {myBookings.length === 0 && myRequests.length === 0 ? (
                  <p className="text-pretty text-neutral-dark md:col-span-2">Você não possui nenhuma carona como passageiro.</p>
                ) : (
                  <>
                    {requestsNeedingAction.length > 0 && (
                      <section>
                        <div className="mb-3 flex items-center gap-2">
                          <BellRing className="text-tertiary" />
                          <h3>Ação Necessária</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-7.5 md:grid-cols-2">
                          {requestsNeedingAction.map((request) => (
                            <RequestCard key={request.id} request={request} />
                          ))}
                        </div>
                      </section>
                    )}

                    {acceptedBookings.length > 0 && (
                      <section>
                        <div className="mb-3 flex items-center gap-2">
                          <CircleCheck className="text-primary" />
                          <h3>Confirmadas</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-7.5 md:grid-cols-2">
                          {acceptedBookings.map((booking) => (
                            <OfferCard key={booking.id} offer={booking.rideOffer} style="ACCEPTED" />
                          ))}
                        </div>
                      </section>
                    )}

                    {(pendingBookings.length > 0 || searchingRequests.length > 0) && (
                      <section>
                        <div className="mb-3 flex items-center gap-2">
                          <RotateCcwClock className="text-pending" />
                          <h3>Em Espera</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-7.5 md:grid-cols-2">
                          {pendingBookings.map((booking) => (
                            <OfferCard key={booking.id} offer={booking.rideOffer} style="PENDING" />
                          ))}
                          {searchingRequests.map((request) => (
                            <RequestCard key={request.id} request={request} />
                          ))}
                        </div>
                      </section>
                    )}
                  </>
                )}
              </>
            )}
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </>
  );
}
