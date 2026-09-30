import { Neighborhoods, type User } from "@user/userTypes";
import type { Vehicle } from "@vehicle/vehicleTypes";
import z from "zod";

export interface Offer {
  id: number;
  status: "Available" | "Completed";

  owner: User;
  passengers: User[];

  vehicle: Vehicle;
  capacity: number;

  origin: string;
  destination: string;

  date: string;
  departureTime: string;

  description: string;
}

export const displayStatusMap = {
  Available: {
    border: "border-primary",
    bg: "bg-primary",
    label: "Disponível",
  },
  Full: {
    border: "border-danger",
    bg: "bg-danger",
    label: "Lotada",
  },
  Completed: {
    border: "border-secondary",
    bg: "bg-secondary",
    label: "Concluída",
  },
};

export const offerSchema = z
  .object({
    origin: z.enum(Neighborhoods, "Escolha uma origem válida"),
    destination: z.enum(Neighborhoods, "Escolha um destino válido"),

    isRoundTrip: z.boolean(),

    date: z.iso.date("Informe a data da carona"),
    departureTime: z.iso.time({ precision: -1, error: "Informe a hora de saída" }),
    returnTime: z.iso.time({ precision: -1, error: "Informe um horário válido" }).or(z.literal("")).optional(),

    vehicleId: z.string().optional(),
    model: z.string().trim().optional(),
    color: z.string().trim().optional(),

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

    const today = new Date().toLocaleDateString("sv-SE");
    if (data.date && data.date < today) {
      ctx.addIssue({
        code: "custom",
        path: ["date"],
        message: "A data não pode estar no passado",
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

    if (!data.vehicleId) {
      if (!data.model) {
        ctx.addIssue({ code: "custom", path: ["model"], message: "Informe o modelo" });
      }
      if (!data.color) {
        ctx.addIssue({ code: "custom", path: ["color"], message: "Informe a cor" });
      }
    }
  });
