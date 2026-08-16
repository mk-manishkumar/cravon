import { MapPin, Clock, Store, Pencil, Trash2, Utensils, Play, Pause, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly restaurant: any;
  readonly isOnboarded: boolean;
  readonly onEdit: () => void;
  readonly onDelete: () => void;
  readonly onToggleStatus?: () => void;
  readonly isDeleting: boolean;
  readonly isTogglingStatus?: boolean;
}

export default function RestaurantProfileCard({ restaurant, isOnboarded, onEdit, onDelete, onToggleStatus, isDeleting, isTogglingStatus }: Props) {
  const isActive = restaurant?.status === "active";

  return (
    <div className="bg-[#111] border border-[#222] rounded-4xl p-5 relative overflow-hidden flex flex-col h-full">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF7A30]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex-1">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#1A1A1A] rounded-2xl border border-[#333] flex items-center justify-center text-[#FF7A30] overflow-hidden relative shrink-0">
              {restaurant?.image ? <Image src={restaurant.image} alt={restaurant?.name || "Logo"} fill className="object-cover" sizes="56px" /> : <Store size={24} />}
            </div>
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                {restaurant?.name || "Your Restaurant"}
                {restaurant?.userRole && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    restaurant.userRole === "Owner" ? "bg-[#FF7A30]/20 text-[#FF7A30]" :
                    restaurant.userRole === "Manager" ? "bg-purple-500/20 text-purple-400" :
                    "bg-blue-500/20 text-blue-400"
                  }`}>
                    {restaurant.userRole}
                  </span>
                )}
              </h2>
              {restaurant?.franchiseName && <p className="text-[13px] font-semibold text-[#FF7A30]">{restaurant.franchiseName}</p>}
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${isActive ? "bg-[#00C853]/10 text-[#00C853] border border-[#00C853]/20" : "bg-red-500/10 text-red-500 border border-red-500/20"}`}>
                  {restaurant?.status || "PENDING"}
                </span>
                {!isOnboarded && <span className="text-[10px] text-[#888]">(Pending Onboarding)</span>}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {!isOnboarded ? (
              <button
                type="button"
                onClick={onEdit}
                className="cursor-pointer px-4 py-2 bg-[#FF7A30]/10 text-[#FF7A30] hover:bg-[#FF7A30]/20 rounded-xl text-xs font-bold transition-all border border-[#FF7A30]/20 flex items-center gap-1.5"
              >
                Complete Onboarding
              </button>
            ) : (
              <>
                <button type="button" className="cursor-pointer p-2 bg-[#1A1A1A] border border-[#333] hover:border-[#FF7A30] hover:text-[#FF7A30] text-[#888] rounded-xl transition-all" onClick={onEdit} title="Edit Restaurant">
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  className="cursor-pointer p-2 bg-[#1A1A1A] border border-[#333] hover:border-red-500 hover:text-red-500 text-[#888] rounded-xl transition-all disabled:opacity-50"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete your restaurant? This action cannot be undone.")) {
                      onDelete();
                    }
                  }}
                  title="Delete Restaurant"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Profile Details Stack */}
        <div className="space-y-5">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#1A1A1A] rounded-lg text-[#666] shrink-0">
              <MapPin size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#666] uppercase tracking-wider mb-0.5">Address</p>
              <p className="text-xs text-[#CCC] leading-relaxed">{restaurant?.address || "Address not provided yet"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#1A1A1A] rounded-lg text-[#666] shrink-0">
              <Clock size={16} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#666] uppercase tracking-wider mb-0.5">Operating Days</p>
              <p className="text-xs text-[#CCC] leading-relaxed">{restaurant?.operatingDays?.length > 0 ? restaurant.operatingDays.join(", ") : "Not specified"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#1A1A1A] rounded-lg text-[#666] shrink-0">
              <Utensils size={16} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-[#666] uppercase tracking-wider mb-1.5">Meal Timings</p>
              <div className="space-y-1.5 text-xs text-[#CCC] w-full">
                {restaurant?.mealTimings?.breakfast?.open && (
                  <div className="flex justify-between gap-4 max-w-50">
                    <span className="text-[#888]">Breakfast:</span>
                    <span className="font-medium">
                      {restaurant.mealTimings.breakfast.open} - {restaurant.mealTimings.breakfast.close}
                    </span>
                  </div>
                )}
                {restaurant?.mealTimings?.lunch?.open && (
                  <div className="flex justify-between gap-4 max-w-50">
                    <span className="text-[#888]">Lunch:</span>
                    <span className="font-medium">
                      {restaurant.mealTimings.lunch.open} - {restaurant.mealTimings.lunch.close}
                    </span>
                  </div>
                )}
                {restaurant?.mealTimings?.dinner?.open && (
                  <div className="flex justify-between gap-4 max-w-50">
                    <span className="text-[#888]">Dinner:</span>
                    <span className="font-medium">
                      {restaurant.mealTimings.dinner.open} - {restaurant.mealTimings.dinner.close}
                    </span>
                  </div>
                )}
                {!restaurant?.mealTimings?.breakfast?.open && !restaurant?.mealTimings?.lunch?.open && !restaurant?.mealTimings?.dinner?.open && <span>Not specified</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Actions */}
      {isOnboarded && (
        <div className="mt-6 pt-5 border-t border-[#222] flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onToggleStatus}
            disabled={isTogglingStatus}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer ${
              isActive 
                ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20" 
                : "bg-[#00C853]/10 text-[#00C853] hover:bg-[#00C853]/20"
            }`}
          >
            {isActive ? <Pause size={14} /> : <Play size={14} />}
            {isActive ? "Pause Orders" : "Accept Orders"}
          </button>

          <Link
            href={`/partner/restaurants/${restaurant?._id || ''}`}
            className="flex items-center gap-2 px-4 py-2 bg-[#FF7A30]/10 text-[#FF7A30] hover:bg-[#FF7A30]/20 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            View Menu <ChevronRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
}
