import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import type { Driver } from "../store/authStore";
import api from "../lib/axios";
import DriverHeader from "../components/DriverHeader";
import EditProfileModal from "../components/EditProfileModal";
import ChangePasswordModal from "../components/ChangePasswordModal";
import DeleteAccountModal from "../components/DeleteAccountModal";
import MyDeliveries from "../components/MyDeliveries";
import { MapPin, Package, Navigation, CheckCircle2, Bike, Store, ArrowRight, Clock } from "lucide-react";

interface OrderRestaurant {
  name?: string;
  address?: string;
  image?: string;
  location?: {
    coordinates?: [number, number]; // [lng, lat]
  };
}

interface OrderUser {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

interface DeliveryOrderItem {
  _id?: string;
  name: string;
  price: number;
  quantity: number;
}

interface DeliveryOrder {
  _id: string;
  orderStatus: "pending" | "preparing" | "ready" | "out_for_delivery" | "delivered" | "cancelled";
  paymentStatus: string;
  paymentMethod: string;
  grandTotal: number;
  driver?: string;
  restaurant?: OrderRestaurant;
  user?: OrderUser;
  deliveryAddress?: {
    street?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  };
  items?: DeliveryOrderItem[];
  createdAt: string;
}

export default function Dashboard() {
  const { driver, logout, updateDriver } = useAuthStore();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(driver?.isAvailable || false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const [currentView, setCurrentView] = useState<"live" | "deliveries">("live");
  const [isCityUpdating, setIsCityUpdating] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await api.get("/driver/orders");
      setOrders(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch driver orders:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!driver) {
      void navigate("/login");
      return;
    }
    void fetchOrders();
    const interval = setInterval(() => {
      void fetchOrders();
    }, 15000);
    return () => clearInterval(interval);
  }, [driver, navigate, fetchOrders]);

  // Background GPS tracking simulation
  useEffect(() => {
    let geoInterval: ReturnType<typeof setInterval> | null = null;
    if (isOnline && driver) {
      geoInterval = setInterval(() => {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition((position) => {
            api
              .post("/driver/location", {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              })
              .catch((err) => {
                console.warn("Background GPS sync failed:", err);
              });
          });
        }
      }, 15000);
    }
    return () => {
      if (geoInterval) clearInterval(geoInterval);
    };
  }, [isOnline, driver]);

  const toggleStatus = async () => {
    try {
      const newStatus = !isOnline;
      await api.put("/driver/status", { isAvailable: newStatus });
      setIsOnline(newStatus);
      updateDriver({ isAvailable: newStatus });
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleSelectCity = async (city: string) => {
    try {
      setIsCityUpdating(true);
      const res = await api.put("/driver/profile", { city });
      updateDriver(res.data.data);
      // Immediately refetch orders restricted to the newly chosen city
      await fetchOrders();
    } catch (err) {
      console.error("Failed to update driver city:", err);
    } finally {
      setIsCityUpdating(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.put(`/driver/orders/${orderId}/status`, { status });
      await fetchOrders();
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  const handleLogout = () => {
    logout();
    void navigate("/login");
  };

  if (!driver) return null;

  // Render My Deliveries view when selected
  if (currentView === "deliveries") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <DriverHeader
          driver={driver}
          isOnline={isOnline}
          onToggleStatus={toggleStatus}
          onSelectCity={handleSelectCity}
          onOpenEditProfile={() => setIsEditProfileOpen(true)}
          onOpenDeliveries={() => setCurrentView("deliveries")}
          onOpenChangePassword={() => setIsChangePasswordOpen(true)}
          onOpenDeleteAccount={() => setIsDeleteAccountOpen(true)}
          onLogout={handleLogout}
          isCityUpdating={isCityUpdating}
        />
        <MyDeliveries onBack={() => setCurrentView("live")} />

        <EditProfileModal
          driver={driver}
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          onSuccess={(updated: Driver) => {
            updateDriver(updated);
            void fetchOrders();
          }}
        />

        <ChangePasswordModal
          isOpen={isChangePasswordOpen}
          onClose={() => setIsChangePasswordOpen(false)}
        />

        <DeleteAccountModal
          isOpen={isDeleteAccountOpen}
          onClose={() => setIsDeleteAccountOpen(false)}
          onSuccess={handleLogout}
        />
      </div>
    );
  }

  // Split orders into active assigned and available in city
  const myAssignedOrders = orders.filter((o) => o.driver === driver._id && o.orderStatus !== "delivered" && o.orderStatus !== "cancelled");
  const availableOrders = orders.filter((o) => !o.driver && (o.orderStatus === "preparing" || o.orderStatus === "ready"));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Responsive Header with City Selector, Duty Toggle, Avatar Dropdown */}
      <DriverHeader
        driver={driver}
        isOnline={isOnline}
        onToggleStatus={toggleStatus}
        onSelectCity={handleSelectCity}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
        onOpenDeliveries={() => setCurrentView("deliveries")}
        onOpenChangePassword={() => setIsChangePasswordOpen(true)}
        onOpenDeleteAccount={() => setIsDeleteAccountOpen(true)}
        onLogout={handleLogout}
        isCityUpdating={isCityUpdating}
      />

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto w-full p-4 sm:p-6 space-y-6 flex-1">
        {/* Banner with City & Duty Alert */}
        <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isOnline ? "bg-green-50 text-green-600 border border-green-200" : "bg-gray-100 text-gray-400"}`}>
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-gray-900">
                  {isOnline ? "You are Online & Ready" : "You are currently Offline"}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-[#FF7A30]">
                  City: {driver.city || "Patna"}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {isOnline
                  ? `Receiving delivery orders exclusively in ${driver.city || "Patna"}`
                  : "Turn on Duty Status to start receiving delivery orders nearby"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setCurrentView("deliveries")}
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer"
            >
              <Package className="w-4 h-4 text-[#FF7A30]" />
              <span>My Deliveries</span>
              <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Section 1: Active In-Progress Deliveries */}
        {myAssignedOrders.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                Active Deliveries ({myAssignedOrders.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myAssignedOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white rounded-3xl p-5 border-2 border-purple-200 shadow-md shadow-purple-500/5 space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-block px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-black rounded-lg mb-1">
                        IN PROGRESS
                      </span>
                      <h3 className="font-bold text-gray-900 text-sm">Order #{order._id.slice(-6).toUpperCase()}</h3>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-lg text-gray-900">₹{order.grandTotal}</p>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">{order.paymentMethod}</span>
                    </div>
                  </div>

                  {/* Route Timeline */}
                  <div className="space-y-3 relative my-3">
                    <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-gray-200" />
                    
                    {/* Pickup */}
                    <div className="flex gap-3 relative z-10">
                      <div className="w-5 h-5 bg-[#FF7A30] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <Store className="w-3 h-3 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Pickup Location</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{order.restaurant?.name || "Restaurant"}</p>
                        {order.restaurant?.address && (
                          <p className="text-xs text-gray-500 truncate">{order.restaurant.address}</p>
                        )}
                      </div>
                    </div>

                    {/* Dropoff */}
                    <div className="flex gap-3 relative z-10">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin className="w-3 h-3 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Customer Dropoff</p>
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {order.user?.firstName ? `${order.user.firstName} ${order.user.lastName || ""}` : "Customer"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${order.deliveryAddress?.latitude || 0},${order.deliveryAddress?.longitude || 0}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer"
                    >
                      <Navigation className="w-4 h-4 text-blue-600" />
                      Navigate
                    </a>

                    {order.orderStatus === "out_for_delivery" && (
                      <button
                        type="button"
                        onClick={() => updateOrderStatus(order._id, "delivered")}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-md shadow-green-600/20 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Delivered
                      </button>
                    )}

                    {(order.orderStatus === "ready" || order.orderStatus === "preparing") && (
                      <button
                        type="button"
                        onClick={() => updateOrderStatus(order._id, "out_for_delivery")}
                        className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-md shadow-purple-600/20 cursor-pointer"
                      >
                        <Bike className="w-4 h-4" />
                        Start Delivery
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 2: Available City Deliveries */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
                <Store className="w-5 h-5 text-[#FF7A30]" />
                Available in {driver.city || "Patna"} ({availableOrders.length})
              </h2>
              <p className="text-xs text-gray-500">Orders ready for delivery partners to accept</p>
            </div>
          </div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs animate-pulse">
                  <div className="h-5 bg-gray-200 rounded-md w-1/3 mb-4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && availableOrders.length === 0 && (
            <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200 shadow-xs p-6">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="font-bold text-gray-800 text-base">No available orders right now</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                There are no open orders in {driver.city || "Patna"} at the moment. Orders will appear automatically as customers place them.
              </p>
            </div>
          )}

          {!loading && availableOrders.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableOrders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white p-5 rounded-3xl shadow-xs border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="inline-block px-2 py-0.5 bg-orange-100 text-[#FF7A30] text-[11px] font-bold rounded-md mb-1">
                          READY FOR PICKUP
                        </span>
                        <h3 className="font-bold text-gray-900 text-sm">Order #{order._id.slice(-6).toUpperCase()}</h3>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-base sm:text-lg text-gray-900">₹{order.grandTotal}</p>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{order.paymentMethod}</span>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-3 relative my-3">
                      <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-gray-200" />
                      
                      <div className="flex gap-3 relative z-10">
                        <div className="w-5 h-5 bg-[#FF7A30] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <Store className="w-3 h-3 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Pickup</p>
                          <p className="text-sm font-bold text-gray-900 truncate">{order.restaurant?.name || "Restaurant"}</p>
                          {order.restaurant?.address && (
                            <p className="text-xs text-gray-500 truncate">{order.restaurant.address}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-3 relative z-10">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <MapPin className="w-3 h-3 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Dropoff</p>
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {order.user?.firstName ? `${order.user.firstName} ${order.user.lastName || ""}` : "Customer"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100 mt-2">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${order.deliveryAddress?.latitude || 0},${order.deliveryAddress?.longitude || 0}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      Map
                    </a>

                    <button
                      type="button"
                      onClick={() => updateOrderStatus(order._id, "out_for_delivery")}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-linear-to-r from-[#FF3D57] to-[#FF7A30] hover:from-[#e22b45] hover:to-[#e06020] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-500/20 cursor-pointer"
                    >
                      Accept Order
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Edit Profile Modal */}
      <EditProfileModal
        driver={driver}
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onSuccess={(updated: Driver) => {
          updateDriver(updated);
          void fetchOrders();
        }}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={isDeleteAccountOpen}
        onClose={() => setIsDeleteAccountOpen(false)}
        onSuccess={handleLogout}
      />
    </div>
  );
}
