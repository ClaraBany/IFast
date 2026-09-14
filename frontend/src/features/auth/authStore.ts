import type { User } from "@shared/types";
import { create } from "zustand";
import { loginSchema, registerSchema } from "./authTypes";
import * as authService from "./authService"
import type { AuthResponse } from "./authTypes";
import type z from "zod";
import { clearAccessToken, getAccessToken, setAccessToken } from "./authStorage";

interface AuthState {
    user: User | null;
    isLoading: boolean;

    login: (credentials: z.infer<typeof loginSchema>) => Promise<void>;
    loginGoogle: (googleToken: string) => Promise<void>;
    register: (data: z.infer<typeof registerSchema>) => Promise<void>;
    logout: () => void;
    initialize: () => Promise<void>
    setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()((set) => {
    const handleAuthSuccess = ({ token, user }: AuthResponse) => {
        setAccessToken(token);
        set({ user });
    };

    return {
        user: null,
        isLoading: true,

        login: async (credentials) => {
            const response = await authService.login(credentials);
            handleAuthSuccess(response);
        },
        loginGoogle: async (googleToken) => {
            const response = await authService.loginGoogle(googleToken);
            handleAuthSuccess(response);
        },
        register: async (data) => {
            const response = await authService.register(data);
            handleAuthSuccess(response);
        },

        logout: () => {
            clearAccessToken();
            set({ user: null });
        },

        initialize: async () => {
            const token = getAccessToken();
            if (!token) {
                set({ user: null, isLoading: false });
                return;
            }

            try {
                const user = await authService.getMe();
                set({ user, isLoading: false });
            } catch {
                clearAccessToken();
                set({ user: null, isLoading: false });
            }
        },

        setUser: (user) => {
            set({ user });
        },
    };
});