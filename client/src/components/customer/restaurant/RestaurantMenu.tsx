import Image from "next/image";
import { Star } from "lucide-react";

interface RestaurantMenuProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  restaurant: any;
  getQuantity: (itemId: string) => number;
  updateQuantity: (itemId: string, delta: number) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleAddToCart: (menuItem: any) => void;
}

export default function RestaurantMenu({ restaurant, getQuantity, updateQuantity, handleAddToCart }: Readonly<RestaurantMenuProps>) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
        Menu <span className="text-gray-400 text-lg font-normal">({restaurant.menu?.length || 0} items)</span>
      </h2>

      {!restaurant.menu || restaurant.menu.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl">This restaurant hasn&apos;t added any menu items yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {restaurant.menu.map((item: any, idx: number) => (
            <div key={item._id || `menu-${idx}`} className="flex justify-between items-start p-6 bg-white border border-gray-100 shadow-sm rounded-2xl hover:shadow-md transition-shadow">
              <div className="flex-1 pr-6">
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-4 h-4 flex items-center justify-center border-2 rounded-sm ${item.isVeg !== false ? "border-green-600" : "border-red-600"}`}>
                    <div className={`w-2 h-2 rounded-full ${item.isVeg !== false ? "bg-green-600" : "bg-red-600"}`}></div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                </div>
                <p className="font-semibold text-gray-800 mb-2">₹{item.price}</p>
                {item.description && <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>}
              </div>

              <div className="shrink-0 w-32 flex flex-col items-center">
                <div className="relative w-32 h-32 mb-3">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover rounded-xl shadow-sm" />
                  ) : (
                    <div className="w-full h-full bg-orange-50 rounded-xl shadow-sm flex items-center justify-center text-orange-200">
                      <Star className="w-8 h-8 opacity-50" />
                    </div>
                  )}
                </div>

                {getQuantity(item._id) > 0 ? (
                  <div className="w-[85%] bg-[#FF7A30] text-white font-bold rounded-xl shadow-[0_4px_12px_rgba(255,122,48,0.3)] flex items-center justify-between overflow-hidden">
                    <button type="button" onClick={() => updateQuantity(item._id, -1)} className="px-3 py-1.5 hover:bg-black/10 cursor-pointer text-lg leading-none transition-colors">
                      -
                    </button>
                    <span className="text-sm font-bold">{getQuantity(item._id)}</span>
                    <button type="button" onClick={() => updateQuantity(item._id, 1)} className="px-3 py-1.5 hover:bg-black/10 cursor-pointer text-lg leading-none transition-colors">
                      +
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => handleAddToCart(item)} className="w-[85%] cursor-pointer bg-[#FF7A30] hover:bg-[#FF8E4D] text-white font-bold rounded-xl shadow-[0_4px_12px_rgba(255,122,48,0.3)] transition-transform active:scale-[0.98] py-1.5 uppercase text-sm">
                    ADD
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
