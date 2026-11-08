import { Bike } from "lucide-react";
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

export default function DriverHeader({
  driver,
  isOnline,
  onToggleStatus,
  onSelectCity,
  onOpenEditProfile,
  onOpenDeliveries,
  onOpenChangePassword,
  onOpenDeleteAccount,
  onLogout,
  isCityUpdating = false,
}: DriverHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand / Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-linear-to-r from-[#FF3D57] to-[#FF7A30] rounded-xl flex items-center justify-center shadow-md shadow-orange-500/20">
            <Bike className="w-5 h-5 sm:w-6 sm:h-6 text-white -rotate-12" />
          </div>
          <div>
            <span className="font-black text-sm sm:text-base text-gray-900 tracking-tight leading-none block">
              Cravon<span className="text-[#FF7A30]">Partner</span>
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Driver App</span>
          </div>
        </div>

        {/* Center: City Selector (Kept completely separate from avatar) */}
        <div className="flex items-center">
          <CitySelector
            currentCity={driver.city || "Patna"}
            onSelectCity={onSelectCity}
            isLoading={isCityUpdating}
          />
        </div>

        {/* Right: Duty Status Toggle + Driver Avatar Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Duty Status Pill / Switch */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-50 border border-gray-200 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
            <span
              className={`w-2 h-2 rounded-full ${
                isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"
              }`}
            />
            <span className="text-[11px] sm:text-xs font-bold text-gray-700 hidden xs:inline">
              {isOnline ? "Online" : "Offline"}
            </span>
            <button
              type="button"
              onClick={onToggleStatus}
              className={`relative inline-flex h-5 sm:h-6 w-9 sm:w-11 items-center rounded-full transition-colors cursor-pointer ${
                isOnline ? "bg-green-500" : "bg-gray-300"
              }`}
              title={isOnline ? "Click to go Offline" : "Click to go Online"}
            >
              <span
                className={`inline-block h-3.5 sm:h-4 w-3.5 sm:w-4 transform rounded-full bg-white shadow-xs transition-transform ${
                  isOnline ? "translate-x-4.5 sm:translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Profile Avatar Dropdown */}
          <DriverAvatarDropdown
            driver={driver}
            onOpenEditProfile={onOpenEditProfile}
            onOpenDeliveries={onOpenDeliveries}
            onOpenChangePassword={onOpenChangePassword}
            onOpenDeleteAccount={onOpenDeleteAccount}
            onLogout={onLogout}
          />
        </div>
      </div>
    </header>
  );
}
