// Centralized pricing logic
export const PRICING_TIERS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    maxRestaurants: 3,
    maxStaff: 0,
    validityMonths: 0,
  },
  PRO: {
    id: 'pro',
    name: 'Professional',
    price: 4000, // INR 
    maxRestaurants: 50,
    maxStaff: 3,
    validityMonths: 6,
  },
  ENT: {
    id: 'ent',
    name: 'Enterprise',
    price: 8000, // INR 
    maxRestaurants: 100,
    maxStaff: 10,
    validityMonths: 12,
  }
};

export type TierId = keyof typeof PRICING_TIERS;

// Helper to get tier configuration
export const getTierConfig = (tierId: string) => {
  const normalizedTierId = tierId.toUpperCase();
  const config = PRICING_TIERS[normalizedTierId as TierId];
  return config || PRICING_TIERS.FREE; // Default to free if invalid
};
