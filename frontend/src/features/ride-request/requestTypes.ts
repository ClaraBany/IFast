import { type UserSummary } from "@user/userTypes";
import { Neighborhoods } from "@shared/types/neighborhoods";

import z from "zod";
import { getMaxDate, getMinDate } from "@shared/utils/dateLimits";

export const RideRequestStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  CANCELLED: "CANCELLED",
} as const;

export type RideRequestStatus = (typeof RideRequestStatus)[keyof typeof RideRequestStatus];

export interface RideRequest {
  id: number;
  status: RideRequestStatus;
  requester: UserSummary;
  origin: Neighborhoods;
  destination: Neighborhoods;
  desiredDepartureStart: string;
  desiredDepartureEnd: string;
}

export interface CreateRideRequest {
  origin: Neighborhoods;
  destination: Neighborhoods;
  desiredDepartureStart: string;
  desiredDepartureEnd: string;
}

export const requestSchema = z
  .object({
    origin: z.enum(Neighborhoods, { message: "Escolha uma origem válida" }),
    destination: z.enum(Neighborhoods, { message: "Escolha um destino válido" }),
    date: z.iso.date("Informe uma data válida"),
    startTime: z.iso.time({ precision: -1, error: "Informe o início do horário desejado" }),
    endTime: z.iso.time({ precision: -1, error: "Informe o fim do horário desejado" }),
  })
  .superRefine((data, ctx) => {
    if (data.origin === data.destination) {
      ctx.addIssue({
        code: "custom",
        path: ["destination"],
        message: "O destino deve ser diferente da origem",
      });
    }

    if (data.date < getMinDate()) {
      ctx.addIssue({
        code: "custom",
        path: ["date"],
        message: "A data não pode ser anterior a hoje",
      });
    } else if (data.date > getMaxDate()) {
      ctx.addIssue({
        code: "custom",
        path: ["date"],
        message: "A data não pode ultrapassar uma semana",
      });
    } else if (data.date === getMinDate() && new Date(`${data.date}T${data.endTime}`) <= new Date()) {
      ctx.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "O horário desejado não pode ser anterior ao horário atual",
      });
    }

    if (data.endTime <= data.startTime) {
      ctx.addIssue({
        code: "custom",
        path: ["endTime"],
        message: "O fim do horário deve ser depois do início",
      });
    }
  });
