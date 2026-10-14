import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function TrackingNotFoundState() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
      <AlertCircle className="w-16 h-16 text-red-500 mb-2" />
      <h2 className="text-xl font-bold text-zinc-800">Order not found</h2>
      <Link href="/orders" className="mt-4 text-orange-500 font-bold hover:underline flex items-center cursor-pointer">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Orders
      </Link>
    </div>
  );
}
