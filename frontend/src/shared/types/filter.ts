import z from "zod";
import { Neighborhoods } from "./neighborhoods";
import { MAX_DAYS_AHEAD } from "@shared/constants";
import { getMaxDate, getMinDate } from "@shared/utils/dateLimits";

export const Period = {
  MORNING: "MORNING",
  AFTERNOON: "AFTERNOON",
  EVENING: "EVENING",
} as const;

export type Period = (typeof Period)[keyof typeof Period];

export const periodLabels: Record<Period, string> = {
  MORNING: "Manhã",
  AFTERNOON: "Tarde",
  EVENING: "Noite",
};

export interface Filter {
  period?: Period;
  date?: string;
  origin?: Neighborhoods;
  destination?: Neighborhoods;
}

export const validateOriginDestination = (
  data: { origin?: string | null; destination?: string | null },
  ctx: z.RefinementCtx,
) => {
  if (data.origin && data.origin === data.destination) {
    ctx.addIssue({
      code: "custom",
      path: ["destination"],
      message: "O destino deve ser diferente da origem",
    });
  }
};

export const validateDateRange = (date?: string | null, ctx?: z.RefinementCtx) => {
  if (!date) return;

  if (date < getMinDate()) {
    ctx?.addIssue({
      code: "custom",
      path: ["date"],
      message: "A data não pode ser anterior a hoje",
    });
  } else if (date > getMaxDate()) {
    ctx?.addIssue({
      code: "custom",
      path: ["date"],
      message: `A data não pode ultrapassar ${MAX_DAYS_AHEAD} dias (${getMaxDate().split("-").reverse().join("/")})`,
    });
  }
};

export const filterSchema = z
  .object({
    period: z.enum(Period, "Escolha um período válido").nullish(),

    date: z.iso.date("Informe uma data válida").or(z.literal("")).optional(),

    origin: z.enum(Neighborhoods, { message: "Escolha uma origem válida" }).nullable(),
    destination: z.enum(Neighborhoods, { message: "Escolha um destino válido" }).nullable(),
  })
  .superRefine((data, ctx) => {
    validateOriginDestination(data, ctx);
    validateDateRange(data.date, ctx);
  });
