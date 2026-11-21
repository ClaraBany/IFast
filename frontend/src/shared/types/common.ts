export interface IdResponse {
  id: number;
}

export const RideListStatus = {
  OPEN: "OPEN",
  CLOSED: "CLOSED",
} as const;

export type RideListStatus = (typeof RideListStatus)[keyof typeof RideListStatus];
