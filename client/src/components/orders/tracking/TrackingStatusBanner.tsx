import { PackageCheck, AlertCircle } from "lucide-react";

interface TrackingStatusBannerProps {
  status: "delivered" | "cancelled";
  restaurantName?: string;
}

export default function TrackingStatusBanner({
  status,
  restaurantName,
}: Readonly<TrackingStatusBannerProps>) {
  if (status === "delivered") {
    return (
      <div className="bg-green-500 text-white p-6 rounded-3xl shadow-lg shadow-green-500/20 flex items-center space-x-4">
        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
          <PackageCheck className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Order Delivered!</h2>
          <p className="text-sm text-green-100">
            Enjoy your meal from {restaurantName || "the restaurant"}.
          </p>
        </div>
      </div>
    );
  }

  if (status === "cancelled") {
    return (
      <div className="bg-red-500 text-white p-6 rounded-3xl shadow-lg shadow-red-500/20 flex items-center space-x-4">
        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
          <AlertCircle className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Order Cancelled</h2>
          <p className="text-sm text-red-100">
            Unable to assign a delivery partner. Any payment has been refunded.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
