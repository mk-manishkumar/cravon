import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function FoodCarouselCard({ food, filter }: Readonly<{ food: any; filter?: string }>) {
  return (
    <Link href={`/restaurants/${food.restaurantId}#food-${food._id}`} className="snap-start shrink-0 w-65 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden group cursor-pointer">
      <div className="relative w-full h-40 bg-gray-50 overflow-hidden">
        {food.image ? (
          <Image src={food.image} alt={food.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-orange-200">
            <Star className="w-8 h-8 opacity-50" />
          </div>
        )}

        {/* Veg/Non-Veg Icon overlay */}
        <div className="absolute top-3 left-3 bg-white p-1 rounded shadow-sm z-10">
          <div className={`w-3 h-3 flex items-center justify-center border rounded-sm ${food.isVeg !== false ? "border-green-600" : "border-red-600"}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${food.isVeg !== false ? "bg-green-600" : "bg-red-600"}`}></div>
          </div>
        </div>

        {/* Rating overlay */}
        {food.rating && (
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-md shadow-sm z-10 flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
            <span className="text-xs font-bold text-gray-800">{food.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col grow relative">
        <h3 className="font-bold text-gray-900 line-clamp-1 mb-1 group-hover:text-[#FF7A30] transition-colors" title={filter === "franchise" ? food.franchiseName || food.restaurantName : food.name}>
          {filter === "franchise" ? food.franchiseName || food.restaurantName : food.name}
        </h3>
        <p className="font-semibold text-gray-800 mb-2">{filter === "franchise" ? <span className="font-normal text-sm text-gray-600 line-clamp-1">{food.name}</span> : `₹${food.price}`}</p>

        {/* Dynamic bottom text */}
        <p className="text-xs text-gray-500 line-clamp-1 mb-1 mt-auto">{filter === "franchise" ? <span className="font-semibold text-gray-800 text-sm">₹{food.price}</span> : `By ${food.restaurantName}`}</p>
      </div>
    </Link>
  );
}
