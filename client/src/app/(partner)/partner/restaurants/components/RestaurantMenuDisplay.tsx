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
  spiceLevel?: string;
  prepTime?: string;
};

interface Props {
  readonly menu?: readonly RestaurantMenuItem[];
  readonly restaurantId?: string;
}

export default function RestaurantMenuDisplay({ menu, restaurantId }: Props) {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<string>("");
  const queryClient = useQueryClient();

  const updatePriceMutation = useMutation({
    mutationFn: async ({ itemName, price }: { itemName: string; price: number }) => {
      if (!restaurantId) throw new Error("No restaurant ID");
      return restaurantService.updateMenuPrice(restaurantId, itemName, price);
    },
    onSuccess: () => {
      toast.success("Price updated successfully!");
      setEditingItem(null);
      if (restaurantId) {
        queryClient.invalidateQueries({ queryKey: ["restaurant", restaurantId] });
      }
    },
    onError: (error: unknown) => {
      let msg = "Failed to update price";
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        msg = error.response.data.message;
      } else if (error instanceof Error) {
        msg = error.message;
      }
      toast.error(msg);
    },
  });

  const handleEditClick = (item: RestaurantMenuItem) => {
    setEditingItem(item.name);
    setNewPrice(item.price.toString());
  };

  const handleSave = (itemName: string) => {
    const parsedPrice = Number.parseFloat(newPrice);
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      toast.error("Please enter a valid price");
      return;
    }
    updatePriceMutation.mutate({ itemName, price: parsedPrice });
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

      <div className="space-y-8">
        {Object.entries(
          (menu as RestaurantMenuItem[]).reduce(
            (acc, item) => {
              if (!acc[item.category]) acc[item.category] = [];
              acc[item.category].push(item);
              return acc;
            },
            {} as Record<string, RestaurantMenuItem[]>,
          ),
        ).map(([category, items]) => (
          <div key={category} className="space-y-4">
            <h4 className="text-[13px] font-bold uppercase tracking-widest text-[#FF7A30] border-b border-[#222] pb-2">{category}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((item) => (
                <div key={item.name} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 hover:border-[#FF7A30]/50 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-semibold text-white">{item.name}</h5>

                    <div className="flex items-center gap-2">
                      {editingItem === item.name ? (
                        <div className="flex items-center gap-1 bg-[#222] rounded-md px-2 py-1">
                          <span className="text-white text-sm">₹</span>
                          <input type="number" className="w-10 bg-transparent text-white text-sm outline-none font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} autoFocus onKeyDown={(e) => e.key === "Enter" && handleSave(item.name)} />
                          <button type="button" onClick={() => handleSave(item.name)} disabled={updatePriceMutation.isPending} className="text-green-500 hover:text-green-400 p-1 cursor-pointer">
                            <Check size={16} />
                          </button>
                          <button type="button" onClick={() => setEditingItem(null)} disabled={updatePriceMutation.isPending} className="text-red-500 hover:text-red-400 p-1 cursor-pointer">
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#00C853]">₹{item.price}</span>
                          <button type="button" onClick={() => handleEditClick(item)} className="text-[#555] hover:text-white transition-colors opacity-0 group-hover:opacity-100 cursor-pointer p-1" aria-label="Edit price">
                            <Pencil size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {item.description && <p className="text-xs text-[#888] mb-3">{item.description}</p>}
                  <div className="flex flex-wrap gap-2">
                    {item.dietary && <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.dietary.toLowerCase() === "veg" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"}`}>{item.dietary}</span>}
                    {item.spiceLevel && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20">🌶 {item.spiceLevel}</span>}
                    {item.prepTime && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">⏱ {item.prepTime}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
