import Image from "next/image";

interface CheckoutCartSummaryProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  restaurant: any;
  restaurantName: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[];
  subtotal: number;
  deliveryFee: number;
  taxes: number;
  grandTotal: number;
  updateQuantity: (itemId: string, delta: number) => void;
}

export default function CheckoutCartSummary({ restaurant, restaurantName, items, subtotal, deliveryFee, taxes, grandTotal, updateQuantity }: Readonly<CheckoutCartSummaryProps>) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden relative shrink-0">{restaurant?.image ? <Image src={restaurant.image} alt="Restaurant" fill className="object-cover" /> : <div className="w-full h-full bg-gray-800"></div>}</div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{restaurantName}</h3>
          <p className="text-gray-500 text-sm line-clamp-1">{restaurant?.address}</p>
        </div>
      </div>

      <div className="max-h-64 overflow-y-auto mb-6 pr-2 space-y-4 scrollbar-thin">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 flex-1 pr-2">
              <div className={`w-3 h-3 flex shrink-0 items-center justify-center border rounded-sm ${item.isVeg !== false ? "border-green-600" : "border-red-600"}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg !== false ? "bg-green-600" : "bg-red-600"}`}></div>
              </div>
              <span className="text-gray-700 truncate">{item.name}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white border border-gray-200 rounded-md shadow-sm h-7 overflow-hidden shrink-0">
                <button type="button" onClick={() => updateQuantity(item.id, -1)} className="px-2 font-bold text-gray-500 hover:bg-gray-100 cursor-pointer">
                  -
                </button>
                <span className="px-2 text-green-600 font-bold text-xs">{item.quantity}</span>
                <button type="button" onClick={() => updateQuantity(item.id, 1)} className="px-2 font-bold text-green-600 hover:bg-gray-100 cursor-pointer">
                  +
                </button>
              </div>
              <span className="text-gray-700 font-medium w-12 text-right">₹{item.price * item.quantity}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 pt-4 border-t border-dashed border-gray-300 text-sm text-gray-600">
        <div className="flex justify-between font-medium text-gray-800">
          <span>Item Total</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Fee | 2.5 kms</span>
          <span>₹{deliveryFee}</span>
        </div>
        <div className="flex justify-between">
          <span>Taxes & Charges</span>
          <span>₹{taxes}</span>
        </div>
      </div>

      <div className="flex justify-between font-bold text-gray-900 text-lg mt-4 pt-4 border-t border-gray-300">
        <span>To Pay</span>
        <span>₹{grandTotal}</span>
      </div>
    </div>
  );
}
