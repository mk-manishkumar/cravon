import { useState, useRef, useEffect } from "react";
import { LogOut, Package, User, ChevronDown, KeyRound, Trash2 } from "lucide-react";
import type { Driver } from "../store/authStore";

interface DriverAvatarDropdownProps {
  driver: Driver;
  onOpenEditProfile: () => void;
  onOpenDeliveries: () => void;
  onOpenChangePassword: () => void;
  onOpenDeleteAccount: () => void;
  onLogout: () => void;
}

export default function DriverAvatarDropdown({
  driver,
  onOpenEditProfile,
  onOpenDeliveries,
  onOpenChangePassword,
  onOpenDeleteAccount,
  onLogout,
}: DriverAvatarDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = `${driver.firstName?.[0] || ""}${driver.lastName?.[0] || ""}`.toUpperCase() || "D";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-[#FF7A30]/30 transition-all cursor-pointer focus:outline-none"
        title="Driver Account Menu"
      >
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-linear-to-br from-[#FF3D57] to-[#FF7A30] text-white font-bold text-sm sm:text-base flex items-center justify-center shadow-md overflow-hidden shrink-0 border border-white">
          {driver.profilePicture ? (
            <img
              src={driver.profilePicture}
              alt={`${driver.firstName} ${driver.lastName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-500 hidden sm:block transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          {/* Header */}
          <div className="px-5 py-3.5 bg-gray-50 border-b border-gray-100">
            <p className="text-sm font-bold text-gray-800 capitalize truncate">
              {driver.firstName} {driver.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate mt-0.5">{driver.email}</p>
            {driver.vehicleDetails && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-orange-100/70 text-[#FF7A30] text-[10px] font-bold rounded-md truncate max-w-full">
                {driver.vehicleDetails}
              </span>
            )}
          </div>

          {/* Menu Items */}
          <div className="py-1.5">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenDeliveries();
              }}
              className="flex items-center gap-3 w-full px-5 py-2.5 text-xs sm:text-sm text-gray-700 hover:bg-orange-50/60 hover:text-[#FF7A30] transition-colors cursor-pointer text-left"
            >
              <Package className="w-4 h-4 text-gray-400 group-hover:text-[#FF7A30]" />
              <span className="font-medium">My Deliveries</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenEditProfile();
              }}
              className="flex items-center gap-3 w-full px-5 py-2.5 text-xs sm:text-sm text-gray-700 hover:bg-orange-50/60 hover:text-[#FF7A30] transition-colors cursor-pointer text-left"
            >
              <User className="w-4 h-4 text-gray-400 group-hover:text-[#FF7A30]" />
              <span className="font-medium">Edit Profile</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenChangePassword();
              }}
              className="flex items-center gap-3 w-full px-5 py-2.5 text-xs sm:text-sm text-gray-700 hover:bg-orange-50/60 hover:text-[#FF7A30] transition-colors cursor-pointer text-left"
            >
              <KeyRound className="w-4 h-4 text-gray-400 group-hover:text-[#FF7A30]" />
              <span className="font-medium">Change Password</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onOpenDeleteAccount();
              }}
              className="flex items-center gap-3 w-full px-5 py-2.5 text-xs sm:text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
              <span className="font-medium">Delete Account</span>
            </button>

            <div className="w-full h-px bg-gray-100 my-1" />

            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="flex items-center gap-3 w-full px-5 py-2.5 text-xs sm:text-sm text-[#FF3D57] hover:bg-red-50 transition-colors cursor-pointer text-left font-medium"
            >
              <LogOut className="w-4 h-4 text-[#FF3D57]" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
