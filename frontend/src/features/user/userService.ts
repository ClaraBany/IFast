import { api } from "@shared/api";
import type { updateProfileSchema, User, ProfileResponse } from "./userTypes";
import type z from "zod";

export async function getMe(): Promise<User> {
  const response = await api.get<User>("/users/me");
  return response.data;
}

export async function getProfile(id: number): Promise<ProfileResponse> {
  const response = await api.get<ProfileResponse>(`/users/${id}`);
  return response.data;
}

export async function updateProfile(data: z.infer<typeof updateProfileSchema>): Promise<User> {
  const payload = {
    ...data,
    phoneNumber: data.phoneNumber?.trim() === "" ? undefined : data.phoneNumber,
    address: data.address?.trim() === "" ? undefined : data.address,
  };

  const response = await api.put<User>("/users", payload);
  return response.data;
}
