import z from "zod";

export const Neighborhoods: Record<string, string> = {
  IFNMG: "IFNMG",

  CIDADE_NOVA: "Cidade Nova",
  CIDADE_VERDE: "Cidade Verde",
  CIDADE_JARDIM: "Cidade Jardim",
  SAO_PEDRO: "São Pedro",
  SANTO_ANTONIO: "Santo Antônio",
  CENTRO: "Centro",
  PLANALTO: "Planalto",
  RESIDENCIAL_LARANJEIRAS: "Residencial Laranjeiras",
  PARQUE_SAO_JOAO: "Parque São João",
  SAO_JUDAS_TADEU: "São Judas Tadeu",
  DARWIN_CORDEIRO: "Darwin Cordeiro",
  TERESA_CRISTINA: "Teresa Cristina",
  JARDIM_PARAISO: "Jardim Paraíso",
  MONTE_DAS_OLIVEIRAS: "Monte das Oliveiras",
  PEDRO_GOMES: "Pedro Gomes",
  SAO_FRANCISCO: "São Francisco",
  PANORAMICO: "Panorâmico",
};

export function getNeighborhoodKey(label: string): string | undefined {
  return Object.entries(Neighborhoods).find(([, value]) => value === label)?.[0];
}

export function getNeighborhoodLabel(key: string | null): string | null {
  if (!key) return null;
  return Neighborhoods[key] ?? null;
}

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
  address: z
    .enum(Object.values(Neighborhoods), { message: "Selecione um bairro da lista" })
    .refine((val) => val !== "IFNMG", { message: "IFNMG não é um endereço válido" })
    .or(z.literal(""))
    .optional(),
});

export interface User {
  id: number;
  name: string;
  email: string;
  pictureUrl: string;
  phoneNumber: string | null;
  address: string | null;
}

export interface ProfileResponse {
  user: User;

  ridesAsDriverCount: number;
  ridesAsPassengerCount: number;
}
