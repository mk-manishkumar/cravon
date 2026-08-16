import { ReactNode } from "react";
import Link from "next/link";
import { Store, Settings, PieChart, Users, Menu, Package } from "lucide-react";

export default function RestaurantDashboardLayout({ children, params }: { children: ReactNode; params: { restaurantId: string } }) {
  const { restaurantId } = params;

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#111] border-r border-[#222] p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <Store className="w-8 h-8 text-[#FF7A30]" />
          <span className="text-xl font-bold">Restaurant<br/><span className="text-sm text-[#FF7A30]">Operations</span></span>
        </div>

        <nav className="flex-1 space-y-2">
          <Link href={`/dashboard/${restaurantId}`} className="flex items-center gap-3 px-4 py-3 bg-[#FF7A30]/10 text-[#FF7A30] rounded-xl font-medium transition">
            <PieChart className="w-5 h-5" /> Overview
          </Link>
          <Link href={`/dashboard/${restaurantId}/orders`} className="flex items-center gap-3 px-4 py-3 text-[#888] hover:text-white hover:bg-[#222] rounded-xl font-medium transition">
            <Package className="w-5 h-5" /> Orders
          </Link>
          <Link href={`/dashboard/${restaurantId}/menu`} className="flex items-center gap-3 px-4 py-3 text-[#888] hover:text-white hover:bg-[#222] rounded-xl font-medium transition">
            <Menu className="w-5 h-5" /> Menu
          </Link>
          <Link href={`/dashboard/${restaurantId}/staff`} className="flex items-center gap-3 px-4 py-3 text-[#888] hover:text-white hover:bg-[#222] rounded-xl font-medium transition">
            <Users className="w-5 h-5" /> Staff
          </Link>
          <Link href={`/dashboard/${restaurantId}/settings`} className="flex items-center gap-3 px-4 py-3 text-[#888] hover:text-white hover:bg-[#222] rounded-xl font-medium transition">
            <Settings className="w-5 h-5" /> Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        <header className="h-20 border-b border-[#222] flex items-center justify-between px-8 bg-[#111]/50 backdrop-blur-md">
          <h2 className="text-xl font-semibold">Restaurant ID: {restaurantId}</h2>
          <Link href="/" className="px-4 py-2 bg-[#222] hover:bg-[#333] text-white rounded-lg font-medium transition text-sm">
            Exit to Portal
          </Link>
        </header>
        <div className="flex-1 p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
