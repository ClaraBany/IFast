import { Neighborhoods, type User, type UserSummary } from "@user/userTypes";
import type { Vehicle } from "@vehicle/vehicleTypes";
import z from "zod";

export interface VehicleNullableId extends Omit<Vehicle, "id"> {
  id: number | null;
}

export interface RideOffer {
  id: number;
  status: "AVAILABLE" | "FULL" | "CANCELLED" | "COMPLETED";

  owner: User;
  passengers: UserSummary[];

  origin: string;
  destination: string;

  departureDateTime: string;

  vehicle: Vehicle;
  capacity: number;
  seatsTaken: number;

  description: string | null;
}

export interface CreateRideOffer {
  origin: string;
  destination: string;
  isRoundTrip: boolean;

  departureDateTime: string;
  returnDateTime: string | null;

  vehicle: VehicleNullableId;
  capacity: number;

  description: string | null;
}

export const displayStatusMap = {
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

export function getMinDate(): string {
  return new Date().toLocaleDateString("sv-SE");
}

export function getMaxDate(): string {
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 7);
  return maxDate.toLocaleDateString("sv-SE");
}

export const rideOfferSchema = z
  .object({
    origin: z.enum(Neighborhoods, "Escolha uma origem válida"),
    destination: z.enum(Neighborhoods, "Escolha um destino válido"),

    isRoundTrip: z.boolean(),

    date: z.iso.date("Informe a data da carona"),
    departureTime: z.iso.time({ precision: -1, error: "Informe a hora de saída" }),
    returnTime: z.iso.time({ precision: -1, error: "Informe um horário válido" }).or(z.literal("")).optional(),

    vehicleId: z.string().optional(),
    plate: z.string().optional(),
    model: z.string().trim().min(1, "O modelo é obrigatório").max(50, "O modelo deve ter no máximo 50 caracteres"),
    color: z.string().trim().min(1, "A cor é obrigatória").max(30, "A cor deve ter no máximo 30 caracteres"),

    capacity: z
      .number("Informe o número de vagas")
      .int("Use um número inteiro")
      .min(1, "Mínimo de 1 vaga")
      .max(4, "Máximo de 4 vagas"),

    description: z.string().trim().max(500, "Máximo de 500 caracteres").optional(),
  })
  .superRefine((data, ctx) => {
    if (data.origin && data.origin === data.destination) {
      ctx.addIssue({
        code: "custom",
        path: ["destination"],
        message: "O destino deve ser diferente da origem",
      });
    }

    if (data.date) {
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
          message: `A data não pode ultrapassar 1 semana (${getMaxDate().split("-").reverse().join("/")})`,
        });
      }
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
