import { create } from "zustand";

export type Role = "admin" | "owner" | "holder" | "liquidity" | null;

interface AuthState {
  role: Role | null;
  roleChanged: boolean;
  setRole: (role: Role) => void;
  setRoleChanged: (val: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: null,
  roleChanged: false,
  setRole: (role) => set({ role }),
  setRoleChanged: (val) => set({ roleChanged: val }),
}));
