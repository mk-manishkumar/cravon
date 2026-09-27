import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import api from "../lib/axios";
import { LogOut, MapPin, Package, Navigation, CheckCircle2 } from "lucide-react";

export default function Dashboard() {
  const { driver, logout } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(driver?.isAvailable || false);

  useEffect(() => {
    if (!driver) {
      navigate("/login");
      return;
    }
    fetchOrders();
    const interval = setInterval(fetchOrders, 15000);
    return () => clearInterval(interval);
  }, [driver]);

  useEffect(() => {
    // Fake background GPS tracking for internship
    let geoInterval: any;
    if (isOnline && driver) {
      geoInterval = setInterval(() => {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition((position) => {
            // Silently send location to backend
            api.post("/driver/location", {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }).catch((err) => {
              // Silently ignore background location errors to prevent popup spam
              console.warn("Background GPS sync failed:", err);
            });
          });
        }
      }, 15000);
    }
    return () => clearInterval(geoInterval);
  }, [isOnline, driver]);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/driver/orders");
      setOrders(res.data.data);
    } catch (err) {
      console.error("Failed to fetch driver orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async () => {
    try {
      const newStatus = !isOnline;
      await api.put("/driver/status", { isAvailable: newStatus });
      setIsOnline(newStatus);
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status");
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.put(`/driver/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (err) {
      console.error("Failed to update order status:", err);
      alert("Failed to update order");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!driver) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="font-bold text-gray-700">{driver.firstName?.[0]}</span>
          </div>
          <div>
            <h1 className="font-bold text-gray-900 leading-tight">{driver.firstName}</h1>
            <p className="text-xs text-gray-500">Driver Mode</p>
          </div>
        </div>
        <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-gray-800 bg-gray-50 rounded-full">
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Online Toggle */}
      <div className="bg-white p-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-gray-900">Duty Status</h2>
          <p className="text-xs text-gray-500">
            {isOnline ? "You are online and visible" : "You are currently offline"}
          </p>
        </div>
        <button
          onClick={toggleStatus}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
            isOnline ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
              isOnline ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Orders List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        <h2 className="font-bold text-gray-900 text-lg mb-2">Available Deliveries</h2>
        
        {loading && (
          <p className="text-center text-gray-500 py-8">Looking for orders...</p>
        )}
        
        {!loading && orders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No active deliveries</p>
          </div>
        )}
        
        {!loading && orders.length > 0 && (
          orders.map((order) => (
            <div key={order._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-md mb-2">
                    {order.orderStatus.toUpperCase()}
                  </span>
                  <h3 className="font-bold text-gray-900">Order #{order._id.slice(-6)}</h3>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-lg text-gray-900">₹{order.grandTotal}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6 relative">
                <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-gray-200" />
                <div className="flex gap-3 relative z-10">
                  <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Pickup</p>
                    <p className="text-sm font-semibold text-gray-900">{order.restaurant?.name || "Restaurant"}</p>
                  </div>
                </div>
                <div className="flex gap-3 relative z-10">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Dropoff</p>
                    <p className="text-sm font-semibold text-gray-900">{order.user?.firstName || "Customer"}</p>
                    <p className="text-xs text-gray-500">{order.deliveryAddress?.street || "Address hidden"}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${order.deliveryAddress?.latitude},${order.deliveryAddress?.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-sm font-bold transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  Navigate
                </a>
                
                {(order.orderStatus === "ready" || order.orderStatus === "preparing") && (
                  <button
                    onClick={() => updateOrderStatus(order._id, "out_for_delivery")}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-[#FF7A30] hover:bg-[#e66a25] text-white rounded-xl text-sm font-bold transition-colors shadow-sm shadow-orange-200"
                  >
                    Accept Order
                  </button>
                )}
                
                {order.orderStatus === "out_for_delivery" && (
                  <button
                    onClick={() => updateOrderStatus(order._id, "delivered")}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-bold transition-colors shadow-sm shadow-green-200"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Delivered
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
