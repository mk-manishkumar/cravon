"use client";

import { useState, useEffect } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Store, UploadCloud, Search } from "lucide-react";
import { IKContext, IKUpload } from "imagekitio-react";
import Image from "next/image";
import api from "@/lib/axios";
import axios from "axios";
import dynamic from "next/dynamic";
import { OnboardingFormValues } from "./schema";

const MapWidget = dynamic(() => import("../MapWidget"), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center text-[#555] text-sm">Loading Map...</div>,
});

interface NominatimPlace {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    suburb?: string;
    county?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

export const StepOneLocation = ({ form, isUploadingLogo, setIsUploadingLogo }: { form: UseFormReturn<OnboardingFormValues>; isUploadingLogo: boolean; setIsUploadingLogo: (v: boolean) => void }) => {
  const {
    register,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = form;
  const uploadedImage = useWatch({ control, name: "image" });
  const lat = useWatch({ control, name: "lat" });
  const lng = useWatch({ control, name: "lng" });

  const [mapSearchValue, setMapSearchValue] = useState("");
  const [debouncedSearchValue, setDebouncedSearchValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchValue(mapSearchValue), 500);
    return () => clearTimeout(timer);
  }, [mapSearchValue]);

  const { data: suggestions = [] } = useQuery<NominatimPlace[]>({
    queryKey: ["nominatim", debouncedSearchValue],
    queryFn: async () => {
      const res = await axios.get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(debouncedSearchValue)}&format=json&addressdetails=1&limit=5`, {
        headers: { "User-Agent": "CravonApp/1.0" },
      });
      return res.data;
    },
    enabled: debouncedSearchValue.length >= 3,
  });

  const handleSelectPlace = (place: NominatimPlace) => {
    setMapSearchValue(place.display_name);
    setDebouncedSearchValue(""); // Clear suggestions by clearing debounced value

    const newLat = Number.parseFloat(place.lat);
    const newLng = Number.parseFloat(place.lon);
    setValue("lat", newLat, { shouldValidate: true });
    setValue("lng", newLng, { shouldValidate: true });

    const addr = place.address || {};
    const city = addr.city || addr.town || addr.village || addr.suburb || addr.county || "";
    const state = addr.state || "";
    const zip = addr.postcode || "";
    const country = addr.country || "";

    const fullAddressParts = place.display_name.split(",").map((s: string) => s.trim());
    const partsToRemove = new Set([city, state, zip, country].filter(Boolean));
    const streetParts = fullAddressParts.filter((part: string) => !partsToRemove.has(part));
    const street = streetParts.join(", ");

    setValue("street", street || place.display_name.split(",")[0], { shouldValidate: true });
    setValue("city", city, { shouldValidate: true });
    setValue("state", state, { shouldValidate: true });
    setValue("zip", zip, { shouldValidate: true });
  };

  let uploadLabel = "Upload Logo";
  if (isUploadingLogo) uploadLabel = "Uploading...";
  else if (uploadedImage) uploadLabel = "Change Logo";

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col items-center gap-3 mb-2">
        <div className="w-20 h-20 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center overflow-hidden relative">{uploadedImage ? <Image src={getValues("image") || ""} alt="Logo" fill className="object-cover" sizes="80px" /> : <Store className="text-[#555]" size={28} />}</div>
        {/* Logo Upload */}
        <IKContext
          publicKey={process.env.NEXT_PUBLIC_IMAGE_PUBLIC_KEY}
          urlEndpoint={process.env.NEXT_PUBLIC_IMAGE_URL_ENDPOINT}
          authenticator={async () => {
            try {
              const res = await api.get("/upload/auth");
              return res.data;
            } catch (err) {
              console.error("Auth failed:", err);
              throw new Error("Auth failed");
            }
          }}
        >
          <label className="cursor-pointer flex items-center gap-1.5 text-[12px] font-semibold text-[#FF7A30] hover:text-[#FF8E4D] transition-colors relative">
            <UploadCloud size={14} />
            {uploadLabel}
            <IKUpload
              fileName="restaurant_logo"
              className="hidden"
              onUploadStart={() => setIsUploadingLogo(true)}
              onSuccess={(res: { url: string }) => {
                setIsUploadingLogo(false);
                setValue("image", res.url, { shouldValidate: true, shouldDirty: true });
              }}
              onError={(err: unknown) => {
                setIsUploadingLogo(false);
                console.error("Upload error:", err);
                alert("Failed to upload image. Please check ImageKit credentials.");
              }}
            />
          </label>
        </IKContext>
      </div>

      {/* Restaurant Name */}
      <div>
        <label htmlFor="name" className="block text-[11px] font-semibold uppercase tracking-widest text-[#777777] mb-1.5">
          Restaurant Name
        </label>
        <input id="name" {...register("name")} className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-[14px] text-white outline-none transition-all focus:bg-[#222222] focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30]" placeholder="e.g. The Golden Wok" />
        {errors.name && <p className="text-[#FF3D57] text-xs mt-1.5">{errors.name.message}</p>}
      </div>

      {/* Franchise Name */}
      <div>
        <label htmlFor="franchiseName" className="block text-[11px] font-semibold uppercase tracking-widest text-[#777777] mb-1.5">
          Franchise Name
        </label>
        <input id="franchiseName" {...register("franchiseName")} className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-[14px] text-white outline-none transition-all focus:bg-[#222222] focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30]" placeholder="e.g. KFC, Subway" />
        {errors.franchiseName && <p className="text-[#FF3D57] text-xs mt-1.5">{errors.franchiseName.message}</p>}
      </div>

      {/* Location */}
      <div className="pt-4 border-t border-[#1F1F1F]">
        <h4 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-4">Location</h4>
        <div className="space-y-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]" size={16} />
            <input value={mapSearchValue} onChange={(e) => setMapSearchValue(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-[14px] text-white outline-none transition-all focus:bg-[#222222] focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30]" placeholder="Search for your restaurant location..." />
            {suggestions.length > 0 && (
              <ul className="absolute z-50 w-full mt-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden shadow-2xl">
                {suggestions.map((place) => (
                  <li key={place.place_id} className="border-b border-[#2A2A2A] last:border-none">
                    <button type="button" onClick={() => handleSelectPlace(place)} className="w-full text-left px-4 py-3 cursor-pointer text-sm text-[#CCC] hover:bg-[#FF7A30] hover:text-white transition-colors">
                      {place.display_name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="w-full h-64 rounded-xl overflow-hidden border border-[#2A2A2A] bg-[#1A1A1A] relative z-0">
            <MapWidget
              lat={lat}
              lng={lng}
              setCoordinates={(newLat, newLng) => {
                setValue("lat", newLat, { shouldValidate: true });
                setValue("lng", newLng, { shouldValidate: true });
              }}
            />
          </div>
          {(errors.lat || errors.lng) && <p className="text-[#FF3D57] text-xs">Please pin your exact location on the map.</p>}
        </div>

        {/* Address Details */}
        <div className="space-y-4">
          <div>
            <label htmlFor="street" className="block text-[11px] font-semibold uppercase tracking-widest text-[#777777] mb-1.5">
              Street Address
            </label>
            <input id="street" {...register("street")} className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-[14px] text-white outline-none transition-all focus:bg-[#222222] focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30]" placeholder="123 Main St" />
            {errors.street && <p className="text-[#FF3D57] text-xs mt-1.5">{errors.street.message}</p>}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label htmlFor="city" className="block text-[11px] font-semibold uppercase tracking-widest text-[#777777] mb-1.5">
                City
              </label>
              <input id="city" {...register("city")} className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-[14px] text-white outline-none transition-all focus:bg-[#222222] focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30]" placeholder="New York" />
              {errors.city && <p className="text-[#FF3D57] text-xs mt-1.5">{errors.city.message}</p>}
            </div>
            <div className="col-span-1">
              <label htmlFor="state" className="block text-[11px] font-semibold uppercase tracking-widest text-[#777777] mb-1.5">
                State
              </label>
              <input id="state" {...register("state")} className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-[14px] text-white outline-none transition-all focus:bg-[#222222] focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30]" placeholder="NY" />
              {errors.state && <p className="text-[#FF3D57] text-xs mt-1.5">{errors.state.message}</p>}
            </div>
            <div className="col-span-1">
              <label htmlFor="zip" className="block text-[11px] font-semibold uppercase tracking-widest text-[#777777] mb-1.5">
                Zip Code
              </label>
              <input id="zip" {...register("zip")} className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-[14px] text-white outline-none transition-all focus:bg-[#222222] focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30]" placeholder="10001" />
              {errors.zip && <p className="text-[#FF3D57] text-xs mt-1.5">{errors.zip.message}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
