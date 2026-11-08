import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Package, Clock, Truck, CheckCircle2, XCircle, MapPin, Store, Calendar, IndianRupee } from "lucide-react";
import api from "../lib/axios";

interface DeliveryItem {
  _id?: string;
  name: string;
  price: number;
  quantity: number;
}

interface DeliveryOrder {
  _id: string;
  orderStatus: "pending" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
  paymentStatus: string;
  paymentMethod: string;
  grandTotal: number;
  itemTotal: number;
  deliveryFee: number;
  createdAt: string;
  restaurant?: {
    name?: string;
    address?: string;
    image?: string;
  };
  user?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  deliveryAddress: {
    street: string;
    city: string;
  };
  items?: DeliveryItem[];
}

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  preparing: { label: "Preparing", color: "text-blue-700", bg: "bg-blue-50 border-blue-200", icon: <Clock className="w-3.5 h-3.5" /> },
  out_for_delivery: { label: "Out for Delivery", color: "text-purple-700", bg: "bg-purple-50 border-purple-200", icon: <Truck className="w-3.5 h-3.5" /> },
  delivered: { label: "Delivered", color: "text-green-700", bg: "bg-green-50 border-green-200", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  cancelled: { label: "Cancelled", color: "text-red-700", bg: "bg-red-50 border-red-200", icon: <XCircle className="w-3.5 h-3.5" /> },
};

interface MyDeliveriesProps {
  onBack: () => void;
}

export default function MyDeliveries({ onBack }: MyDeliveriesProps) {
  const [deliveries, setDeliveries] = useState<DeliveryOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "delivered" | "out_for_delivery" | "cancelled">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/driver/deliveries?limit=100");
        setDeliveries(res.data.data?.orders || []);
      } catch (err) {
        console.error("Failed to fetch deliveries:", err);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchDeliveries();
  }, []);

  const filteredDeliveries = useMemo(() => {
    if (filter === "all") return deliveries;
    return deliveries.filter((d) => d.orderStatus === filter);
  }, [deliveries, filter]);

  const totalPages = Math.ceil(filteredDeliveries.length / itemsPerPage) || 1;

  const currentDeliveries = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDeliveries.slice(start, start + itemsPerPage);
  }, [filteredDeliveries, currentPage]);

  const deliveryCount = filteredDeliveries.length;
  const countLabel = deliveryCount === 1 ? "delivery" : "deliveries";
  const summaryText = deliveryCount > 0 ? `${deliveryCount} total ${countLabel}` : "Your delivery history";

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="p-2.5 bg-white hover:bg-gray-100 border border-gray-200 rounded-2xl transition-colors cursor-pointer text-gray-700 shadow-xs"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
                <Package className="w-6 h-6 text-[#FF7A30]" /> My Deliveries
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{summaryText}</p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex bg-gray-200/80 p-1.5 rounded-2xl gap-1 overflow-x-auto self-start sm:self-auto max-w-full">
            <button
              type="button"
              onClick={() => {
                setFilter("all");
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                filter === "all"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => {
                setFilter("delivered");
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                filter === "delivered"
                  ? "bg-white text-green-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Delivered
            </button>
            <button
              type="button"
              onClick={() => {
                setFilter("out_for_delivery");
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                filter === "out_for_delivery"
                  ? "bg-white text-purple-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => {
                setFilter("cancelled");
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                filter === "cancelled"
                  ? "bg-white text-red-700 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Cancelled
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-5 bg-gray-200 rounded-md w-1/3" />
                  <div className="h-5 bg-gray-200 rounded-md w-1/4" />
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-8 bg-gray-200 rounded-xl mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredDeliveries.length === 0 && (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-xs">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-100">
              <Package className="w-8 h-8 text-[#FF7A30]" />
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">No deliveries found</h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto mb-6">
              {filter === "all"
                ? "You haven't accepted any orders yet. Go back to the dashboard to accept live deliveries."
                : `No deliveries with status "${filter}".`}
            </p>
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF7A30] hover:bg-[#e66a25] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md shadow-orange-500/20 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Live Orders
            </button>
          </div>
        )}

        {/* Deliveries Grid */}
        {!isLoading && currentDeliveries.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentDeliveries.map((delivery) => {
                const statusInfo = statusConfig[delivery.orderStatus] || statusConfig.preparing;
                const formattedDate = new Date(delivery.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={delivery._id}
                    className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Bar: Order ID + Status */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <span className="font-mono font-bold text-xs text-gray-400">
                            #{delivery._id.slice(-6).toUpperCase()}
                          </span>
                          <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
                            <Calendar className="w-3 h-3" />
                            <span>{formattedDate}</span>
                          </div>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${statusInfo.bg} ${statusInfo.color}`}
                        >
                          {statusInfo.icon}
                          {statusInfo.label}
                        </span>
                      </div>

                      {/* Route Details */}
                      <div className="space-y-3 my-4 relative">
                        <div className="absolute left-2 top-2.5 bottom-2.5 w-0.5 bg-gray-100" />
                        
                        {/* Pickup */}
                        <div className="flex items-start gap-3 relative z-10">
                          <div className="w-4 h-4 rounded-full bg-orange-100 border-2 border-[#FF7A30] flex items-center justify-center shrink-0 mt-0.5">
                            <Store className="w-2.5 h-2.5 text-[#FF7A30]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] uppercase font-bold text-gray-400">Pickup</p>
                            <p className="text-xs sm:text-sm font-bold text-gray-800 truncate">
                              {delivery.restaurant?.name || "Restaurant"}
                            </p>
                            {delivery.restaurant?.address && (
                              <p className="text-[11px] text-gray-500 truncate">{delivery.restaurant.address}</p>
                            )}
                          </div>
                        </div>

                        {/* Dropoff */}
                        <div className="flex items-start gap-3 relative z-10">
                          <div className="w-4 h-4 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center shrink-0 mt-0.5">
                            <MapPin className="w-2.5 h-2.5 text-green-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] uppercase font-bold text-gray-400">Dropoff</p>
                            <p className="text-xs sm:text-sm font-bold text-gray-800 truncate">
                              {delivery.user?.firstName ? `${delivery.user.firstName} ${delivery.user.lastName || ""}` : "Customer"}
                            </p>
                            <p className="text-[11px] text-gray-500 truncate">
                              {delivery.deliveryAddress?.street}, {delivery.deliveryAddress?.city}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer: Items count + Total */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {delivery.items?.length || 1} {(delivery.items?.length || 1) === 1 ? "item" : "items"}
                      </span>
                      <div className="flex items-center text-sm sm:text-base font-black text-gray-900">
                        <IndianRupee className="w-3.5 h-3.5" />
                        <span>{delivery.grandTotal}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls (Matching Customer Orders Style) */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-xl font-bold text-xs sm:text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-xs"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    const isActive = currentPage === pageNum;
                    return (
                      <button
                        type="button"
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center cursor-pointer transition-all ${
                          isActive
                            ? "bg-linear-to-r from-[#FF3D57] to-[#FF7A30] text-white shadow-md shadow-orange-500/20"
                            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-xl font-bold text-xs sm:text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-xs"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
