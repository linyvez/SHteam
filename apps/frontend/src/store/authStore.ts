import { create } from "zustand";

interface AuthState {
  user: {
    id: string;
    email: string;
    balance: number;
    created_at?: string;
  } | null;
  token: string | null;
  bankCredits: number;
  setBankCredits: (credits: number | ((prev: number) => number)) => void;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  topUpBalance: (amount: number) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem("shteam_token"),
  bankCredits: 1000,

  setBankCredits: (credits) =>
    set((state) => ({
      bankCredits:
        typeof credits === "function" ? credits(state.bankCredits) : credits,
    })),

  login: async (email, password) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Invalid credentials");

    const data = await res.json();
    localStorage.setItem("shteam_token", data.access_token);
    set({ user: data.user, token: data.access_token });

    await get().fetchUser();
  },

  register: async (email, password) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error("Registration failed or email exists");
  },

  logout: async () => {
    const currentToken = get().token;
    const currentUser = get().user;

    if (currentUser) {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUser.id }),
      });
    }

    localStorage.removeItem("shteam_token");
    set({ user: null, token: null });
  },

  fetchUser: async () => {
    const token = get().token;
    if (!token) return;

    try {
      const res = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const userData = await res.json();
        set({ user: userData });
      } else {
        get().logout();
      }
    } catch (err) {
      console.error("Failed to fetch user profile", err);
    }
  },

  topUpBalance: async (amount: number) => {
    const token = get().token;
    if (!token) return;

    // Send the top-up request to the Identity Service via the Nginx Gateway
    const res = await fetch("/api/auth/topup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount }),
    });

    if (res.ok) {
      const data = await res.json();
      // Update the global state with the new balance from the database!
      set((state) => ({
        user: state.user ? { ...state.user, balance: data.newBalance } : null,
      }));
    }
  },
}));
