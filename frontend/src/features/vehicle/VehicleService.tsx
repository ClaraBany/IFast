import { vehicleSchema } from "./VehicleTypes";
import { api } from "@shared/api";
import type z from "zod";
import type { Vehicle } from "./VehicleTypes";

export async function create(vehicle: z.infer<typeof vehicleSchema>): Promise<Vehicle> {
  const payload = {
    ...vehicle,
    plate: vehicle.plate?.trim() === "" ? undefined : vehicle.plate,
  };
  const response = await api.post<Vehicle>("/vehicles", payload);
  return response.data;
}

export async function getAll(): Promise<Vehicle[]> {
  const response = await api.get<Vehicle[]>("/vehicles");
  return response.data;
}

export async function get(vehicleId: number): Promise<Vehicle> {
  const response = await api.get<Vehicle>(`/vehicles/${vehicleId}`);
  return response.data;
}

export async function del(vehicleId: number): Promise<void> {
  await api.delete<Vehicle>(`/vehicles/${vehicleId}`);
}

export async function update(vehicleId: number, vehicle: z.infer<typeof vehicleSchema>): Promise<Vehicle> {
  const payload = {
    ...vehicle,
    plate: vehicle.plate?.trim() === "" ? undefined : vehicle.plate,
  };
  const response = await api.put<Vehicle>(`/vehicles/${vehicleId}`, payload);
  return response.data;
}
