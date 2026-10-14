import { Bike, Phone, Utensils } from "lucide-react";
import { DriverInfo } from "@/types/orderTracking";

interface TrackingDriverCardProps {
  driver?: DriverInfo;
}

export default function TrackingDriverCard({ driver }: Readonly<TrackingDriverCardProps>) {
  if (driver) {
    return (
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-zinc-200/80 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500">
            <Bike className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-zinc-900 leading-tight">{driver.firstName}</h3>
            <p className="text-xs text-zinc-500">{driver.vehicleDetails || "Delivery Partner"}</p>
            <div className="flex items-center text-xs text-green-600 font-semibold mt-1">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse" />
              <span>Live GPS Broadcasting</span>
            </div>
          </div>
        </div>
        {driver.phone && (
          <a
            href={`tel:${driver.phone}`}
            className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-700 hover:bg-orange-500 hover:text-white transition-colors cursor-pointer"
            aria-label="Call Driver"
          >
            <Phone className="w-4 h-4" />
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="bg-orange-50/60 p-4 rounded-3xl border border-orange-200/60 flex items-center space-x-3">
      <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
        <Utensils className="w-4 h-4 text-orange-500" />
      </div>
      <div>
        <p className="text-xs font-bold text-orange-800">Assigning Driver</p>
        <p className="text-xs text-orange-600">The matchmaker is polling nearby drivers...</p>
      </div>
    </div>
  );
}
