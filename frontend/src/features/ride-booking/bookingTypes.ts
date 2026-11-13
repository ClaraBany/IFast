import type { RideOfferSummary } from "@ride-offer/offerTypes";
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
