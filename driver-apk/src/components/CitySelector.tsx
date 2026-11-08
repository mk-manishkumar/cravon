import { useState, useRef, useEffect } from "react";
import { MapPin, ChevronDown } from "lucide-react";

export const CITIES = [
  "Delhi",
  "Gurgaon",
  "Noida",
  "Hyderabad",
  "Bangalore",
  "Patna",
  "Mumbai",
  "Pune",
  "Kolkata",
  "Jaipur",
  "Rishikesh",
  "Shimla",
] as const;

export type City = (typeof CITIES)[number];

interface CitySelectorProps {
  currentCity?: string;
  onSelectCity: (city: string) => void;
  isLoading?: boolean;
}

export default function CitySelector({ currentCity = "Patna", onSelectCity, isLoading = false }: CitySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (city: string) => {
    setIsOpen(false);
    if (city !== currentCity) {
      onSelectCity(city);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full text-xs sm:text-sm font-semibold text-gray-700 transition-colors cursor-pointer disabled:opacity-60"
        title="Change delivery operational city"
      >
        <MapPin className="w-3.5 h-3.5 text-[#FF7A30] shrink-0" />
        <span className="text-gray-500 font-normal hidden xs:inline">City:</span>
        <span className="font-bold text-gray-900 truncate max-w-[85px] sm:max-w-[120px]">{currentCity}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
          <div className="p-2.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Select City</span>
            <span className="text-[10px] text-gray-400 font-semibold">{CITIES.length} Cities</span>
          </div>
          <div className="max-h-60 overflow-y-auto py-1">
            {CITIES.map((city) => {
              const isSelected = city.toLowerCase() === currentCity.toLowerCase();
              return (
                <button
                  type="button"
                  key={city}
                  onClick={() => handleSelect(city)}
                  className={`w-full text-left px-4 py-2 text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "bg-orange-50 text-[#FF7A30] font-bold"
                      : "text-gray-700 hover:bg-gray-50 hover:text-[#FF7A30]"
                  }`}
                >
                  <span>{city}</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A30]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
