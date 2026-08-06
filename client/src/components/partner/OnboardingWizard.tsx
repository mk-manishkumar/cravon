"use client";

import { useState } from "react";
import { useForm, useWatch, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle2, MapPin, Store, Clock, ChevronRight, ChevronLeft, UploadCloud, Search } from "lucide-react";
import { IKContext, IKUpload } from "imagekitio-react";
import Image from "next/image";
import api from "@/lib/axios";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, { getGeocode, getLatLng } from "use-places-autocomplete";

const onboardingSchema = z.object({
  name: z.string().min(2, "Restaurant name must be at least 2 characters"),
  franchiseName: z.union([z.string(), z.literal("")]).optional(),
  street: z.string().min(2, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string().min(3, "Zip code is required"),
  lat: z.union([z.number().min(-90).max(90, "Invalid latitude"), z.number().refine(Number.isNaN)]).optional(),
  lng: z.union([z.number().min(-180).max(180, "Invalid longitude"), z.number().refine(Number.isNaN)]).optional(),
  operatingDays: z.array(z.string()).optional(),
  openTime: z.union([z.string().min(4, "Opening time required"), z.literal("")]).optional(),
  closeTime: z.union([z.string().min(4, "Closing time required"), z.literal("")]).optional(),
  breakfastOpen: z.string().optional(),
  breakfastClose: z.string().optional(),
  lunchOpen: z.string().optional(),
  lunchClose: z.string().optional(),
  dinnerOpen: z.string().optional(),
  dinnerClose: z.string().optional(),
  image: z.string().optional(),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

interface InitialData {
  name?: string;
  franchiseName?: string;
  image?: string;
  address?: string;
  location?: { coordinates?: number[] };
  operatingDays?: string[];
  operatingHours?: { open?: string; close?: string };
  mealTimings?: {
    breakfast?: { open?: string; close?: string };
    lunch?: { open?: string; close?: string };
    dinner?: { open?: string; close?: string };
  };
}

interface Props {
  readonly onComplete: (data: Record<string, unknown>) => void;
  readonly onClose?: () => void;
  readonly isLoading?: boolean;
  readonly initialData?: InitialData;
  readonly isEditMode?: boolean;
}

const steps = [
  { id: 1, title: "Identity & Location", icon: MapPin },
  { id: 2, title: "Operations", icon: Store },
  { id: 3, title: "Review & Launch", icon: CheckCircle2 },
];

const mapDarkStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

const libraries = ["places"] as ("places")[];

// --- STEP 1 COMPONENT ---
const Step1Location = ({ form, isUploadingLogo, setIsUploadingLogo }: { form: UseFormReturn<OnboardingFormValues>; isUploadingLogo: boolean; setIsUploadingLogo: (v: boolean) => void }) => {
  const { register, setValue, getValues, control, formState: { errors } } = form;
  const uploadedImage = useWatch({ control, name: "image" });
  const lat = useWatch({ control, name: "lat" });
  const lng = useWatch({ control, name: "lng" });

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const {
    ready,
    value: mapSearchValue,
    suggestions: { status, data: suggestionsData },
    setValue: setAutocompleteValue,
    clearSuggestions,
  } = usePlacesAutocomplete({ requestOptions: {}, debounce: 300, initOnMount: isLoaded });

  const handleSelectPlace = async (address: string) => {
    setAutocompleteValue(address, false);
    clearSuggestions();
    try {
      const results = await getGeocode({ address });
      const { lat: newLat, lng: newLng } = getLatLng(results[0]);
      setValue("lat", newLat, { shouldValidate: true });
      setValue("lng", newLng, { shouldValidate: true });

      const components = results[0].address_components;
      const getComp = (type: string, short = false) => components.find((c) => c.types.includes(type))?.[short ? "short_name" : "long_name"] || "";

      setValue("street", `${getComp("street_number")} ${getComp("route")}`.trim() || address.split(",")[0], { shouldValidate: true });
      setValue("city", getComp("locality"), { shouldValidate: true });
      setValue("state", getComp("administrative_area_level_1", true), { shouldValidate: true });
      setValue("zip", getComp("postal_code"), { shouldValidate: true });
    } catch (error) {
      console.error("Error fetching geocode:", error);
    }
  };

  let uploadLabel = "Upload Logo";
  if (isUploadingLogo) uploadLabel = "Uploading...";
  else if (uploadedImage) uploadLabel = "Change Logo";

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col items-center gap-3 mb-2">
        <div className="w-20 h-20 rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center overflow-hidden relative">{uploadedImage ? <Image src={getValues("image") || ""} alt="Logo" fill className="object-cover" sizes="80px" /> : <Store className="text-[#555]" size={28} />}</div>
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

      <div>
        <label htmlFor="name" className="block text-[11px] font-semibold uppercase tracking-widest text-[#777777] mb-1.5">Restaurant Name</label>
        <input id="name" {...register("name")} className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-[14px] text-white outline-none transition-all focus:bg-[#222222] focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30]" placeholder="e.g. The Golden Wok" />
        {errors.name && <p className="text-[#FF3D57] text-xs mt-1.5">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="franchiseName" className="block text-[11px] font-semibold uppercase tracking-widest text-[#777777] mb-1.5">Franchise Name (Optional)</label>
        <input id="franchiseName" {...register("franchiseName")} className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-[14px] text-white outline-none transition-all focus:bg-[#222222] focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30]" placeholder="e.g. KFC, Subway" />
        {errors.franchiseName && <p className="text-[#FF3D57] text-xs mt-1.5">{errors.franchiseName.message}</p>}
      </div>

      <div className="pt-4 border-t border-[#1F1F1F]">
        <h4 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-4">Location</h4>
        <div className="space-y-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]" size={16} />
            <input value={mapSearchValue} onChange={(e) => setAutocompleteValue(e.target.value)} disabled={!ready} className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-[14px] text-white outline-none transition-all focus:bg-[#222222] focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30]" placeholder="Search for your restaurant on Google Maps..." />
            {status === "OK" && (
              <ul className="absolute z-50 w-full mt-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl overflow-hidden shadow-2xl">
                {suggestionsData.map(({ place_id, description }) => (
                  <li key={place_id} className="border-b border-[#2A2A2A] last:border-none">
                    <button type="button" onClick={() => handleSelectPlace(description)} className="w-full text-left px-4 py-3 cursor-pointer text-sm text-[#CCC] hover:bg-[#FF7A30] hover:text-white transition-colors">
                      {description}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="w-full h-64 rounded-xl overflow-hidden border border-[#2A2A2A] bg-[#1A1A1A]">
            {isLoaded ? (
              <GoogleMap mapContainerStyle={{ width: "100%", height: "100%" }} center={lat && lng ? { lat, lng } : { lat: 40.7128, lng: -74.0060 }} zoom={lat && lng ? 15 : 4} options={{ disableDefaultUI: true, zoomControl: true, styles: mapDarkStyle }} onClick={(e) => { if (e.latLng) { setValue("lat", e.latLng.lat(), { shouldValidate: true }); setValue("lng", e.latLng.lng(), { shouldValidate: true }); } }}>
                {lat && lng && (
                  <Marker position={{ lat, lng }} draggable={true} onDragEnd={(e) => { if (e.latLng) { setValue("lat", e.latLng.lat(), { shouldValidate: true }); setValue("lng", e.latLng.lng(), { shouldValidate: true }); } }} />
                )}
              </GoogleMap>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#555] text-sm">Loading Map...</div>
            )}
          </div>
          {(errors.lat || errors.lng) && <p className="text-[#FF3D57] text-xs">Please pin your exact location on the map.</p>}
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="street" className="block text-[11px] font-semibold uppercase tracking-widest text-[#777777] mb-1.5">Street Address</label>
            <input id="street" {...register("street")} className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-[14px] text-white outline-none transition-all focus:bg-[#222222] focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30]" placeholder="123 Main St" />
            {errors.street && <p className="text-[#FF3D57] text-xs mt-1.5">{errors.street.message}</p>}
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label htmlFor="city" className="block text-[11px] font-semibold uppercase tracking-widest text-[#777777] mb-1.5">City</label>
              <input id="city" {...register("city")} className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-[14px] text-white outline-none transition-all focus:bg-[#222222] focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30]" placeholder="New York" />
              {errors.city && <p className="text-[#FF3D57] text-xs mt-1.5">{errors.city.message}</p>}
            </div>
            <div className="col-span-1">
              <label htmlFor="state" className="block text-[11px] font-semibold uppercase tracking-widest text-[#777777] mb-1.5">State</label>
              <input id="state" {...register("state")} className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-[14px] text-white outline-none transition-all focus:bg-[#222222] focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30]" placeholder="NY" />
              {errors.state && <p className="text-[#FF3D57] text-xs mt-1.5">{errors.state.message}</p>}
            </div>
            <div className="col-span-1">
              <label htmlFor="zip" className="block text-[11px] font-semibold uppercase tracking-widest text-[#777777] mb-1.5">Zip Code</label>
              <input id="zip" {...register("zip")} className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-[14px] text-white outline-none transition-all focus:bg-[#222222] focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30]" placeholder="10001" />
              {errors.zip && <p className="text-[#FF3D57] text-xs mt-1.5">{errors.zip.message}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- STEP 2 COMPONENT ---
const Step2Operations = ({ form }: { form: UseFormReturn<OnboardingFormValues> }) => {
  const { register, control, setValue, formState: { errors } } = form;
  const selectedDays = useWatch({ control, name: "operatingDays" }) || [];

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="openTime" className="block text-[11px] font-semibold uppercase tracking-widest text-[#777777] mb-1.5">Opening Time</label>
          <div className="relative">
            <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]" size={16} />
            <input id="openTime" type="time" {...register("openTime")} className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-[14px] text-white outline-none transition-all focus:bg-[#222222] focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30] scheme-dark" />
          </div>
          {errors.openTime && <p className="text-[#FF3D57] text-xs mt-1.5">{errors.openTime.message}</p>}
        </div>
        <div>
          <label htmlFor="closeTime" className="block text-[11px] font-semibold uppercase tracking-widest text-[#777777] mb-1.5">Closing Time</label>
          <div className="relative">
            <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]" size={16} />
            <input id="closeTime" type="time" {...register("closeTime")} className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-[14px] text-white outline-none transition-all focus:bg-[#222222] focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30] scheme-dark" />
          </div>
          {errors.closeTime && <p className="text-[#FF3D57] text-xs mt-1.5">{errors.closeTime.message}</p>}
        </div>
      </div>

      <div className="pt-4 border-t border-[#1F1F1F]">
        <h4 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-4">Meal Timings (Optional)</h4>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-24 text-[12px] font-medium text-[#888]">Breakfast</div>
            <div className="flex-1 grid grid-cols-2 gap-3">
              <input type="time" {...register("breakfastOpen")} className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[13px] text-white outline-none transition-all focus:border-[#FF7A30] scheme-dark" placeholder="Open" />
              <input type="time" {...register("breakfastClose")} className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[13px] text-white outline-none transition-all focus:border-[#FF7A30] scheme-dark" placeholder="Close" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-24 text-[12px] font-medium text-[#888]">Lunch</div>
            <div className="flex-1 grid grid-cols-2 gap-3">
              <input type="time" {...register("lunchOpen")} className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[13px] text-white outline-none transition-all focus:border-[#FF7A30] scheme-dark" placeholder="Open" />
              <input type="time" {...register("lunchClose")} className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[13px] text-white outline-none transition-all focus:border-[#FF7A30] scheme-dark" placeholder="Close" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-24 text-[12px] font-medium text-[#888]">Dinner</div>
            <div className="flex-1 grid grid-cols-2 gap-3">
              <input type="time" {...register("dinnerOpen")} className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[13px] text-white outline-none transition-all focus:border-[#FF7A30] scheme-dark" placeholder="Open" />
              <input type="time" {...register("dinnerClose")} className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[13px] text-white outline-none transition-all focus:border-[#FF7A30] scheme-dark" placeholder="Close" />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-[#1F1F1F]">
        <div className="block text-[13px] font-semibold text-white uppercase tracking-wider mb-3">Operating Days</div>
        <div className="flex flex-wrap gap-2">
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
            const isSelected = selectedDays.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => setValue("operatingDays", isSelected ? selectedDays.filter((d) => d !== day) : [...selectedDays, day], { shouldValidate: true, shouldDirty: true })}
                className={`cursor-pointer px-4 py-2 rounded-xl text-[13px] font-medium transition-all ${isSelected ? "bg-[#FF7A30] text-white border border-[#FF7A30]" : "bg-[#1A1A1A] text-[#888] border border-[#2A2A2A] hover:bg-[#222]"}`}
              >
                {day.substring(0, 3)}
              </button>
            );
          })}
        </div>
        {errors.operatingDays && <p className="text-[#FF3D57] text-xs mt-2">{errors.operatingDays.message}</p>}
        <input type="hidden" {...register("operatingDays")} />
      </div>
    </div>
  );
};

// --- STEP 3 COMPONENT ---
const Step3Review = ({ form, isEditMode }: { form: UseFormReturn<OnboardingFormValues>; isEditMode: boolean }) => {
  const { getValues } = form;
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="bg-[#111] border border-[#222] rounded-xl p-6">
        <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
          <CheckCircle2 className="text-[#00C853]" size={20} /> {isEditMode ? "Ready to Save?" : "Almost there!"}
        </h3>
        <p className="text-[#888] text-sm leading-relaxed mb-6">{isEditMode ? 'Please review the details below. Once you click "Save Changes", your restaurant profile will be updated.' : 'Please review the details below. Once you click "Submit & Go Live", your restaurant will be officially onboarded.'}</p>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between pb-3 border-b border-[#222]">
            <span className="text-[#666]">Restaurant Name:</span>
            <span className="text-white font-medium">{getValues("name")}</span>
          </div>
          {getValues("franchiseName") && (
            <div className="flex justify-between pb-3 border-b border-[#222]">
              <span className="text-[#666]">Franchise:</span>
              <span className="font-medium text-[#FF7A30]">{getValues("franchiseName")}</span>
            </div>
          )}
          {getValues("image") && (
            <div className="flex justify-between pb-3 border-b border-[#222]">
              <span className="text-[#666]">Logo:</span>
              <span className="text-white font-medium flex items-center gap-2">
                <div className="relative w-6 h-6 rounded-md overflow-hidden border border-[#333]">
                  <Image src={getValues("image") || ""} alt="Logo" fill className="object-cover" sizes="24px" />
                </div>{" "}
                Uploaded
              </span>
            </div>
          )}
          <div className="flex justify-between pb-3 border-b border-[#222]">
            <span className="text-[#666]">Address:</span>
            <span className="text-white text-right font-medium max-w-[50%] truncate">{getValues("street") ? `${getValues("street")}, ${getValues("city")}, ${getValues("state")} ${getValues("zip")}` : ""}</span>
          </div>
          <div className="flex justify-between pb-3 border-b border-[#222]">
            <span className="text-[#666]">Coordinates:</span>
            <span className="text-white font-medium">{getValues("lat")}, {getValues("lng")}</span>
          </div>
          <div className="flex justify-between pb-3 border-b border-[#222]">
            <span className="text-[#666]">Operating Days:</span>
            <span className="text-white font-medium text-right max-w-[60%]">{getValues("operatingDays")?.length ? getValues("operatingDays")!.map((d) => d.substring(0, 3)).join(", ") : "None Selected"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#666]">Base Operating Hours:</span>
            <span className="text-white font-medium">{getValues("openTime")} - {getValues("closeTime")}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function OnboardingWizard({ onComplete, onClose, isLoading = false, initialData, isEditMode = false }: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const defaultValues = {
    name: initialData?.name || "",
    franchiseName: initialData?.franchiseName || "",
    image: initialData?.image || "",
    street: initialData?.address ? initialData.address.split(",")[0]?.trim() : "",
    city: initialData?.address ? initialData.address.split(",")[1]?.trim() : "",
    state: initialData?.address ? initialData.address.split(",")[2]?.trim().split(" ")[0] : "",
    zip: initialData?.address ? initialData.address.split(",")[2]?.trim().split(" ")[1] : "",
    lat: initialData?.location?.coordinates?.[1] || undefined,
    lng: initialData?.location?.coordinates?.[0] || undefined,
    operatingDays: initialData?.operatingDays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    openTime: initialData?.operatingHours?.open || "09:00",
    closeTime: initialData?.operatingHours?.close || "22:00",
    breakfastOpen: initialData?.mealTimings?.breakfast?.open || "",
    breakfastClose: initialData?.mealTimings?.breakfast?.close || "",
    lunchOpen: initialData?.mealTimings?.lunch?.open || "",
    lunchClose: initialData?.mealTimings?.lunch?.close || "",
    dinnerOpen: initialData?.mealTimings?.dinner?.open || "",
    dinnerClose: initialData?.mealTimings?.dinner?.close || "",
  };

  const form = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues,
  });
  const { handleSubmit, trigger } = form;

  const nextStep = async () => {
    let fieldsToValidate: (keyof OnboardingFormValues)[] = [];
    if (currentStep === 1) fieldsToValidate = ["name", "street", "city", "state", "zip", "lat", "lng"];
    else if (currentStep === 2) fieldsToValidate = ["openTime", "closeTime", "operatingDays", "breakfastOpen", "breakfastClose", "lunchOpen", "lunchClose", "dinnerOpen", "dinnerClose"];

    const isValid = await trigger(fieldsToValidate);
    if (isValid) setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const onSubmit = (data: OnboardingFormValues) => {
    if (currentStep !== 3) return nextStep();

    onComplete({
      name: data.name,
      franchiseName: data.franchiseName || undefined,
      image: data.image || undefined,
      address: `${data.street}, ${data.city}, ${data.state} ${data.zip}`,
      lat: data.lat !== undefined && !Number.isNaN(data.lat) ? data.lat : undefined,
      lng: data.lng !== undefined && !Number.isNaN(data.lng) ? data.lng : undefined,
      operatingDays: data.operatingDays || [],
      operatingHours: data.openTime && data.closeTime ? { open: data.openTime, close: data.closeTime } : undefined,
      mealTimings: {
        breakfast: data.breakfastOpen && data.breakfastClose ? { open: data.breakfastOpen, close: data.breakfastClose } : undefined,
        lunch: data.lunchOpen && data.lunchClose ? { open: data.lunchOpen, close: data.lunchClose } : undefined,
        dinner: data.dinnerOpen && data.dinnerClose ? { open: data.dinnerOpen, close: data.dinnerClose } : undefined,
      },
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-[#0A0A0A] rounded-3xl border border-[#1F1F1F] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] overflow-hidden">
      {/* Header Bar */}
      <div className="px-8 pt-8 pb-6 border-b border-[#1F1F1F] bg-[#111111] relative">
        {onClose && (
          <button type="button" onClick={onClose} className="cursor-pointer absolute top-6 right-6 text-[#666] hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        )}
        <h2 className="text-2xl font-bold text-white mb-6">{isEditMode ? "Edit Restaurant Details" : "Complete your Onboarding"}</h2>

        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[#1F1F1F] rounded-full z-0">
            <div className="h-full bg-linear-to-r from-[#FF3D57] to-[#FF7A30] rounded-full transition-all duration-500 ease-in-out" style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }} />
          </div>

          {/* Step Indicators */}
          {steps.map((step) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;

            let iconBgClass = "bg-[#1F1F1F] text-[#666]";
            if (isActive) {
              iconBgClass = "bg-[#FF7A30] shadow-[0_0_15px_rgba(255,122,48,0.4)] text-white scale-110";
            } else if (isCompleted) {
              iconBgClass = "bg-[#FF3D57] text-white";
            }

            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center gap-2 bg-[#111111] px-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${iconBgClass}`}>
                  <step.icon size={18} />
                </div>
                <span className={`text-[11px] font-semibold uppercase tracking-wider ${isActive || isCompleted ? "text-white" : "text-[#666]"}`}>{step.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {currentStep === 1 && <Step1Location form={form} isUploadingLogo={isUploadingLogo} setIsUploadingLogo={setIsUploadingLogo} />}
          {currentStep === 2 && <Step2Operations form={form} />}
          {currentStep === 3 && <Step3Review form={form} isEditMode={isEditMode} />}

          <div className="flex gap-4 pt-4 mt-8 border-t border-[#1F1F1F]">
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} disabled={isLoading} className="cursor-pointer px-6 py-3.5 rounded-xl text-[14px] font-semibold text-white bg-[#1A1A1A] border border-[#2A2A2A] hover:bg-[#222] transition-colors flex items-center gap-2 disabled:opacity-50">
                <ChevronLeft size={16} /> Back
              </button>
            )}

            {currentStep < 3 ? (
              <button key="btn-continue" type="button" onClick={nextStep} disabled={isUploadingLogo} className="cursor-pointer flex-1 px-6 py-3.5 rounded-xl text-[14px] font-semibold text-white bg-linear-to-r from-[#FF3D57] to-[#FF7A30] hover:from-[#FF4E66] hover:to-[#FF8E4D] shadow-lg outline-none focus:ring-4 focus:ring-[#FF7A30]/30 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50">
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button key="btn-submit" type="submit" disabled={isLoading} className="cursor-pointer flex-1 px-6 py-3.5 rounded-xl text-[14px] font-semibold text-white bg-linear-to-r from-[#00C853] to-[#00E676] hover:from-[#00E676] hover:to-[#69F0AE] shadow-lg outline-none focus:ring-4 focus:ring-[#00C853]/30 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
                {isLoading && "Submitting..."}
                {!isLoading && isEditMode && "Save Changes"}
                {!isLoading && !isEditMode && "Submit & Go Live"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
