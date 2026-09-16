import { getAccessToken } from "@auth/authStorage";
import axios from "axios";

export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;

    if (status === 401) {
      const { useAuthStore } = await import("@auth/authStore");
      useAuthStore.getState().logout();
    }

    const data = error.response?.data;
    const message = data?.message ?? "Erro de conexão com o servidor";

    return Promise.reject(new ApiError(message, status));
  },
);

export class ApiError extends Error {
  public status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}