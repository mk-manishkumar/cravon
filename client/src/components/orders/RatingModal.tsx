"use client";

import { useState } from "react";
import { Star, X, Loader2, Sparkles } from "lucide-react";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

interface OrderItem {
  _id?: string;
  id?: string;
  menuItemId?: string;
  name: string;
  price: number;
  quantity: number;
  rating?: number;
}

interface OrderRestaurant {
  name?: string;
  image?: string;
}

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    _id: string;
    restaurant?: OrderRestaurant;
    items: OrderItem[];
    isRated?: boolean;
  };
  onSuccess?: () => void;
}

const RATING_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent!",
};

export default function RatingModal({ isOpen, onClose, order, onSuccess }: Readonly<RatingModalProps>) {
  // Initialize state with any pre-existing ratings or empty
  const [ratings, setRatings] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    order.items.forEach((item) => {
      const key = item.menuItemId || item._id || item.id || item.name;
      if (item.rating && item.rating > 0) {
        initial[key] = item.rating;
      }
    });
    return initial;
  });

  const [hoveredStars, setHoveredStars] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleStarClick = (itemKey: string, starValue: number) => {
    setRatings((prev) => {
      // If clicking the same star, toggle off (allow clearing)
      if (prev[itemKey] === starValue) {
        const next = { ...prev };
        delete next[itemKey];
        return next;
      }
      return { ...prev, [itemKey]: starValue };
    });
  };

  const handleMouseEnter = (itemKey: string, starValue: number) => {
    setHoveredStars((prev) => ({ ...prev, [itemKey]: starValue }));
  };

  const handleMouseLeave = (itemKey: string) => {
    setHoveredStars((prev) => {
      const next = { ...prev };
      delete next[itemKey];
      return next;
    });
  };

  const ratedCount = Object.keys(ratings).filter((key) => (ratings[key] || 0) > 0).length;

  const handleSubmit = async () => {
    const payload: Array<{ menuItemId?: string; name: string; rating: number }> = [];

    for (const item of order.items) {
      const key = item.menuItemId || item._id || item.id || item.name;
      const rating = ratings[key];
      if (rating && rating >= 1 && rating <= 5) {
        payload.push({
          menuItemId: item.menuItemId,
          name: item.name,
          rating,
        });
      }
    }

    if (payload.length === 0) {
      toast.error("Please rate at least one food item before submitting");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await axiosInstance.post(`/orders/${order._id}/rate`, { ratings: payload });

      if (res.data?.status === "success") {
        toast.success(res.data.message || "Thank you! Your ratings have been submitted.");
        onSuccess?.();
        onClose();
      } else {
        toast.error(res.data?.message || "Failed to submit rating");
      }
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } }; message?: string };
      const message = axiosError.response?.data?.message || axiosError.message || "Failed to submit ratings";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col border border-gray-100 overflow-hidden transform transition-all" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-linear-to-r from-orange-50/50 via-white to-amber-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#FF7A30] to-[#FF3D57] flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Rate Your Food</h2>
              <p className="text-xs text-gray-500">
                {order.restaurant?.name || "Restaurant"} • Order #{order._id.slice(-6).toUpperCase()}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer" aria-label="Close modal">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational banner */}
        <div className="bg-amber-50/60 px-5 py-2.5 border-b border-amber-100/60 flex items-center justify-between text-xs text-amber-800">
          <span>Tap 1 to 5 stars to rate. Unrated items remain unchanged.</span>
          <span className="font-semibold text-amber-900 shrink-0 ml-2">
            {ratedCount} / {order.items.length} rated
          </span>
        </div>

        {/* Food Items List */}
        <div className="overflow-y-auto p-5 space-y-4 flex-1 divide-y divide-gray-100">
          {order.items.map((item, index) => {
            const itemKey = item.menuItemId || item._id || item.id || item.name;
            const currentRating = ratings[itemKey] || 0;
            const hovered = hoveredStars[itemKey] || 0;
            const effectiveRating = hovered > 0 ? hovered : currentRating;

            return (
              <div key={itemKey || index} className={`pt-4 first:pt-0 ${index !== 0 ? "pt-4" : ""}`}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{item.name}</h3>
                    <p className="text-xs text-gray-500">
                      {item.quantity}x • ₹{item.price * item.quantity}
                    </p>
                  </div>
                  {currentRating > 0 && (
                    <button type="button" onClick={() => handleStarClick(itemKey, currentRating)} className="text-[11px] text-gray-400 hover:text-red-500 font-medium cursor-pointer transition-colors">
                      Clear
                    </button>
                  )}
                </div>

                {/* Stars and label */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1" onMouseLeave={() => handleMouseLeave(itemKey)}>
                    {[1, 2, 3, 4, 5].map((starValue) => {
                      const isFilled = starValue <= effectiveRating;
                      return (
                        <button key={starValue} type="button" onClick={() => handleStarClick(itemKey, starValue)} onMouseEnter={() => handleMouseEnter(itemKey, starValue)} className="p-1 -m-1 transition-transform hover:scale-115 focus:outline-hidden cursor-pointer" aria-label={`Rate ${item.name} ${starValue} star${starValue > 1 ? "s" : ""}`}>
                          <Star className={`w-6 h-6 transition-colors duration-150 ${isFilled ? "fill-amber-400 text-amber-400 drop-shadow-xs" : "text-gray-300 hover:text-amber-300"}`} />
                        </button>
                      );
                    })}
                  </div>

                  <span className={`text-xs font-semibold transition-colors ${effectiveRating > 0 ? "text-amber-700" : "text-gray-400 font-normal italic"}`}>{effectiveRating > 0 ? RATING_LABELS[effectiveRating] : "Not rated"}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200/70 rounded-xl transition-colors cursor-pointer disabled:opacity-50">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} disabled={isSubmitting || ratedCount === 0} className="flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-[#FF7A30] to-[#FF3D57] hover:from-[#e66a25] hover:to-[#e6354c] text-white text-sm font-bold rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Star className="w-4 h-4 fill-white" />
                Submit Rating {ratedCount > 0 ? `(${ratedCount})` : ""}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
