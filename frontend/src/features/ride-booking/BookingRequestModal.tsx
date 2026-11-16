import * as Dialog from "@radix-ui/react-dialog";
import OfferCard from "@ride-offer/OfferCard";
import { getMyOffers } from "@ride-offer/offerService";
import RetryError from "@shared/components/RetryError";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CirclePlus, LoaderCircle } from "lucide-react";
import { ensureCompatible, type CreateRideBookingForRequestDto } from "./bookingTypes";
import type { RideRequest } from "@ride-request/requestTypes";
import { createForRequest } from "./bookingService";
import { useNavigate } from "react-router";

type BookingRequestModalProps = {
  open: boolean;
  onClose: () => void;
  request: RideRequest;
};

export default function BookingRequestModal({ open, onClose, request }: BookingRequestModalProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: myOffers = [],
    isLoading,
    isFetching,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["ride-offers", "my-offers"],
    queryFn: () => getMyOffers("OPEN"),
    select: (data) => data.filter((offer) => ensureCompatible(offer, request)),
    enabled: open,
  });

  const { mutate: createBooking, isPending } = useMutation({
    mutationFn: (data: CreateRideBookingForRequestDto) => createForRequest(request.id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ride-requests", Number(request.id), "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["ride-offers", Number(variables.rideOfferId), "bookings"] });
      navigate(`/offers/${variables.rideOfferId}`);
      onClose();
    },
  });

  const handleCreateOffer = () => {
    const params = new URLSearchParams({
      request_id: String(request.id),
      origin: request.origin,
      destination: request.destination,
      start: request.desiredDepartureStart,
      end: request.desiredDepartureEnd,
    });
    navigate(`/offers/create?${params.toString()}`);
  };

  return (
    <Dialog.Root open={open} onOpenChange={(open) => !open && !isPending && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-overlay" />
        <Dialog.Content className="modal-content">
          <h3 className="text-center">Ofertar Carona</h3>

          <button
            onClick={handleCreateOffer}
            disabled={isPending}
            className="btn btn-sm bg-neutral-light text-slate-900"
          >
            <CirclePlus />
            Cadastrar Nova Oferta
          </button>

          <div className="flex-center w-full gap-2.5">
            <div className="h-px w-full bg-neutral-dark" />
            <p className="text-neutral-dark">ou</p>
            <div className="h-px w-full bg-neutral-dark" />
          </div>

          {isLoading ? (
            <div className="flex-center flex-1">
              <LoaderCircle className="animate-spin text-primary" size={40} />
            </div>
          ) : isError ? (
            <RetryError onRetry={refetch} isFetching={isFetching} />
          ) : (
            <div className="grid w-full grid-cols-1 gap-3.5">
              {myOffers.length === 0 ? (
                <p className="text-center text-pretty text-neutral-dark">
                  Nenhuma oferta sua é compatível com o pedido. Utilize o botão acima para criar uma nova
                </p>
              ) : (
                myOffers.map((offer) => (
                  <OfferCard
                    key={offer.id}
                    offer={offer}
                    onSelect={(o) => createBooking({ rideOfferId: o.id })}
                    disabled={isPending}
                  />
                ))
              )}
            </div>
          )}

          <div className="flex w-full justify-end">
            <Dialog.Close asChild>
              <button className="btn w-fit text-neutral-dark" disabled={isPending}>
                Cancelar
              </button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
