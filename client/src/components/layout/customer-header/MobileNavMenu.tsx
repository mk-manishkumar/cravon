"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useLocationStore } from "@/store/locationStore";
import { CITIES } from "./DesktopLocationSelector";

interface MobileNavMenuProps {
  readonly showMobileMenu: boolean;
  readonly setShowMobileMenu: (show: boolean) => void;
}

export default function MobileNavMenu({ showMobileMenu, setShowMobileMenu }: MobileNavMenuProps) {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isLoading = useAuthStore((state) => state.isLoading);

  const currentCity = useLocationStore((state) => state.city);
  const setCity = useLocationStore((state) => state.setCity);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!showMobileMenu) return null;

  const handleCitySelect = (city: string) => {
    setCity(city);
    setShowMobileMenu(false);

    const currentPath = window.location.pathname;
    if (currentPath !== "/" && currentPath !== "/restaurants") {
      router.push("/");
    }
  };

  const getMobileNavClass = () => {
    return `block w-full px-5 py-3 text-[15px] font-medium text-gray-700 hover:text-[#FF3D57] hover:bg-gray-50 transition-colors`;
  };

  return (
    <div className="md:hidden border-t border-[#F1E1D6] bg-white animate-in slide-in-from-top-2 shadow-md">
      <nav className="flex flex-col py-2">
        <Link href="/" className={getMobileNavClass()} onClick={() => setShowMobileMenu(false)}>
          Home
        </Link>
        <Link href="/restaurants" className={getMobileNavClass()} onClick={() => setShowMobileMenu(false)}>
          Restaurants
        </Link>
        <Link href="/offers" className={getMobileNavClass()} onClick={() => setShowMobileMenu(false)}>
          Offers
        </Link>

        <div className="w-full h-px bg-gray-100 my-2" />

        {/* Mobile Location Selector */}
        <div className="px-5 py-3">
          <label htmlFor="mobile-city" className="block text-sm font-bold text-gray-500 mb-2">
            Deliver to:
          </label>
          <select id="mobile-city" value={mounted ? currentCity : ""} onChange={(e) => handleCitySelect(e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-[15px] font-semibold rounded-xl focus:ring-2 focus:ring-[#FF3D57] focus:border-[#FF3D57] outline-none block p-3">
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full h-px bg-gray-100 my-2" />

        {/* Mobile Auth */}
        {!isLoading &&
          (user ? (
            <div className="py-2">
              <div className="px-5 py-2">
                <p className="text-[15px] font-bold text-gray-800 capitalize">Hi, {user.firstName}</p>
              </div>
              <Link href="/profile" className={getMobileNavClass()} onClick={() => setShowMobileMenu(false)}>
                View Profile
              </Link>
              <Link href="/account" className={getMobileNavClass()} onClick={() => setShowMobileMenu(false)}>
                Account Settings
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-5 py-3 text-[15px] font-medium text-[#FF3D57] hover:bg-[#FFF1F0] transition-colors"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="px-5 py-4">
              <Link href="/auth/login" onClick={() => setShowMobileMenu(false)} className="flex items-center justify-center w-full text-[15px] font-bold text-white bg-linear-to-r from-[#FF3D57] to-[#FF7A30] hover:from-[#E22B45] hover:to-[#E06020] px-5 py-3 rounded-xl shadow-md transition-all active:scale-95">
                Sign In
              </Link>
            </div>
          ))}
      </nav>
    </div>
  );
}
