import { create } from "zustand";

interface AuthState {
  user: { id: string; email: string; created_at?: string } | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem("shteam_token"),

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
}));
