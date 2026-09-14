import { getAccessToken } from "@auth/authStorage";
import axios from "axios";

export const api = axios.create({baseURL: import.meta.env.VITE_API_URL});

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
    if (error.response?.status === 401) {
      const { useAuthStore } = await import("@auth/authStore");
      useAuthStore.getState().logout();
    }

    const data = error.response?.data;
    const message =
      data?.errors?.length > 0
        ? data.errors.join(", ")
        : data?.message ?? "Erro de conexão com o servidor";

    return Promise.reject(new Error(message));
  }
);