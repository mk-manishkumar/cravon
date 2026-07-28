"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

export default function PartnerHeader() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [showDropdown, setShowDropdown] = useState(false);

  const displayFont = "'Baloo 2', 'Poppins', 'Segoe UI', sans-serif";

  return (
    <header className="sticky top-0 z-50 w-full bg-[#121212]/90 backdrop-blur-md border-b border-[#222222]">
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/partner/dashboard" className="flex items-center gap-2">
            <span className="text-[22px] font-extrabold bg-clip-text text-transparent" style={{ fontFamily: displayFont, backgroundImage: "linear-gradient(135deg, #FF3D57 0%, #FF7A30 55%, #FFC93C 100%)" }}>
              Cravon Partners
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex gap-8">
            <Link href="/partner/dashboard" className="text-[13px] font-semibold text-[#888888] hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/partner/orders" className="text-[13px] font-semibold text-[#888888] hover:text-white transition-colors">
              Orders
            </Link>
            <Link href="/partner/menu" className="text-[13px] font-semibold text-[#888888] hover:text-white transition-colors">
              Menu Manager
            </Link>
          </nav>

          {/* Right side (Profile / Auth) */}
          <div className="flex items-center gap-4">
            {!isLoading && user && (
              <div className="relative" onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
                <div className="flex items-center gap-3 cursor-pointer">
                  <button className="flex items-center justify-center w-9 h-9 rounded-full bg-[#2A2A2A] border border-[#333333] text-white font-bold text-sm shadow-sm outline-none focus:border-[#FF7A30]">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </button>
                </div>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 top-full pt-2 w-56 z-50">
                    <div className="bg-[#1A1A1A] rounded-2xl shadow-2xl border border-[#333333] overflow-hidden animate-in fade-in slide-in-from-top-2">
                      <div className="px-5 py-4 bg-[#222222] border-b border-[#333333]">
                        <p className="text-[15px] font-bold text-white capitalize">
                          {user.firstName} {user.lastName}
                        </p>
                      </div>
                      <div className="py-2">
                        <Link href="/partner/settings" className="flex items-center gap-3 px-5 py-2.5 text-[13px] text-[#BBBBBB] hover:bg-[#2A2A2A] hover:text-white transition-colors">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          Restaurant Settings
                        </Link>
                        <div className="w-full h-px bg-[#333333] my-2" />
                        <button onClick={() => logout()} className="flex items-center gap-3 w-full text-left px-5 py-2.5 text-[13px] text-[#FF6B7D] hover:bg-[#3A1515] transition-colors cursor-pointer">
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
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
