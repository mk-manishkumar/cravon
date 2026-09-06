"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocationStore } from "@/store/locationStore";

export const CITIES = ["Delhi", "Gurgaon", "Noida", "Hyderabad", "Bangalore", "Patna", "Mumbai", "Pune", "Kolkata", "Jaipur", "Rishikesh", "Shimla"];

export default function DesktopLocationSelector() {
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);
  const currentCity = useLocationStore((state) => state.city);
  const setCity = useLocationStore((state) => state.setCity);
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleCitySelect = (city: string) => {
    setCity(city);
    setShowCityDropdown(false);

    // redirect to home page if user change city from a specific restaurant page
    const currentPath = window.location.pathname;
    if (currentPath !== "/" && currentPath !== "/restaurants") {
      router.push("/");
    }
  };

  return (
    <div className="relative hidden md:block" onMouseEnter={() => setShowCityDropdown(true)} onMouseLeave={() => setShowCityDropdown(false)}>
      <button type="button" className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#FF3D57] transition-colors cursor-pointer">
        <span className="font-bold text-gray-500">Deliver to:</span>
        <span className="font-semibold">{mounted ? currentCity : "..."}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* City Dropdown Menu */}
      {showCityDropdown && (
        <div className="absolute right-0 top-full pt-2 w-48 z-50">
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
            <div className="max-h-64 overflow-y-auto">
              {CITIES.map((city) => (
                <button type="button" key={city} onClick={() => handleCitySelect(city)} className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer ${currentCity === city ? "bg-[#FFF1F0] text-[#FF3D57] font-bold" : "text-gray-700 hover:bg-gray-50 hover:text-[#FF3D57]"}`}>
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
