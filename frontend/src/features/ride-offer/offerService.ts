import { api } from "@shared/api";
import type { RideRequest } from "@ride-request/requestTypes";
import type z from "zod";
import type { CreateRideOffer, RideOffer, rideOfferSchema, RideOfferSummary } from "./offerTypes";
import type { Filter } from "@shared/types/filter";
import type { IdResponse } from "@shared/types/common";

function toCreateRideOffer(form: z.infer<typeof rideOfferSchema>): CreateRideOffer {
  return {
    origin: form.origin,
    destination: form.destination,
    isRoundTrip: form.isRoundTrip,

    departureDateTime: `${form.date}T${form.departureTime}`,
    returnDateTime: form.isRoundTrip && form.returnTime ? `${form.date}T${form.returnTime}` : null,

    vehicle: {
      id: form.vehicleId ? Number(form.vehicleId) : undefined,
      plate: form.vehicleId ? form.plate || null : null,
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

export async function getCompatibleOffers(request: RideRequest): Promise<RideOfferSummary[]> {
  const [date, startTime] = request.startDateTime.split("T");
  const [, endTime] = request.endDateTime.split("T");
  const startMinutes = Number(startTime.slice(0, 2)) * 60 + Number(startTime.slice(3, 5));
  const endMinutes = Number(endTime.slice(0, 2)) * 60 + Number(endTime.slice(3, 5));
  const duration = endMinutes - startMinutes;
  const departureMinutes = [startMinutes + Math.floor(duration / 3), startMinutes + Math.floor((duration * 2) / 3)];
  const drivers = [
    { id: 3, name: "Ana Clara", pictureUrl: "" },
    { id: 4, name: "Pedro Inácio", pictureUrl: "" },
  ];

  return departureMinutes.map((minutes, index) => {
    const hours = Math.floor(minutes / 60)
      .toString()
      .padStart(2, "0");
    const remainingMinutes = (minutes % 60).toString().padStart(2, "0");

    return {
      id: request.id * 100 + index + 1,
      status: "AVAILABLE",
      driver: drivers[index],
      origin: request.origin,
      destination: request.destination,
      departureDateTime: `${date}T${hours}:${remainingMinutes}:00`,
      seatsCapacity: 4,
      seatsTaken: 1,
    };
  });
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
