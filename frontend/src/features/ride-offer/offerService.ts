import { api } from "@shared/api";
import type z from "zod";
import type { CreateRideOffer, Filter, RideOffer, rideOfferSchema, RideOfferSummary } from "./offerTypes";
import type { IdResponse } from "@shared/types";

function toCreateRideOffer(form: z.infer<typeof rideOfferSchema>): CreateRideOffer {
  return {
    origin: form.origin,
    destination: form.destination,
    isRoundTrip: form.isRoundTrip,

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

export async function getAll(filters: Filter): Promise<RideOfferSummary[]> {
  const response = await api.get<RideOfferSummary[]>("/ride-offers", { params: filters });
  return response.data;
}

export async function get(offerId: number): Promise<RideOffer> {
  const response = await api.get<RideOffer>(`/ride-offers/${offerId}`);
  return response.data;
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
