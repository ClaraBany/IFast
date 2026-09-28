import { api } from "@shared/api";
import {
  type updateProfileSchema,
  type User,
  type ProfileResponse,
  getNeighborhoodKey,
  getNeighborhoodLabel,
} from "./userTypes";
import type z from "zod";

function withNeighborhoodLabel(user: User): User {
  return { ...user, address: getNeighborhoodLabel(user.address) };
}

export async function getMe(): Promise<User> {
  const response = await api.get<User>("/users/me");
  return withNeighborhoodLabel(response.data);
}

export async function getProfile(id: number): Promise<ProfileResponse> {
  const response = await api.get<ProfileResponse>(`/users/${id}`);
  return { ...response.data, user: withNeighborhoodLabel(response.data.user) };
}

export async function updateProfile(data: z.infer<typeof updateProfileSchema>): Promise<User> {
  const payload = {
    ...data,
    phoneNumber: data.phoneNumber?.trim() === "" ? undefined : data.phoneNumber,
    address: data.address ? getNeighborhoodKey(data.address) : undefined,
  };

  const response = await api.put<User>("/users/me", payload);
  return withNeighborhoodLabel(response.data);
}
