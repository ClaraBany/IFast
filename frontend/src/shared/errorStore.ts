import { create } from "zustand";

interface ErrorState {
  globalError: string | null;
  setGlobalError: (message: string) => void;
  clearGlobalError: () => void;
}

export const useErrorStore = create<ErrorState>()((set) => ({
  globalError: null,
  setGlobalError: (globalError) => set({ globalError }),
  clearGlobalError: () => set({ globalError: null }),
}));
