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

export function getCounterpart(label: string, userAddress?: string | null): string | null {
  if (!Object.values(Neighborhoods).includes(label)) return null;

  if (label !== Neighborhoods.IFNMG) return Neighborhoods.IFNMG;

  return userAddress ?? "";
}

export const NeighborhoodsTest = {
  IFNMG: "IFNMG",

  CIDADE_NOVA: "CIDADE_NOVA",
  CIDADE_VERDE: "CIDADE_VERDE",
  CIDADE_JARDIM: "CIDADE_JARDIM",
  SAO_PEDRO: "SAO_PEDRO",
  SANTO_ANTONIO: "SANTO_ANTONIO",
  CENTRO: "CENTRO",
  PLANALTO: "PLANALTO",
  RESIDENCIAL_LARANJEIRAS: "RESIDENCIAL_LARANJEIRAS",
  PARQUE_SAO_JOAO: "PARQUE_SAO_JOAO",
  SAO_JUDAS_TADEU: "SAO_JUDAS_TADEU",
  DARWIN_CORDEIRO: "DARWIN_CORDEIRO",
  TERESA_CRISTINA: "TERESA_CRISTINA",
  JARDIM_PARAISO: "JARDIM_PARAISO",
  MONTE_DAS_OLIVEIRAS: "MONTE_DAS_OLIVEIRAS",
  PEDRO_GOMES: "PEDRO_GOMES",
  SAO_FRANCISCO: "SAO_FRANCISCO",
  PANORAMICO: "PANORAMICO",
} as const;

export type NeighborhoodsTest = (typeof NeighborhoodsTest)[keyof typeof NeighborhoodsTest];

export const neighborhoodsTestLabels: Record<NeighborhoodsTest, string> = {
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
    .enum(NeighborhoodsTest, { message: "Selecione um bairro da lista" })
    .exclude([NeighborhoodsTest.IFNMG])
    .nullable(),
});

export interface User {
  id: number;
  name: string;
  email: string;
  pictureUrl: string;
  phoneNumber: string | null;
  address?: NeighborhoodsTest;
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
