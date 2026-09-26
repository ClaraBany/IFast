import z from "zod";

export const vehicleSchema = z.object({
  model: z.string().min(1, "O modelo é obrigatório").max(50, "O modelo deve ter no máximo 50 caracteres"),

  color: z.string().min(1, "A cor é obrigatória").max(30, "A cor deve ter no máximo 30 caracteres"),

  plate: z
    .union([
      z
        .string()
        .regex(
          /^([A-Z]{3}[0-9]{4}|[A-Z]{3}[0-9][A-Z][0-9]{2})$/,
          "A placa deve seguir o padrão antigo (ABC1234) ou Mercosul (ABC1D23)",
        ),
      z.literal(""),
      z.null(),
    ])
    .optional(),

  capacity: z.number().int().min(1, "Capacidade mínima é 1"),
});

export interface Vehicle {
  id: number;
  model: string;
  color: string;
  plate: string | null;
  capacity: number;
}
