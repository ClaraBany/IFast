import { type UserSummary } from "@user/userTypes";
import { Neighborhoods } from "@shared/types/neighborhoods";

import z from "zod";
import { getMaxDate, getMinDate } from "@shared/utils/dateLimits";

export interface RideRequest {
  id: number;
  passenger: UserSummary;
  origin: Neighborhoods;
  destination: Neighborhoods;
  startDateTime: string;
  endDateTime: string;
}

export type CreateRideRequest = Omit<RideRequest, "id" | "passenger">;

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
    } else if (
      data.date === getMinDate() &&
      new Date(`${data.date}T${data.startTime}`) <= new Date()
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["startTime"],
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