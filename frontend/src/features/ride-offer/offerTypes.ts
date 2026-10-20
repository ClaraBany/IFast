import { validateDateRange, validateOriginDestination } from "@shared/types/filter";
import { Neighborhoods } from "@shared/types/neighborhoods";
import { type UserSummary } from "@user/userTypes";
import type { VehicleOptionalId } from "@vehicle/vehicleTypes";
import z from "zod";

export const RideOfferStatus = {
  AVAILABLE: "AVAILABLE",
  FULL: "FULL",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
} as const;

export type RideOfferStatus = (typeof RideOfferStatus)[keyof typeof RideOfferStatus];

export const rideOfferStatusDisplay: Record<RideOfferStatus, { border: string; bg: string; label: string }> = {
  AVAILABLE: {
    border: "border-primary",
    bg: "bg-primary",
    label: "Disponível",
  },
  FULL: {
    border: "border-danger",
    bg: "bg-danger",
    label: "Lotada",
  },
  CANCELLED: {
    border: "border-danger",
    bg: "bg-danger",
    label: "Cancelada",
  },
  COMPLETED: {
    border: "border-secondary",
    bg: "bg-secondary",
    label: "Concluída",
  },
};

export interface RideOffer {
  id: number;
  status: RideOfferStatus;

  driver: UserSummary;

  origin: Neighborhoods;
  destination: Neighborhoods;

  departureDateTime: string;

  vehicle: VehicleOptionalId;
  seatsCapacity: number;
  seatsTaken: number;

  description: string | null;
}

export type RideOfferSummary = Omit<RideOffer, "vehicle" | "description">;

export interface CreateRideOffer {
  origin: Neighborhoods;
  destination: Neighborhoods;
  isRoundTrip: boolean;

  departureDateTime: string;
  returnDateTime: string | null;

  vehicle: VehicleOptionalId;
  seatsCapacity: number;

  description: string | null;
}

export const rideOfferSchema = z
  .object({
    origin: z.enum(Neighborhoods, { message: "Escolha uma origem válida" }),
    destination: z.enum(Neighborhoods, { message: "Escolha um destino válido" }),

    isRoundTrip: z.boolean().default(false),

    date: z.iso.date("Informe a data da carona"),
    departureTime: z.iso.time({ precision: -1, error: "Informe a hora de saída" }),
    returnTime: z.iso.time({ precision: -1, error: "Informe um horário válido" }).or(z.literal("")).optional(),

    vehicleId: z.string().optional(),
    plate: z.string().optional(),
    model: z.string().trim().min(1, "O modelo é obrigatório").max(50, "O modelo deve ter no máximo 50 caracteres"),
    color: z.string().trim().min(1, "A cor é obrigatória").max(30, "A cor deve ter no máximo 30 caracteres"),

    seatsCapacity: z
      .number("Informe o número de vagas")
      .int("Use um número inteiro")
      .min(1, "Mínimo de 1 vaga")
      .max(4, "Máximo de 4 vagas"),

    description: z.string().trim().max(500, "Máximo de 500 caracteres").optional(),
  })
  .superRefine((data, ctx) => {
    validateOriginDestination(data, ctx);
    validateDateRange(data.date, ctx);

    if (data.date && data.departureTime && new Date(`${data.date}T${data.departureTime}`) < new Date()) {
      ctx.addIssue({
        code: "custom",
        path: ["departureTime"],
        message: "O horário de saída não pode ser anterior ao horário atual",
      });
    }

    if (data.isRoundTrip) {
      if (!data.returnTime) {
        ctx.addIssue({
          code: "custom",
          path: ["returnTime"],
          message: "Informe a hora de volta",
        });
      } else if (data.departureTime && data.returnTime <= data.departureTime) {
        ctx.addIssue({
          code: "custom",
          path: ["returnTime"],
          message: "A volta deve ser depois da saída",
        });
      }
    }
  });

export function offerToForm(offer: RideOffer): z.input<typeof rideOfferSchema> {
  const [date, time] = offer.departureDateTime.split("T");

  return {
    origin: offer.origin,
    destination: offer.destination,
    isRoundTrip: false,

    date: date,
    departureTime: time.slice(0, 5),
    returnTime: "",

    vehicleId: undefined,
    plate: offer.vehicle.plate ?? "",
    model: offer.vehicle.model,
    color: offer.vehicle.color,

    seatsCapacity: offer.seatsCapacity,
    description: offer.description ?? "",
  };
}
