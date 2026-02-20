import { create } from "zustand";
import type { MeUser } from "../services/authService";

export type User = MeUser;

export interface BetSlipItem {
  id: string;
  numbers: [number, number];
  amount: number;
  drawScheduleId: string;
  drawScheduleLabel: string;
}

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  setUser: (user: User | null) => void;
  setInitialized: (v: boolean) => void;
  logout: () => void;

  // Wallet (synced from user.wallet on setUser)
  balance: number;
  setBalance: (balance: number) => void;

  // Bet Slip
  betSlip: BetSlipItem[];
  addToBetSlip: (item: BetSlipItem) => void;
  removeFromBetSlip: (id: string) => void;
  clearBetSlip: () => void;

  // UI
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Auth
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      balance: user?.wallet?.balance ?? 0,
    }),
  setInitialized: (v) => set({ isInitialized: v }),
  // Server clears the cookie via POST /api/auth/logout — we only clear local state
  logout: () => set({ user: null, isAuthenticated: false, balance: 0, betSlip: [] }),

  // Wallet
  balance: 0,
  setBalance: (balance) => set({ balance }),

  // Bet Slip
  betSlip: [],
  addToBetSlip: (item) => set((s) => ({ betSlip: [...s.betSlip, item] })),
  removeFromBetSlip: (id) =>
    set((s) => ({ betSlip: s.betSlip.filter((b) => b.id !== id) })),
  clearBetSlip: () => set({ betSlip: [] }),

  // UI
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));
