import { create } from "zustand";

interface Driver {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  vehicleDetails: string;
  isAvailable: boolean;
}

interface AuthState {
  driver: Driver | null;
  token: string | null;
  setAuth: (driver: Driver, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  driver: localStorage.getItem("driver_data") ? JSON.parse(localStorage.getItem("driver_data") as string) : null,
  token: localStorage.getItem("driver_token") || null,
  setAuth: (driver, token) => {
    localStorage.setItem("driver_token", token);
    localStorage.setItem("driver_data", JSON.stringify(driver));
    set({ driver, token });
  },
  logout: () => {
    localStorage.removeItem("driver_token");
    localStorage.removeItem("driver_data");
    set({ driver: null, token: null });
  },
}));
