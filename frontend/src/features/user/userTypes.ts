import z from "zod";

export const Neighborhoods = {
  IFNMG: "IFNMG",

  CENTRO: "CENTRO",
  CIDADE_JARDIM: "CIDADE_JARDIM",
  CIDADE_NOVA: "CIDADE_NOVA",
  CIDADE_VERDE: "CIDADE_VERDE",
  DARWIN_CORDEIRO: "DARWIN_CORDEIRO",
  JARDIM_PARAISO: "JARDIM_PARAISO",
  MONTE_DAS_OLIVEIRAS: "MONTE_DAS_OLIVEIRAS",
  PANORAMICO: "PANORAMICO",
  PARQUE_SAO_JOAO: "PARQUE_SAO_JOAO",
  PEDRO_GOMES: "PEDRO_GOMES",
  PLANALTO: "PLANALTO",
  RESIDENCIAL_LARANJEIRAS: "RESIDENCIAL_LARANJEIRAS",
  SANTO_ANTONIO: "SANTO_ANTONIO",
  SAO_FRANCISCO: "SAO_FRANCISCO",
  SAO_JUDAS_TADEU: "SAO_JUDAS_TADEU",
  SAO_PEDRO: "SAO_PEDRO",
  TERESA_CRISTINA: "TERESA_CRISTINA",
} as const;

export type Neighborhoods = (typeof Neighborhoods)[keyof typeof Neighborhoods];

export const NeighborhoodsLabels: Record<Neighborhoods, string> = {
  IFNMG: "IFNMG",

  CENTRO: "Centro",
  CIDADE_JARDIM: "Cidade Jardim",
  CIDADE_NOVA: "Cidade Nova",
  CIDADE_VERDE: "Cidade Verde",
  DARWIN_CORDEIRO: "Darwin Cordeiro",
  JARDIM_PARAISO: "Jardim Paraíso",
  MONTE_DAS_OLIVEIRAS: "Monte das Oliveiras",
  PANORAMICO: "Panorâmico",
  PARQUE_SAO_JOAO: "Parque São João",
  PEDRO_GOMES: "Pedro Gomes",
  PLANALTO: "Planalto",
  RESIDENCIAL_LARANJEIRAS: "Residencial Laranjeiras",
  SANTO_ANTONIO: "Santo Antônio",
  SAO_FRANCISCO: "São Francisco",
  SAO_JUDAS_TADEU: "São Judas Tadeu",
  SAO_PEDRO: "São Pedro",
  TERESA_CRISTINA: "Teresa Cristina",
};

export function getCounterpart(key: Neighborhoods, userAddress?: Neighborhoods | null) {
  return key !== Neighborhoods.IFNMG ? Neighborhoods.IFNMG : (userAddress ?? null);
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
