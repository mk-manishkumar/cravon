import { Bike, Clock } from "lucide-react";

interface TrackingStatusCardProps {
  hasDriver: boolean;
  timeLeft: number | null;
}

export default function TrackingStatusCard({
  hasDriver,
  timeLeft,
}: Readonly<TrackingStatusCardProps>) {
  const getDeliveryStatusTitle = () => {
    if (!hasDriver) return "Finding Delivery Partner";
    if (timeLeft !== null && timeLeft > 0) return `${timeLeft} seconds`;
    return "Arriving any moment!";
  };

  return (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-zinc-200/80 flex items-center justify-between">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-orange-500 flex items-center mb-1">
          <Clock className="w-3.5 h-3.5 mr-1" /> {hasDriver ? "Estimated Arrival" : "Order Status"}
        </span>
        <h2 className="text-2xl font-black text-zinc-900">{getDeliveryStatusTitle()}</h2>
        <p className="text-xs text-zinc-500 mt-0.5">
          {hasDriver ? "High-speed delivery is underway" : "Matching your order with nearby drivers..."}
        </p>
      </div>
      {hasDriver && timeLeft !== null && (
        <div className="w-14 h-14 rounded-full border-4 border-orange-500/20 border-t-orange-500 flex items-center justify-center animate-spin">
          <Bike className="w-6 h-6 text-orange-500 -rotate-45" />
        </div>
      )}
      {!hasDriver && (
        <div className="w-14 h-14 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center animate-pulse">
          <Bike className="w-6 h-6 text-orange-500" />
        </div>
      )}
    </div>
  );
}
