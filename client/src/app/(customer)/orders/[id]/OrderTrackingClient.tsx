"use client";

import { useParams } from "next/navigation";
import { useOrderTracking } from "@/hooks/useOrderTracking";
import MapTracking from "@/components/orders/MapTracking";
import TrackingHeader from "@/components/orders/tracking/TrackingHeader";
import TrackingLoadingState from "@/components/orders/tracking/TrackingLoadingState";
import TrackingNotFoundState from "@/components/orders/tracking/TrackingNotFoundState";
import TrackingStatusCard from "@/components/orders/tracking/TrackingStatusCard";
import TrackingStatusBanner from "@/components/orders/tracking/TrackingStatusBanner";
import TrackingDriverCard from "@/components/orders/tracking/TrackingDriverCard";
import TrackingOrderSummary from "@/components/orders/tracking/TrackingOrderSummary";

export default function OrderTrackingClient() {
  const { id } = useParams();
  const { order, isLoading, error, timeLeft } = useOrderTracking(id as string);

  if (isLoading) {
    return <TrackingLoadingState />;
  }

  if (error || !order) {
    return <TrackingNotFoundState />;
  }

  // Fallback coordinates in case database locations are still mock strings
  const restaurantCoords: [number, number] = order.restaurant?.location?.coordinates
    ? [order.restaurant.location.coordinates[1], order.restaurant.location.coordinates[0]] // GeoJSON [lng, lat] -> Leaflet [lat, lng]
    : [19.076, 72.8777]; // Default Mumbai

  const userCoords: [number, number] = [19.08, 72.88]; // Nearby home demo coordinates

  const driverCoords: [number, number] | undefined =
    order.driver?.location?.latitude && order.driver?.location?.longitude
      ? [order.driver.location.latitude, order.driver.location.longitude]
      : undefined;

  const isDelivered = order.orderStatus === "delivered";
  const isCancelled = order.orderStatus === "cancelled";

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      <TrackingHeader orderId={order._id} />

      <main className="max-w-3xl mx-auto p-4 space-y-4">
        {/* Dynamic Countdown Header */}
        {!isDelivered && !isCancelled && (
          <TrackingStatusCard hasDriver={Boolean(order.driver)} timeLeft={timeLeft} />
        )}

        {/* Celebration Banner for Completed Orders */}
        {isDelivered && (
          <TrackingStatusBanner status="delivered" restaurantName={order.restaurant?.name} />
        )}

        {/* Banner for Cancelled Orders */}
        {isCancelled && <TrackingStatusBanner status="cancelled" />}

        {/* Live Interactive Map */}
        <div className="bg-white p-2 rounded-3xl shadow-sm border border-zinc-200/80 overflow-hidden">
          <MapTracking
            restaurantLocation={restaurantCoords}
            userLocation={userCoords}
            driverLocation={driverCoords}
            status={order.orderStatus}
          />
        </div>

        {/* Delivery Partner Details Card */}
        <TrackingDriverCard driver={order.driver} />

        {/* Order Items & Summary */}
        <TrackingOrderSummary items={order.items || []} grandTotal={order.grandTotal} />
      </main>
    </div>
  );
}
