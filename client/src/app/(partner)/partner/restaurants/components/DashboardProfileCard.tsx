import { MapPin, Clock, Store, Pencil, Trash2, Utensils } from "lucide-react";
import Image from "next/image";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly restaurant: any;
  readonly isOnboarded: boolean;
  readonly onEdit: () => void;
  readonly onDelete: () => void;
  readonly isDeleting: boolean;
}

export default function DashboardProfileCard({ restaurant, isOnboarded, onEdit, onDelete, isDeleting }: Props) {
  return (
    <div className="bg-[#111] border border-[#222] rounded-3xl p-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF7A30]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#1A1A1A] rounded-2xl border border-[#333] flex items-center justify-center text-[#FF7A30] overflow-hidden relative">{restaurant?.image ? <Image src={restaurant.image} alt={restaurant?.name || "Logo"} fill className="object-cover" sizes="64px" /> : <Store size={28} />}</div>
            <div>
              <h2 className="text-2xl font-bold">{restaurant?.name || "Your Restaurant"}</h2>
              {restaurant?.franchiseName && <p className="text-sm font-semibold text-[#FF7A30] mt-0.5">{restaurant.franchiseName}</p>}
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${restaurant?.status === "active" ? "bg-[#00C853]/10 text-[#00C853] border border-[#00C853]/20" : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"}`}>{restaurant?.status?.toUpperCase() || "PENDING"}</span>
                {!isOnboarded && <span className="text-xs text-[#888]">(Pending Onboarding)</span>}
              </div>
            </div>
          </div>

          {/* Edit & Delete Actions */}
          {isOnboarded && (
            <div className="flex items-center gap-3">
              <button type="button" className="cursor-pointer p-2.5 bg-[#1A1A1A] border border-[#333] hover:border-[#FF7A30] hover:text-[#FF7A30] text-[#888] rounded-xl transition-all" onClick={onEdit} title="Edit Restaurant">
                <Pencil size={18} />
              </button>
              <button
                type="button"
                disabled={isDeleting}
                className="cursor-pointer p-2.5 bg-[#1A1A1A] border border-[#333] hover:border-red-500 hover:text-red-500 text-[#888] rounded-xl transition-all disabled:opacity-50"
                onClick={() => {
                  if (confirm("Are you sure you want to delete your restaurant? This action cannot be undone.")) {
                    onDelete();
                  }
                }}
                title="Delete Restaurant"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#1A1A1A] rounded-lg text-[#666]">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#666] uppercase tracking-wider mb-1">Address</p>
              <p className="text-sm text-[#CCC]">{restaurant?.address || "Address not provided yet"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#1A1A1A] rounded-lg text-[#666]">
              <Clock size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#666] uppercase tracking-wider mb-1">Operating Days</p>
              <p className="text-sm text-[#CCC]">{restaurant?.operatingDays?.length > 0 ? restaurant.operatingDays.join(", ") : "Not specified"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#1A1A1A] rounded-lg text-[#666]">
              <Utensils size={18} />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#666] uppercase tracking-wider mb-1">Meal Timings</p>
              <div className="space-y-1 text-sm text-[#CCC]">
                {restaurant?.mealTimings?.breakfast?.open && (
                  <div className="flex justify-between gap-4">
                    <span className="text-[#888]">Breakfast:</span>
                    <span>
                      {restaurant.mealTimings.breakfast.open} - {restaurant.mealTimings.breakfast.close}
                    </span>
                  </div>
                )}
                {restaurant?.mealTimings?.lunch?.open && (
                  <div className="flex justify-between gap-4">
                    <span className="text-[#888]">Lunch:</span>
                    <span>
                      {restaurant.mealTimings.lunch.open} - {restaurant.mealTimings.lunch.close}
                    </span>
                  </div>
                )}
                {restaurant?.mealTimings?.dinner?.open && (
                  <div className="flex justify-between gap-4">
                    <span className="text-[#888]">Dinner:</span>
                    <span>
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
    </div>
  );
}
