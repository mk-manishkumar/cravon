"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Dynamically import MapComponent to disable Server-Side Rendering
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-75 bg-zinc-100 flex flex-col items-center justify-center rounded-2xl border border-zinc-200">
      <Loader2 className="w-8 h-8 animate-spin text-orange-500 mb-2" />
      <p className="text-xs text-zinc-500 font-medium">Loading live map...</p>
    </div>
  ),
});

interface MapTrackingProps {
  restaurantLocation: [number, number];
  userLocation: [number, number];
  driverLocation?: [number, number];
  status: string;
}

export default function MapTracking(props: Readonly<MapTrackingProps>) {
  return (
    <div className="w-full h-88 relative">
      <MapComponent {...props} />
    </div>
  );
}
