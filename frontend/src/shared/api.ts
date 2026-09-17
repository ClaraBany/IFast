import { getAccessToken } from "@auth/authStorage";
import axios from "axios";
import { useErrorStore } from "./errorStore";

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
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (import.meta.env.DEV) {
      console.group(`[Axios Interceptor Error] ${error.config?.url}`);
      console.error("Status:", error.response?.status ?? "Sem resposta");
      console.error("Payload/Data:", error.response?.data);
      console.groupEnd();
    }

    const status = error.response?.status;

    if (!error.response || (status && status >= 500)) {
      useErrorStore
        .getState()
        .setGlobalError("Ocorreu um erro ao conectar aos nossos servidores. Por favor, tente novamente mais tarde");
      return Promise.reject(error);
    }

    if (status === 401) {
      const { useAuthStore } = await import("@auth/authStore");
      useAuthStore.getState().logout();
    }

    const data = error.response?.data;
    const message = data?.message ?? "Ocorreu um erro";

    return Promise.reject(new ApiError(message, status));
  },
);

export class ApiError extends Error {
  public status: number | undefined;

  constructor(message: string, status: number | undefined) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}
