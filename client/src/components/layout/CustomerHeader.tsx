"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useLocationStore } from "@/store/locationStore";
import { ShoppingCart } from "lucide-react";

const CITIES = ["Delhi", "Gurgaon", "Noida", "Hyderabad", "Bangalore", "Patna", "Mumbai", "Pune", "Kolkata", "Jaipur", "Rishikesh", "Shimla"];

export default function CustomerHeader() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const currentCity = useLocationStore((state) => state.city);
  const setCity = useLocationStore((state) => state.setCity);
  const router = useRouter();

  // Prevent hydration mismatch for persisted state
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const handleCitySelect = (city: string) => {
    setCity(city);
    setShowCityDropdown(false);
    setShowMobileMenu(false);

    // redirect to home page if user change city from a specific restaurant page
    const currentPath = window.location.pathname;
    if (currentPath !== "/" && currentPath !== "/restaurants") {
      router.push("/");
    }
  };

  const displayFont = "'Baloo 2', 'Poppins', 'Segoe UI', sans-serif";

  const getMobileNavClass = () => {
    return `block w-full px-5 py-3 text-[15px] font-medium text-gray-700 hover:text-[#FF3D57] hover:bg-gray-50 transition-colors`;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-[#F1E1D6] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-[26px] font-extrabold text-[#FF3D57]" style={{ fontFamily: displayFont }}>
              Cravon
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8">
            <Link href="/" className="text-[15px] font-medium text-gray-700 hover:text-[#FF3D57] transition-colors">
              Home
            </Link>
            <Link href="/restaurants" className="text-[15px] font-medium text-gray-700 hover:text-[#FF3D57] transition-colors">
              Restaurants
            </Link>
            <Link href="/offers" className="text-[15px] font-medium text-gray-700 hover:text-[#FF3D57] transition-colors">
              Offers
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Desktop Location Selector */}
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

            {/* Cart Icon (Always Visible) */}
            <Link href="/cart" className="relative flex items-center gap-2 text-gray-700 hover:text-[#FF3D57] transition-colors">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="hidden sm:block font-bold text-[14px]">Cart</span>
            </Link>

            {/* Desktop Auth */}
            <div className="hidden md:block">
              {!isLoading &&
                (user ? (
                  <div className="relative" onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
                    <button type="button" className="flex items-center justify-center w-10 h-10 rounded-full bg-linear-to-br from-[#FF3D57] to-[#FF7A30] text-white font-bold text-lg shadow-md cursor-pointer outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF3D57]">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </button>

                    {/* Dropdown Menu */}
                    {showDropdown && (
                      <div className="absolute right-0 top-full pt-2 w-56 z-50">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2">
                          <div className="px-5 py-4 bg-[#FFFBF8] border-b border-gray-50">
                            <p className="text-[15px] font-bold text-gray-800 capitalize">
                              {user.firstName} {user.lastName}
                            </p>
                          </div>
                          <div className="py-2">
                            <Link href="/profile" className="flex items-center gap-3 px-5 py-2.5 text-[14px] text-gray-700 hover:bg-[#FFFBF8] hover:text-[#FF3D57] transition-colors">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                              </svg>
                              View Profile
                            </Link>
                            <Link href="/settings" className="flex items-center gap-3 px-5 py-2.5 text-[14px] text-gray-700 hover:bg-[#FFFBF8] hover:text-[#FF3D57] transition-colors">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                              Account Settings
                            </Link>
                            <div className="w-full h-px bg-gray-50 my-2" />
                            <button type="button" onClick={() => logout()} className="flex items-center gap-3 w-full text-left px-5 py-2.5 text-[14px] text-[#FF3D57] hover:bg-[#FFF1F0] transition-colors cursor-pointer">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                              </svg>
                              Log out
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link href="/auth/login" className="text-[14px] font-bold text-white bg-linear-to-r from-[#FF3D57] to-[#FF7A30] hover:from-[#E22B45] hover:to-[#E06020] px-5 py-2.5 rounded-full shadow-md transition-all active:scale-95">
                      Sign In
                    </Link>
                  </div>
                ))}
            </div>

            {/* Hamburger Button for Mobile */}
            <button type="button" className="md:hidden flex items-center justify-center p-2 text-gray-700 hover:text-[#FF3D57] hover:bg-gray-50 rounded-lg transition-colors cursor-pointer ml-1" onClick={() => setShowMobileMenu(!showMobileMenu)} aria-label="Toggle mobile menu">
              {showMobileMenu ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
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
                  <Link href="/settings" className={getMobileNavClass()} onClick={() => setShowMobileMenu(false)}>
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
      )}
    </header>
  );
}
