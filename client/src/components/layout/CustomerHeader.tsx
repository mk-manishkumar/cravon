"use client";

import Link from "next/link";
import { useState } from "react";
import DesktopLocationSelector from "./customer-header/DesktopLocationSelector";
import DesktopAuthDropdown from "./customer-header/DesktopAuthDropdown";
import MobileNavMenu from "./customer-header/MobileNavMenu";
import CartIconBadge from "./customer-header/CartIconBadge";

export default function CustomerHeader() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const displayFont = "'Baloo 2', 'Poppins', 'Segoe UI', sans-serif";

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
            <DesktopLocationSelector />
            <CartIconBadge />
            <DesktopAuthDropdown />

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
      <MobileNavMenu showMobileMenu={showMobileMenu} setShowMobileMenu={setShowMobileMenu} />
    </header>
  );
}
