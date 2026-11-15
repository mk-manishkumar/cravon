import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import type { Driver } from "../store/authStore";
import api from "../lib/axios";

// Layout & Modals
import DriverHeader from "../components/DriverHeader";
import EditProfileModal from "../components/EditProfileModal";
import ChangePasswordModal from "../components/ChangePasswordModal";
import DeleteAccountModal from "../components/DeleteAccountModal";
import MyDeliveries from "../components/MyDeliveries";
import LiveOrderMapModal from "../components/LiveOrderMapModal";

// Modular Dashboard Sections
import { DriverStatusBanner, ActiveDeliveriesSection, AvailableDeliveriesSection } from "../components/dashboard";

// Custom Hooks & Types
import { useDriverLocationTracking } from "../hooks/useDriverLocationTracking";
import type { DeliveryOrder } from "../types/order";

// Re-export type for backward compatibility
export type { DeliveryOrder };

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
  const [mapModalOrder, setMapModalOrder] = useState<DeliveryOrder | null>(null);
  const [mapModalMode, setMapModalMode] = useState<"pickup" | "delivery">("delivery");

  // Background GPS tracking hook
  useDriverLocationTracking(driver, isOnline);

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

  const handleOpenMap = (order: DeliveryOrder, mode: "pickup" | "delivery") => {
    setMapModalOrder(order);
    setMapModalMode(mode);
  };

  const handleLogout = () => {
    logout();
    void navigate("/login");
  };

  if (!driver) return null;

  // View: Delivery History
  if (currentView === "deliveries") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <DriverHeader driver={driver} isOnline={isOnline} onToggleStatus={toggleStatus} onSelectCity={handleSelectCity} onOpenEditProfile={() => setIsEditProfileOpen(true)} onOpenDeliveries={() => setCurrentView("deliveries")} onOpenChangePassword={() => setIsChangePasswordOpen(true)} onOpenDeleteAccount={() => setIsDeleteAccountOpen(true)} onLogout={handleLogout} isCityUpdating={isCityUpdating} />
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

        <ChangePasswordModal isOpen={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)} />

        <DeleteAccountModal isOpen={isDeleteAccountOpen} onClose={() => setIsDeleteAccountOpen(false)} onSuccess={handleLogout} />
      </div>
    );
  }

  // Filter Active vs Available
  const myAssignedOrders = orders.filter((o) => o.driver === driver._id && o.orderStatus !== "delivered" && o.orderStatus !== "cancelled");
  const availableOrders = orders.filter((o) => !o.driver && (o.orderStatus === "preparing" || o.orderStatus === "ready"));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Responsive Header */}
      <DriverHeader driver={driver} isOnline={isOnline} onToggleStatus={toggleStatus} onSelectCity={handleSelectCity} onOpenEditProfile={() => setIsEditProfileOpen(true)} onOpenDeliveries={() => setCurrentView("deliveries")} onOpenChangePassword={() => setIsChangePasswordOpen(true)} onOpenDeleteAccount={() => setIsDeleteAccountOpen(true)} onLogout={handleLogout} isCityUpdating={isCityUpdating} />

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto w-full p-4 sm:p-6 space-y-6 flex-1">
        {/* Banner with Duty Status & Navigation */}
        <DriverStatusBanner isOnline={isOnline} city={driver.city || "Patna"} onOpenDeliveries={() => setCurrentView("deliveries")} />

        {/* Section 1: Active In-Progress Deliveries */}
        <ActiveDeliveriesSection orders={myAssignedOrders} onOpenMap={handleOpenMap} onUpdateStatus={updateOrderStatus} />

        {/* Section 2: Available City Deliveries */}
        <AvailableDeliveriesSection orders={availableOrders} city={driver.city || "Patna"} loading={loading} onOpenMap={handleOpenMap} onAcceptOrder={(orderId) => updateOrderStatus(orderId, "out_for_delivery")} />
      </main>

      {/* Modals */}
      <EditProfileModal
        driver={driver}
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        onSuccess={(updated: Driver) => {
          updateDriver(updated);
          void fetchOrders();
        }}
      />

      <ChangePasswordModal isOpen={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)} />

      <DeleteAccountModal isOpen={isDeleteAccountOpen} onClose={() => setIsDeleteAccountOpen(false)} onSuccess={handleLogout} />

      {/* Live Order Map & Navigation Modal */}
      {mapModalOrder && <LiveOrderMapModal order={mapModalOrder} isOpen={!!mapModalOrder} initialMode={mapModalMode} onClose={() => setMapModalOrder(null)} />}
    </div>
  );
}
