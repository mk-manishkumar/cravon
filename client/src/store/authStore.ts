import { create } from "zustand";
import { authService } from "@/services/auth.service";
import toast from "react-hot-toast";
import { useCartStore } from "./cartStore";
import axios from "axios";

export interface Address {
  _id?: string;
  type: string;
  street: string;
  city: string;
  state?: string;
  zipCode?: string;
  instructions?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  roles: string[];
  isPureStaff?: boolean;
  addresses?: Address[];
  subscription?: {
    tier: string;
    status: string;
    expiresAt?: Date;
  };
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isLoggingOut: boolean;
  
  // Actions
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

const getContextToken = () => {
  if (typeof window === "undefined") return null;
  const currentPath = window.location.pathname;

  if (
    currentPath.startsWith("/partner") ||
    currentPath.startsWith("/dashboard") ||
    currentPath.startsWith("/staff") ||
    currentPath.startsWith("/auth/restaurant")
  ) {
    return localStorage.getItem("partner_token");
  }
  if (currentPath.startsWith("/admin") || currentPath.startsWith("/auth/admin")) {
    return localStorage.getItem("admin_token");
  }
  return localStorage.getItem("customer_token");
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true, // Start in loading state until first check completes
  isLoggingOut: false,

  checkAuth: async () => {
    set({ isLoading: true });

    // Skip network request if no token or cookie exists
    if (typeof window !== "undefined") {
      const token = getContextToken();
      const hasCookie = document.cookie.includes("accessToken");
      if (!token && !hasCookie) {
        set({ user: null, isLoading: false });
        return;
      }
    }

    try {
      const response = await authService.getMe();
      const user = response?.user || null;
      
      if (!user) {
        useCartStore.getState().clearCart();
      }
      
      set({ user, isLoading: false });
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // Expired or invalid token; reset cleanly without noisy error
        useCartStore.getState().clearCart();
        set({ user: null, isLoading: false });
        return;
      }
      console.error("Failed to fetch user session:", error);
      useCartStore.getState().clearCart();
      set({ user: null, isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await authService.logout();
      toast.success("Successfully logged out");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out. Please try again.");
    } finally {
      // Regardless of success/fail, clear local state
      set({ user: null, isLoggingOut: false });
      // Clear the cart
      useCartStore.getState().clearCart();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('pendingCartItem');
        const currentPath = window.location.pathname;
        if (currentPath.startsWith("/partner") || currentPath.startsWith("/dashboard") || currentPath.startsWith("/staff")) {
          localStorage.removeItem("partner_token");
        } else if (currentPath.startsWith("/admin")) {
          localStorage.removeItem("admin_token");
        } else {
          localStorage.removeItem("customer_token");
        }
      }
    }
  },

  updateUser: (data: Partial<User>) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    }));
  },
}));
