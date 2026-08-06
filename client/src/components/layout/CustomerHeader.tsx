"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

export default function CustomerHeader() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [showDropdown, setShowDropdown] = useState(false);

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

          {/* Navigation */}
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

          {/* Right side (Auth / Profile) */}
          <div className="flex items-center gap-4">
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
                          <p className="text-[15px] font-bold text-gray-800 capitalize">{user.firstName} {user.lastName}</p>
                        </div>
                        <div className="py-2">
                          <Link href="/profile" className="flex items-center gap-3 px-5 py-2.5 text-[14px] text-gray-700 hover:bg-[#FFFBF8] hover:text-[#FF3D57] transition-colors">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                            View Profile
                          </Link>
                          <Link href="/settings" className="flex items-center gap-3 px-5 py-2.5 text-[14px] text-gray-700 hover:bg-[#FFFBF8] hover:text-[#FF3D57] transition-colors">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                            Account Settings
                          </Link>
                          <div className="w-full h-px bg-gray-50 my-2" />
                          <button 
                            type="button"
                            onClick={() => logout()}
                            className="flex items-center gap-3 w-full text-left px-5 py-2.5 text-[14px] text-[#FF3D57] hover:bg-[#FFF1F0] transition-colors cursor-pointer"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                            Log out
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/auth/login" className="hidden sm:block text-[14px] font-bold text-[#8A6F68] hover:text-[#FF3D57] transition-colors px-3 py-2">
                    Sign In
                  </Link>
                  <Link href="/auth/register" className="text-[14px] font-bold text-white bg-linear-to-r from-[#FF3D57] to-[#FF7A30] hover:from-[#E22B45] hover:to-[#E06020] px-5 py-2.5 rounded-full shadow-md transition-all active:scale-95">
                    Sign Up
                  </Link>
                </div>
              ))}
          </div>
        </div>
      </div>
    </header>
  );
}
