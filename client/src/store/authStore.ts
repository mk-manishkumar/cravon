import { create } from "zustand";
import { authService } from "@/services/auth.service";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isLoggingOut: boolean;
  
  // Actions
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true, // Start in loading state until first check completes
  isLoggingOut: false,

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const response = await authService.getMe();
      set({ user: response?.user || null, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch user session:", error);
      set({ user: null, isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // Regardless of success/fail, clear local state
      set({ user: null, isLoggingOut: false });
    }
  },
}));
