import { api } from "@shared/api";
import type { CreateRideBookingForRequestDto, RideBooking, RideBookingStatus } from "./bookingTypes";
import type { IdResponse, RideListStatus } from "@shared/types/common";

export async function getMyBookings(status: RideListStatus): Promise<RideBooking[]> {
  const response = await api.get<RideBooking[]>("/bookings/my-bookings", { params: { status } });
  return response.data;
}

export async function getByOffer(offerId: number, status?: RideBookingStatus): Promise<RideBooking[]> {
  const response = await api.get<RideBooking[]>(`/ride-offers/${offerId}/bookings`, { params: { status } });
  return response.data;
}

export async function getByRequest(requestId: number, status?: RideBookingStatus): Promise<RideBooking[]> {
  const response = await api.get<RideBooking[]>(`/ride-requests/${requestId}/bookings`, { params: { status } });
  return response.data;
}

export async function createForOffer(offerId: number): Promise<IdResponse> {
  const response = await api.post<IdResponse>(`/ride-offers/${offerId}/bookings`);
  return response.data;
}

export async function createForRequest(
  requestId: number,
  booking: CreateRideBookingForRequestDto,
): Promise<IdResponse> {
  const response = await api.post<IdResponse>(`/ride-requests/${requestId}/bookings`, booking);
  return response.data;
}

export async function accept(bookingId: number): Promise<void> {
  await api.patch<void>(`/bookings/${bookingId}/accept`);
}

export async function reject(bookingId: number): Promise<void> {
  await api.patch<void>(`/bookings/${bookingId}/reject`);
}

export async function cancel(bookingId: number): Promise<void> {
  await api.patch<void>(`/bookings/${bookingId}/cancel`);
}
