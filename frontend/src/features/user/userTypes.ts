import { Neighborhoods } from "@shared/types/neighborhoods";
import z from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(10, "Nome precisa conter pelo menos 10 caracteres")
    .max(100, "Nome precisa ter menos de 100 caracteres"),
  phoneNumber: z
    .string()
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Telefone inválido")
    .or(z.literal(""))
    .optional(),
  address: z.enum(Neighborhoods, { message: "Selecione um bairro da lista" }).exclude([Neighborhoods.IFNMG]).nullable(),
});

export interface User {
  id: number;
  name: string;
  email: string;
  pictureUrl: string;
  phoneNumber?: string;
  address?: Neighborhoods;
}

export interface UserSummary {
  id: number;
  name: string;
  pictureUrl: string;
}

export interface ProfileResponse {
  user: User;

  ridesAsDriverCount: number;
  ridesAsPassengerCount: number;
}
