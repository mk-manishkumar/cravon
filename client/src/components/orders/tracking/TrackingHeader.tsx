"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface TrackingHeaderProps {
  orderId: string;
}

export default function TrackingHeader({ orderId }: Readonly<TrackingHeaderProps>) {
  const router = useRouter();

  return (
    <header className="bg-white border-b border-zinc-200 sticky top-0 z-20 px-4 py-3 shadow-xs">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/orders")}
          className="flex items-center text-zinc-600 hover:text-black font-semibold text-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Orders
        </button>
        <span className="font-mono text-xs font-bold text-zinc-400">
          #{orderId.substring(0, 8)}
        </span>
      </div>
    </header>
  );
}
