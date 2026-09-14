import { loginSchema, registerSchema } from "./authTypes";
import { api } from "@shared/api";
import type z from "zod";
import type { User } from "@shared/types";
import type { AuthResponse } from "./authTypes";

export async function login(credentials: z.infer<typeof loginSchema>): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/login", credentials);
  return response.data;
}

export async function loginGoogle(googleToken: string): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/login/google", { idToken: googleToken });
  return response.data;
}

export async function register(data: z.infer<typeof registerSchema>): Promise<AuthResponse> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { confirm_password, ...payload } = data;

  const response = await api.post<AuthResponse>("/register", payload);
  return response.data;
}

export async function getMe(): Promise<User> {
  const response = await api.get<User>("/user/me");
  return response.data;
}
