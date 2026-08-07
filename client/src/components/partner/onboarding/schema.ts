import * as z from "zod";

export const onboardingSchema = z.object({
  name: z.string().min(2, "Restaurant name must be at least 2 characters"),
  franchiseName: z.union([z.string(), z.literal("")]).optional(),
  street: z.string().min(2, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string().min(3, "Zip code is required"),
  lat: z.union([z.number().min(-90).max(90, "Invalid latitude"), z.number().refine(Number.isNaN)]).optional(),
  lng: z.union([z.number().min(-180).max(180, "Invalid longitude"), z.number().refine(Number.isNaN)]).optional(),
  operatingDays: z.array(z.string()).optional(),
  openTime: z.union([z.string().min(4, "Opening time required"), z.literal("")]).optional(),
  closeTime: z.union([z.string().min(4, "Closing time required"), z.literal("")]).optional(),
  breakfastOpen: z.string().optional(),
  breakfastClose: z.string().optional(),
  lunchOpen: z.string().optional(),
  lunchClose: z.string().optional(),
  dinnerOpen: z.string().optional(),
  dinnerClose: z.string().optional(),
  image: z.string().optional(),
});

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;

export interface InitialData {
  name?: string;
  franchiseName?: string;
  image?: string;
  address?: string;
  location?: { coordinates?: number[] };
  operatingDays?: string[];
  operatingHours?: { open?: string; close?: string };
  mealTimings?: {
    breakfast?: { open?: string; close?: string };
    lunch?: { open?: string; close?: string };
    dinner?: { open?: string; close?: string };
  };
}
