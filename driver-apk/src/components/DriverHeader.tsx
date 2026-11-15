import { Bike, MapPin } from "lucide-react";
import type { Driver } from "../store/authStore";
import CitySelector from "./CitySelector";
import DriverAvatarDropdown from "./DriverAvatarDropdown";

interface DriverHeaderProps {
  driver: Driver;
  isOnline: boolean;
  onToggleStatus: () => void;
  onSelectCity: (city: string) => void;
  onOpenEditProfile: () => void;
  onOpenDeliveries: () => void;
  onOpenChangePassword: () => void;
  onOpenDeleteAccount: () => void;
  onLogout: () => void;
  isCityUpdating?: boolean;
}

export default function DriverHeader({ driver, isOnline, onToggleStatus, onSelectCity, onOpenEditProfile, onOpenDeliveries, onOpenChangePassword, onOpenDeleteAccount, onLogout, isCityUpdating = false }: DriverHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
      {/* Main Top Row */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-r from-[#FF3D57] to-[#FF7A30] rounded-xl flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0">
            <Bike className="w-4 h-4 sm:w-5 sm:h-5 text-white -rotate-12" />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm sm:text-base text-gray-900 tracking-tight">
                Cravon<span className="text-[#FF7A30]">Partner</span>
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Driver Portal</span>
          </div>
        </div>

        {/* Center: Desktop City Selector */}
        <div className="hidden sm:flex items-center">
          <CitySelector currentCity={driver.city || "Patna"} onSelectCity={onSelectCity} isLoading={isCityUpdating} />
        </div>

        {/* Right: Duty Switch + Driver Avatar Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Duty Switch */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2 sm:px-2.5 py-1 rounded-full shrink-0">
            <span className={`w-2 h-2 rounded-full shrink-0 ${isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
            <span className="text-[10px] sm:text-xs font-bold text-gray-700 hidden xs:inline">{isOnline ? "Online" : "Offline"}</span>
            <button type="button" onClick={onToggleStatus} className={`relative inline-flex h-4.5 sm:h-5 w-8 sm:w-9.5 items-center rounded-full transition-colors cursor-pointer shrink-0 ${isOnline ? "bg-green-500" : "bg-gray-300"}`} title={isOnline ? "Go Offline" : "Go Online"}>
              <span className={`inline-block h-3.5 sm:h-4 w-3.5 sm:w-4 transform rounded-full bg-white shadow-xs transition-transform ${isOnline ? "translate-x-4 sm:translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>

          {/* Profile Avatar Dropdown */}
          <div className="shrink-0">
            <DriverAvatarDropdown driver={driver} onOpenEditProfile={onOpenEditProfile} onOpenDeliveries={onOpenDeliveries} onOpenChangePassword={onOpenChangePassword} onOpenDeleteAccount={onOpenDeleteAccount} onLogout={onLogout} />
          </div>
        </div>
      </div>

      {/* Mobile Sub-strip: Operational City */}
      <div className="sm:hidden px-3.5 py-1.5 bg-gray-50/90 border-t border-gray-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-gray-500 font-medium">
          <MapPin className="w-3.5 h-3.5 text-[#FF7A30] shrink-0" />
          <span className="text-[11px] text-gray-500">Operating City:</span>
        </div>
        <CitySelector currentCity={driver.city || "Patna"} onSelectCity={onSelectCity} isLoading={isCityUpdating} />
      </div>
    </header>
  );
}
