import z from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(10, "Nome precisa conter pelo menos 10 caracteres"),
  phoneNumber: z
    .string()
    .regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Telefone inválido")
    .or(z.literal(""))
    .optional(),
  address: z.string().min(10, "O endereço deve ter pelo menos 10 caracteres").or(z.literal("")).optional(),
});

export interface User {
  id: number;
  name: string;
  email: string;
  pictureUrl: string;
  phoneNumber: string;
  address: string;
}

export interface ProfileResponse {
  user: User;

  ridesAsDriverCount: number;
  ridesAsPassengerCount: number;
}
