import { api } from "@shared/api";
import { getNeighborhoodKey, getNeighborhoodLabel } from "@user/userTypes";
import type z from "zod";
import type { CreateRideOffer, RideOffer, rideOfferSchema, RideOfferSummary } from "./offerTypes";
import type { IdResponse } from "@shared/types";

function toCreateRideOffer(form: z.infer<typeof rideOfferSchema>): CreateRideOffer {
  return {
    origin: getNeighborhoodKey(form.origin)!,
    destination: getNeighborhoodKey(form.destination)!,
    roundTrip: form.isRoundTrip,

    departureDateTime: `${form.date}T${form.departureTime}`,
    returnDateTime: form.isRoundTrip && form.returnTime ? `${form.date}T${form.returnTime}` : null,

    vehicle: {
      id: undefined,
      plate: form.plate || null,
      model: form.model,
      color: form.color,
      capacity: form.seatsCapacity,
    },
    seatsCapacity: form.seatsCapacity,

    description: form.description || null,
  };
}

function withNeighborhoodLabel(offer: RideOffer): RideOffer {
  return {
    ...offer,
    origin: getNeighborhoodLabel(offer.origin)!,
    destination: getNeighborhoodLabel(offer.destination)!,
  };
}

export async function getAll(): Promise<RideOfferSummary[]> {
  const response = await api.get<RideOffer[]>("/ride-offers");
  return response.data.map(withNeighborhoodLabel);
}

export async function get(offerId: number): Promise<RideOffer> {
  const response = await api.get<RideOffer>(`/ride-offers/${offerId}`);
  return withNeighborhoodLabel(response.data);
}

export async function create(form: z.infer<typeof rideOfferSchema>): Promise<IdResponse> {
  const response = await api.post<IdResponse>("/ride-offers", toCreateRideOffer(form));
  return response.data;
}

export async function update(offerId: number, form: z.infer<typeof rideOfferSchema>): Promise<IdResponse> {
  const response = await api.put<IdResponse>(`/ride-offers/${offerId}`, toCreateRideOffer(form));
  return response.data;
}

export async function cancel(offerId: number): Promise<void> {
  await api.patch<void>(`/ride-offers/${offerId}/cancel`);
}

export async function complete(offerId: number): Promise<void> {
  await api.patch<void>(`/ride-offers/${offerId}/complete`);
}
