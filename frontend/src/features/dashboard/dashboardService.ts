import { api } from "@shared/api";
import type { Dashboard, DashboardFilter } from "./dashboardTypes";

export async function getDashboard(filter: DashboardFilter): Promise<Dashboard> {
  const response = await api.get<Dashboard>("/dashboard", {
    params: filter,
  });
  return response.data;
}