import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LocationState {
  city: string;
  setCity: (city: string) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      city: "Delhi",
      setCity: (city) => set({ city }),
    }),
    {
      name: "cravon-location",
    },
  ),
);
