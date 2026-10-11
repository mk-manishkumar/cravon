"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";

// Fix Leaflet's default icon paths
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom Icons
const restaurantIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3170/3170733.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const homeIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/10473/10473299.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const driverIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/2972/2972185.png",
  iconSize: [50, 50],
  iconAnchor: [25, 25],
  popupAnchor: [0, -25],
});

interface MapComponentProps {
  readonly restaurantLocation: [number, number];
  readonly userLocation: [number, number];
  readonly driverLocation?: [number, number];
  readonly status: string;
}

export default function MapComponent({ restaurantLocation, userLocation, driverLocation, status }: Readonly<MapComponentProps>) {
  const [map, setMap] = useState<L.Map | null>(null);

  // Center map logically based on status
  const center: [number, number] = status === "out_for_delivery" && driverLocation ? driverLocation : restaurantLocation;

  useEffect(() => {
    if (map) {
      if (status === "out_for_delivery" && driverLocation) {
        map.setView(driverLocation, 15, { animate: true });
      } else {
        // Fit bounds to show both restaurant and user
        const bounds = L.latLngBounds(restaurantLocation, userLocation);
        map.fitBounds(bounds, { padding: [50, 50], animate: true });
      }
    }
  }, [map, status, driverLocation, restaurantLocation, userLocation]);

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-zinc-200 shadow-inner">
      <MapContainer center={center} zoom={14} style={{ height: "100%", width: "100%" }} ref={setMap} zoomControl={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Restaurant Marker */}
        <Marker position={restaurantLocation} icon={restaurantIcon}>
          <Popup className="font-bold">Pickup: Restaurant</Popup>
        </Marker>

        {/* User Home Marker */}
        <Marker position={userLocation} icon={homeIcon}>
          <Popup className="font-bold">Dropoff: Your Location</Popup>
        </Marker>

        {/* Driver Marker */}
        {driverLocation && status !== "delivered" && (
          <Marker position={driverLocation} icon={driverIcon}>
            <Popup className="font-bold text-orange-500">Delivery Partner</Popup>
          </Marker>
        )}

        {/* Route Line (Simple straight line for visualization) */}
        <Polyline positions={[restaurantLocation, userLocation]} color="#FF7A30" weight={3} dashArray="10, 10" opacity={0.5} />

        {driverLocation && status === "out_for_delivery" && <Polyline positions={[driverLocation, userLocation]} color="#FF7A30" weight={4} />}
      </MapContainer>
    </div>
  );
}
