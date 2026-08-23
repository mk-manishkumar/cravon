import { Metadata } from "next";
import RestaurantGrid from "@/components/customer/RestaurantGrid";

export const metadata: Metadata = {
  title: "Cravon | Discover & Order Delicious Food",
};

export default function CustomerLandingPage() {
  return (
    <div className="bg-white text-gray-900 font-sans min-h-[calc(100vh-140px)] selection:bg-[#FF7A30]/20 pb-20">
      {/* Hero Section */}
      <main className="px-6 py-16 md:py-24 bg-linear-to-b from-orange-50/50 to-white">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-6 text-gray-900">
            Order food from <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#FF7A30] to-[#FF5E00]">
              the best restaurants.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed">
            Discover local flavors, explore menus, and satisfy your cravings.
          </p>
        </div>
      </main>

      {/* Restaurant Grid Section */}
      <section className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Top Restaurants Near You</h2>
          <RestaurantGrid />
        </div>
      </section>
    </div>
  );
}