import type { IdResponse } from "@shared/types/common";
import type { CreateRideRequest, RideRequest, requestSchema } from "./requestTypes";
import type z from "zod";
import type { Filter } from "@shared/types/filter";
import { api } from "@shared/api";
import type { RideOfferSummary } from "@ride-offer/offerTypes";

function toCreateRideRequest(form: z.infer<typeof requestSchema>): CreateRideRequest {
  return {
    origin: form.origin,
    destination: form.destination,
    desiredDepartureStart: `${form.date}T${form.startTime}:00`,
    desiredDepartureEnd: `${form.date}T${form.endTime}:00`,
  };
}

export async function getAll(filters: Filter): Promise<RideRequest[]> {
  const response = await api.get<RideRequest[]>("/ride-requests", { params: filters });
  return response.data;
}

export async function getMatchingOffers(requestId: number): Promise<RideOfferSummary[]> {
  const response = await api.get<RideOfferSummary[]>(`/ride-requests/${requestId}/matching-offers`);
  return response.data;
}

export async function get(requestId: number): Promise<RideRequest> {
  const response = await api.get<RideRequest>(`/ride-requests/${requestId}`);
  return response.data;
}

export async function create(form: z.infer<typeof requestSchema>): Promise<IdResponse> {
  const response = await api.post<IdResponse>("/ride-requests", toCreateRideRequest(form));
  return response.data;
}

export async function update(requestId: number, form: z.infer<typeof requestSchema>): Promise<IdResponse> {
  const response = await api.put<IdResponse>(`/ride-requests/${requestId}`, toCreateRideRequest(form));
  return response.data;
}

export async function cancel(requestId: number): Promise<void> {
  await api.patch<void>(`/ride-requests/${requestId}/cancel`);
}