import { api } from "@shared/api";

export async function create(vehicle: vehicleSchema): Promise<vehicleResponse> {
    const response = await api.post<vehicleResponse>("/vehicles");
    return response.data;
}