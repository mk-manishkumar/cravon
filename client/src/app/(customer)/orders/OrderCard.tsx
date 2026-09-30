import Image from "next/image";
import { ChefHat, Banknote, CreditCard, Download } from "lucide-react";
import { downloadInvoice } from "@/utils/pdf";

interface OrderItem {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderRestaurant {
  name?: string;
  image?: string;
  address?: {
    street?: string;
  };
}

interface Order {
  _id: string;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  itemTotal: number;
  taxes: number;
  deliveryFee: number;
  grandTotal: number;
  createdAt: string;
  restaurant?: OrderRestaurant;
  items: OrderItem[];
}

interface OrderCardProps {
  order: Order;
  status: {
    label: string;
    color: string;
    bg: string;
    icon: React.ReactNode;
  };
}

export default function OrderCard({ order, status }: Readonly<OrderCardProps>) {
  const restaurant = order.restaurant;
  const orderDate = new Date(order.createdAt);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      {/* Restaurant Header */}
      <div className="flex items-center gap-4 p-5 border-b border-gray-50">
        {restaurant?.image ? (
          <Image src={restaurant.image} alt={restaurant?.name || "Restaurant"} width={48} height={48} className="w-12 h-12 rounded-lg object-cover" />
        ) : (
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-gray-400" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 truncate">{restaurant?.name || "Restaurant"}</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {orderDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            {" • "}
            {orderDate.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      </div>

      <div className="px-5 pt-3 flex items-center justify-between">
        <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${status.bg} ${status.color}`}>
          {status.icon}
          {status.label}
        </div>
        {order.orderStatus === "delivered" && (
          <button onClick={() => downloadInvoice(order)} className="flex items-center gap-1 text-[11px] font-bold text-orange-500 hover:text-orange-600 transition-colors bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-full border border-orange-100 cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            Download Invoice
          </button>
        )}
      </div>

      {/* Items */}
      <div className="px-5 py-4 flex-1">
        <div className="space-y-2">
          {order.items.map((item: OrderItem) => (
            <div key={item._id || item.id || `${item.name}-${item.price}-${item.quantity}`} className="flex justify-between text-sm">
              <span className="text-gray-700">
                <span className="font-medium">{item.quantity}x</span> {item.name}
              </span>
              <span className="text-gray-500 font-medium">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex flex-col gap-1 text-xs text-gray-500">
          <span className="flex items-center gap-1 font-medium text-gray-600">
            {order.paymentMethod === "cod" ? <Banknote className="w-3.5 h-3.5" /> : <CreditCard className="w-3.5 h-3.5" />}
            {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online (Paid)"}
          </span>
        </div>
        <p className="text-base font-bold text-gray-900">Total: ₹{order.grandTotal} /-</p>
      </div>
    </div>
  );
}
