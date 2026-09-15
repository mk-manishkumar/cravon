import { create } from "zustand";
import { authService } from "@/services/auth.service";
import toast from "react-hot-toast";
import { useCartStore } from "./cartStore";

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

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true, // Start in loading state until first check completes
  isLoggingOut: false,

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const response = await authService.getMe();
      const user = response?.user || null;
      
      if (!user) {
        useCartStore.getState().clearCart();
      }
      
      set({ user, isLoading: false });
    } catch (error) {
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
      }
    }
  },

  updateUser: (data: Partial<User>) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    }));
  },
}));
