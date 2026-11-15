import { useEffect } from "react";
import api from "../lib/axios";
import type { Driver } from "../store/authStore";

export function useDriverLocationTracking(driver: Driver | null, isOnline: boolean) {
  useEffect(() => {
    let geoInterval: ReturnType<typeof setInterval> | null = null;

    if (isOnline && driver) {
      geoInterval = setInterval(() => {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              api
                .post("/driver/location", {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                })
                .catch((err) => {
                  console.warn("Background GPS sync failed:", err);
                });
            },
            (error) => {
              console.warn("Geolocation acquisition error:", error.message);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 10000,
            },
          );
        }
      }, 15000);
    }

    return () => {
      if (geoInterval) clearInterval(geoInterval);
    };
  }, [isOnline, driver]);
}
