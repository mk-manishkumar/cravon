import { ReactNode } from "react";
import PartnerHeader from "@/components/layout/PartnerHeader";
import PartnerFooter from "@/components/layout/PartnerFooter";
import RestaurantTitle from "@/components/partner/RestaurantTitle";

export default async function RestaurantDashboardLayout({ children, params }: Readonly<{ children: ReactNode; params: Promise<{ restaurantId: string }> }>) {
  const { restaurantId } = await params;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <PartnerHeader />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
          <RestaurantTitle restaurantId={restaurantId} />
          {children}
        </div>
      </main>

      <PartnerFooter />
    </div>
  );
}
