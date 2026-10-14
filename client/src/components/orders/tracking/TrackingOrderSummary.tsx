import { OrderItem } from "@/types/orderTracking";

interface TrackingOrderSummaryProps {
  items: OrderItem[];
  grandTotal: number;
}

export default function TrackingOrderSummary({ items, grandTotal }: Readonly<TrackingOrderSummaryProps>) {
  return (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-zinc-200/80 space-y-4">
      <h3 className="font-bold text-zinc-900 text-sm">Order Summary</h3>
      <div className="divide-y divide-zinc-100">
        {items.map((item) => (
          <div key={item._id || item.id || `${item.name}-${item.price}`} className="py-2.5 flex justify-between items-center text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-zinc-400 font-mono">{item.quantity}x</span>
              <span className="text-zinc-700 font-medium">{item.name}</span>
            </div>
            <span className="font-semibold text-zinc-900">₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-zinc-100 flex justify-between items-center">
        <span className="text-sm font-bold text-zinc-900">Total Paid</span>
        <span className="text-base font-black text-orange-500">₹{grandTotal}</span>
      </div>
    </div>
  );
}
