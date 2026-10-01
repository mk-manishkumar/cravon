import { useState } from "react";
import { Utensils, Pencil, Check, X } from "lucide-react";
import { restaurantService } from "@/services/restaurant.service";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export type RestaurantMenuItem = {
  category: string;
  name: string;
  price: number;
  description?: string;
  dietary?: string;
  isVeg?: boolean;
  spiceLevel?: string;
  prepTime?: string;
};

interface Props {
  readonly menu?: readonly RestaurantMenuItem[];
  readonly restaurantId?: string;
}

const getDietaryLabel = (item: RestaurantMenuItem): string => {
  if (item.dietary) return item.dietary;
  if (item.isVeg === true) return "Veg";
  if (item.isVeg === false) return "Non-Veg";
  return "";
};

export default function RestaurantMenuDisplay({ menu, restaurantId }: Props) {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", price: "", description: "", dietary: "" });
  const queryClient = useQueryClient();

  const updateItemMutation = useMutation({
    mutationFn: async ({ itemName, updates }: { itemName: string; updates: { name?: string; price?: number; description?: string; dietary?: string } }) => {
      if (!restaurantId) throw new Error("No restaurant ID");
      return await restaurantService.updateMenuItem(restaurantId, itemName, updates);
    },
    onMutate: async ({ itemName, updates }) => {
      if (!restaurantId) return;
      await queryClient.cancelQueries({ queryKey: ["restaurant", restaurantId] });
      const previousRestaurant = queryClient.getQueryData(["restaurant", restaurantId]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData(["restaurant", restaurantId], (old: any) => {
        if (!old?.menu) return old;
        return {
          ...old,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          menu: old.menu.map((item: any) =>
            item.name === itemName ? { ...item, ...updates } : item
          ),
        };
      });

      return { previousRestaurant };
    },
    onSuccess: () => {
      toast.success("Menu item updated successfully!");
      setEditingItem(null);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: unknown, variables, context: any) => {
      if (context?.previousRestaurant && restaurantId) {
        queryClient.setQueryData(["restaurant", restaurantId], context.previousRestaurant);
      }
      let msg = "Failed to update menu item";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      } else if (error instanceof Error) {
        msg = error.message;
      }
      toast.error(msg);
    },
    onSettled: () => {
      if (restaurantId) {
        void queryClient.invalidateQueries({ queryKey: ["restaurant", restaurantId] });
      }
    },
  });

  const handleEditClick = (item: RestaurantMenuItem) => {
    setEditingItem(item.name);
    setEditForm({ 
      name: item.name, 
      price: item.price.toString(), 
      description: item.description || "", 
      dietary: getDietaryLabel(item)
    });
  };

  const handleSave = (itemName: string) => {
    const parsedPrice = Number.parseFloat(editForm.price);
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      toast.error("Please enter a valid price");
      return;
    }
    updateItemMutation.mutate({ 
      itemName, 
      updates: { 
        name: editForm.name, 
        price: parsedPrice, 
        description: editForm.description, 
        dietary: editForm.dietary 
      } 
    });
  };

  if (!menu || menu.length === 0) return null;

  return (
    <div className="bg-[#111] border border-[#222] rounded-3xl p-8 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Utensils className="text-[#FF7A30]" size={22} /> Your Menu
        </h3>
        <span className="text-sm text-[#888] bg-[#1A1A1A] px-3 py-1 rounded-full border border-[#333]">{menu.length} Items</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(menu as RestaurantMenuItem[]).map((item) => (
                <div key={item.name} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 hover:border-[#FF7A30]/50 transition-colors group">
                  {editingItem === item.name ? (
                    <div className="flex flex-col gap-3">
                      <div className="flex gap-2">
                        <input type="text" className="flex-1 bg-[#222] text-white text-sm outline-none px-3 py-1.5 rounded-md border border-[#333]" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} placeholder="Item Name" />
                        <div className="flex items-center gap-1 bg-[#222] rounded-md px-3 py-1.5 border border-[#333]">
                          <span className="text-[#888] text-sm">₹</span>
                          <input type="number" className="w-14 bg-transparent text-[#00C853] text-sm outline-none font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" value={editForm.price} onChange={(e) => setEditForm({...editForm, price: e.target.value})} placeholder="Price" />
                        </div>
                      </div>
                      <input type="text" className="w-full bg-[#222] text-[#aaa] text-xs outline-none px-3 py-1.5 rounded-md border border-[#333]" value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} placeholder="Description (optional)" />
                      <div className="flex gap-2 items-center">
                        <select className="bg-[#222] text-xs text-white outline-none px-2 py-1.5 rounded-md border border-[#333]" value={editForm.dietary} onChange={(e) => setEditForm({...editForm, dietary: e.target.value})}>
                          <option value="">Dietary (None)</option>
                          <option value="Veg">Veg</option>
                          <option value="Non-Veg">Non-Veg</option>
                        </select>
                        <div className="ml-auto flex gap-1">
                          <button type="button" onClick={() => handleSave(item.name)} disabled={updateItemMutation.isPending} className="text-green-500 hover:text-green-400 hover:bg-green-500/10 p-1.5 rounded-md transition-colors cursor-pointer">
                            <Check size={16} />
                          </button>
                          <button type="button" onClick={() => setEditingItem(null)} disabled={updateItemMutation.isPending} className="text-red-500 hover:text-red-400 hover:bg-red-500/10 p-1.5 rounded-md transition-colors cursor-pointer">
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-semibold text-white">{item.name}</h5>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#00C853]">₹{item.price}</span>
                          <button type="button" onClick={() => handleEditClick(item)} className="text-[#666] hover:text-white transition-colors cursor-pointer p-1" aria-label="Edit item">
                            <Pencil size={14} />
                          </button>
                        </div>
                      </div>
                      {item.description && <p className="text-xs text-[#888] mb-3">{item.description}</p>}
                      <div className="flex flex-wrap gap-2">
                        {(() => {
                          const dietaryLabel = getDietaryLabel(item);
                          if (!dietaryLabel) return null;
                          const colorClass = dietaryLabel.toLowerCase() === "veg" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20";
                          return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${colorClass}`}>{dietaryLabel}</span>;
                        })()}
                        {item.spiceLevel && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20">🌶 {item.spiceLevel}</span>}
                        {item.prepTime && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">⏱ {item.prepTime}</span>}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
    </div>
  );
}
