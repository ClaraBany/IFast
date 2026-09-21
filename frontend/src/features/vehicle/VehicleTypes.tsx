import z from "zod";

export const vehicleSchema = z.object({
  model: z.string().min(1, "O modelo é obrigatório").max(50, "O modelo deve ter no máximo 50 caracteres"),
  color: z.string().min(1, "A cor é obrigatória").max(30, "A cor deve ter no máximo 30 caracteres"),
  plate: z.string().length(7, "O campo deve conter 7 caracteres").nullable().or(z.literal("")), // permite campo vazio no form sem quebrar a validação de length
  capacity: z.coerce.number().int().positive().nullable().or(z.literal("")),
});
