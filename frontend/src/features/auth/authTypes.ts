import type { User } from "@shared/types";
import z from "zod";

export const loginSchema = z.object({
  email: z.email("Email inválido").endsWith("ifnmg.edu.br", "Email precisa ser do IFNMG"),
  password: z.string().nonempty("Digite a senha "),
});

export const registerSchema = z
  .object({
    name: z.string().min(10, "Nome precisa conter pelo menos 10 caracteres"),
    email: z.email("Email inválido").endsWith("ifnmg.edu.br", "Email precisa ser do IFNMG"),
    password: z.string().min(6, "Senha precisa conter pelo menos 6 caracteres"),
    confirm_password: z.string().nonempty("Digite uma senha"),
  })
  .refine((data) => data.password === data.confirm_password, {
    error: "As senhas precisam ser iguais",
    path: ["confirm_password"],
});

export interface AuthResponse {
    token: string;
    user: User;
}