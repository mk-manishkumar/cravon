import toast from "react-hot-toast";

interface ReplaceCartModalProps {
  pendingItem: { id: string; name: string; price: number; quantity: number; isVeg?: boolean } | null;
  restaurant: { _id: string; name: string } | null;
  replaceCart: (item: { id: string; name: string; price: number; quantity: number; isVeg?: boolean }, restaurantId: string, restaurantName: string) => void;
  onClose: () => void;
}

export default function ReplaceCartModal({ pendingItem, restaurant, replaceCart, onClose }: Readonly<ReplaceCartModalProps>) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Items already in cart</h3>
        <p className="text-gray-500 mb-6 text-sm">Your cart contains items from other restaurant. Would you like to reset your cart for adding items from this restaurant?</p>
        <div className="flex gap-4">
          <button type="button" onClick={onClose} className="flex-1 py-3 border-2 border-orange-500 text-orange-500 font-bold rounded-xl hover:bg-orange-50 transition-colors cursor-pointer uppercase text-sm">
            No
          </button>
          <button
            type="button"
            onClick={() => {
              if (pendingItem && restaurant) {
                replaceCart(pendingItem, restaurant._id, restaurant.name);
                toast.success("Cart cleared and item added!");
              }
              onClose();
            }}
            className="flex-1 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors cursor-pointer uppercase text-sm"
          >
            Yes, Start Afresh
          </button>
        </div>
      </div>
    </div>
  );
}
