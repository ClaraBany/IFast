import type { RideOfferSummary } from "@ride-offer/offerTypes";
import type { RideRequest } from "@ride-request/requestTypes";
import type { UserSummary } from "@user/userTypes";

export const RideBookingStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
} as const;

export type RideBookingStatus = (typeof RideBookingStatus)[keyof typeof RideBookingStatus];

export const InitiatedBy = {
  DRIVER: "DRIVER",
  PASSENGER: "PASSENGER",
} as const;

export type InitiatedBy = (typeof InitiatedBy)[keyof typeof InitiatedBy];

export interface RideBooking {
  id: number;
  status: RideBookingStatus;
  initiatedBy: InitiatedBy;

  rideOffer: RideOfferSummary;
  passenger: UserSummary;
  rideRequestId?: number;
}

export interface CreateRideBookingForRequestDto {
  rideOfferId: number;
}

export function ensureCompatible(offer: RideOfferSummary, request: RideRequest) {
  if (offer.status !== "AVAILABLE") return false;
  if (offer.departureDateTime > request.desiredDepartureEnd || offer.departureDateTime < request.desiredDepartureStart)
    return false;

  return true;
}
