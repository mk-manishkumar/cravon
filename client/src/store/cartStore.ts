import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  isVeg?: boolean;
}

interface CartState {
  restaurantId: string | null;
  restaurantName: string | null;
  items: CartItem[];
  
  // Actions
  addItem: (item: CartItem, resId: string, resName: string) => boolean; // Returns true if added, false if restaurant mismatch
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  replaceCart: (item: CartItem, resId: string, resName: string) => void; // Clears old cart and adds new item
  
  // Computed
  getTotalQuantity: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      restaurantId: null,
      restaurantName: null,
      items: [],

      addItem: (item, resId, resName) => {
        const { restaurantId, items } = get();

        // If cart belongs to another restaurant, reject (UI will prompt to replace)
        if (restaurantId && restaurantId !== resId && items.length > 0) {
          return false; 
        }

        const existingItem = items.some((i) => i.id === item.id);
        
        if (existingItem) {
          set({
            items: items.map((i) => 
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            )
          });
        } else {
          set({ 
            restaurantId: resId,
            restaurantName: resName,
            items: [...items, item] 
          });
        }
        
        return true;
      },

      replaceCart: (item, resId, resName) => {
        set({
          restaurantId: resId,
          restaurantName: resName,
          items: [item]
        });
      },

      removeItem: (itemId) => {
        const { items } = get();
        const newItems = items.filter((i) => i.id !== itemId);
        
        if (newItems.length === 0) {
          set({ items: [], restaurantId: null, restaurantName: null });
        } else {
          set({ items: newItems });
        }
      },

      updateQuantity: (itemId, delta) => {
        const { items } = get();
        const item = items.find(i => i.id === itemId);
        
        if (!item) return;

        const newQuantity = item.quantity + delta;

        if (newQuantity <= 0) {
          get().removeItem(itemId);
        } else {
          set({
            items: items.map(i => i.id === itemId ? { ...i, quantity: newQuantity } : i)
          });
        }
      },

      clearCart: () => set({ items: [], restaurantId: null, restaurantName: null }),

      getTotalQuantity: () => get().items.reduce((total, item) => total + item.quantity, 0),
      getSubtotal: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
    }),
    {
      name: "cravon-cart", // Key used in local storage
    }
  )
);
