import { create } from "zustand";

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  kycStatus: "pending" | "approved" | "rejected" | "none";
  isVerified: boolean;
}

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
  setUser: (user: User | null) => void;
  logout: () => void;

  // Wallet
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
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, isAuthenticated: false, balance: 0, betSlip: [] });
  },

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
