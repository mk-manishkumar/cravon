"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle2, MapPin, Store, Clock, ChevronRight, ChevronLeft } from "lucide-react";

const onboardingSchema = z.object({
  name: z.string().min(2, "Restaurant name must be at least 2 characters"),
  address: z.union([z.string().min(10, "Please provide a complete address"), z.literal("")]).optional(),
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
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

interface InitialData {
  name?: string;
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

export default function OnboardingWizard({ onComplete, onClose, isLoading = false, initialData, isEditMode = false }: Props) {
  const [currentStep, setCurrentStep] = useState(1);

  // Map initial data to form values
  const defaultValues = {
    name: initialData?.name || "",
    address: initialData?.address || "",
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

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    setValue,
    control,
    formState: { errors },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues,
  });

  const selectedDays = useWatch({ control, name: "operatingDays" }) || [];

  const nextStep = async () => {
    let fieldsToValidate: (keyof OnboardingFormValues)[] = [];
    if (currentStep === 1) {
      fieldsToValidate = ["name", "address", "lat", "lng"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["openTime", "closeTime", "operatingDays", "breakfastOpen", "breakfastClose", "lunchOpen", "lunchClose", "dinnerOpen", "dinnerClose"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const onSubmit = (data: OnboardingFormValues) => {
    if (currentStep !== 3) {
      nextStep();
      return;
    }

    const formattedData = {
      name: data.name,
      address: data.address || undefined,
      lat: data.lat !== undefined && !Number.isNaN(data.lat) ? data.lat : undefined,
      lng: data.lng !== undefined && !Number.isNaN(data.lng) ? data.lng : undefined,
      operatingDays: data.operatingDays || [],
      operatingHours:
        data.openTime && data.closeTime
          ? {
              open: data.openTime,
              close: data.closeTime,
            }
          : undefined,
      mealTimings: {
        breakfast: data.breakfastOpen && data.breakfastClose ? { open: data.breakfastOpen, close: data.breakfastClose } : undefined,
        lunch: data.lunchOpen && data.lunchClose ? { open: data.lunchOpen, close: data.lunchClose } : undefined,
        dinner: data.dinnerOpen && data.dinnerClose ? { open: data.dinnerOpen, close: data.dinnerClose } : undefined,
      },
    };
    onComplete(formattedData);
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

      {/* Form Content */}
      <div className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* IDENTITY & LOCATION */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
              <div>
                <label htmlFor="name" className="block text-[11px] font-semibold uppercase tracking-widest text-[#777777] mb-1.5">
                  Restaurant Name
                </label>
                <input id="name" {...register("name")} className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-[14px] text-white outline-none transition-all focus:bg-[#222222] focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30]" placeholder="e.g. The Golden Wok" />
                {errors.name && <p className="text-[#FF3D57] text-xs mt-1.5">{errors.name.message}</p>}
              </div>

              <div>
                <label htmlFor="address" className="block text-[11px] font-semibold uppercase tracking-widest text-[#777777] mb-1.5">
                  Full Address
                </label>
                <input id="address" {...register("address")} className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-[14px] text-white outline-none transition-all focus:bg-[#222222] focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30]" placeholder="Street, City, Zip" />
                {errors.address && <p className="text-[#FF3D57] text-xs mt-1.5">{errors.address.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="lat" className="block text-[11px] font-semibold uppercase tracking-widest text-[#777777] mb-1.5">
                    Latitude
                  </label>
                  <input id="lat" type="number" step="any" {...register("lat", { valueAsNumber: true })} className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-[14px] text-white outline-none transition-all focus:bg-[#222222] focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30]" placeholder="e.g. 28.7041" />
                  {errors.lat && <p className="text-[#FF3D57] text-xs mt-1.5">{errors.lat.message}</p>}
                </div>
                <div>
                  <label htmlFor="lng" className="block text-[11px] font-semibold uppercase tracking-widest text-[#777777] mb-1.5">
                    Longitude
                  </label>
                  <input id="lng" type="number" step="any" {...register("lng", { valueAsNumber: true })} className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-[14px] text-white outline-none transition-all focus:bg-[#222222] focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30]" placeholder="e.g. 77.1025" />
                  {errors.lng && <p className="text-[#FF3D57] text-xs mt-1.5">{errors.lng.message}</p>}
                </div>
              </div>
            </div>
          )}

          {/* OPERATIONS */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="openTime" className="block text-[11px] font-semibold uppercase tracking-widest text-[#777777] mb-1.5">
                    Opening Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]" size={16} />
                    <input id="openTime" type="time" {...register("openTime")} className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-[14px] text-white outline-none transition-all focus:bg-[#222222] focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30] scheme-dark" />
                  </div>
                  {errors.openTime && <p className="text-[#FF3D57] text-xs mt-1.5">{errors.openTime.message}</p>}
                </div>
                <div>
                  <label htmlFor="closeTime" className="block text-[11px] font-semibold uppercase tracking-widest text-[#777777] mb-1.5">
                    Closing Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]" size={16} />
                    <input id="closeTime" type="time" {...register("closeTime")} className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-[14px] text-white outline-none transition-all focus:bg-[#222222] focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30] scheme-dark" />
                  </div>
                  {errors.closeTime && <p className="text-[#FF3D57] text-xs mt-1.5">{errors.closeTime.message}</p>}
                </div>
              </div>

              {/* Meal Timings */}
              <div className="pt-4 border-t border-[#1F1F1F]">
                <h4 className="text-[13px] font-semibold text-white uppercase tracking-wider mb-4">Meal Timings (Optional)</h4>
                <div className="space-y-4">
                  {/* Breakfast */}
                  <div className="flex items-center gap-4">
                    <div className="w-24 text-[12px] font-medium text-[#888]">Breakfast</div>
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <input type="time" {...register("breakfastOpen")} className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[13px] text-white outline-none transition-all focus:border-[#FF7A30] scheme-dark" placeholder="Open" />
                      <input type="time" {...register("breakfastClose")} className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[13px] text-white outline-none transition-all focus:border-[#FF7A30] scheme-dark" placeholder="Close" />
                    </div>
                  </div>

                  {/* Lunch */}
                  <div className="flex items-center gap-4">
                    <div className="w-24 text-[12px] font-medium text-[#888]">Lunch</div>
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <input type="time" {...register("lunchOpen")} className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[13px] text-white outline-none transition-all focus:border-[#FF7A30] scheme-dark" placeholder="Open" />
                      <input type="time" {...register("lunchClose")} className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[13px] text-white outline-none transition-all focus:border-[#FF7A30] scheme-dark" placeholder="Close" />
                    </div>
                  </div>

                  {/* Dinner */}
                  <div className="flex items-center gap-4">
                    <div className="w-24 text-[12px] font-medium text-[#888]">Dinner</div>
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <input type="time" {...register("dinnerOpen")} className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[13px] text-white outline-none transition-all focus:border-[#FF7A30] scheme-dark" placeholder="Open" />
                      <input type="time" {...register("dinnerClose")} className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[13px] text-white outline-none transition-all focus:border-[#FF7A30] scheme-dark" placeholder="Close" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Operating Days Selector */}
              <div className="pt-4 border-t border-[#1F1F1F]">
                <div className="block text-[13px] font-semibold text-white uppercase tracking-wider mb-3">Operating Days</div>
                <div className="flex flex-wrap gap-2">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
                    const isSelected = selectedDays.includes(day);

                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          const newDays = isSelected ? selectedDays.filter((d) => d !== day) : [...selectedDays, day];

                          setValue("operatingDays", newDays, { shouldValidate: true, shouldDirty: true });
                        }}
                        className={`cursor-pointer px-4 py-2 rounded-xl text-[13px] font-medium transition-all ${isSelected ? "bg-[#FF7A30] text-white border border-[#FF7A30]" : "bg-[#1A1A1A] text-[#888] border border-[#2A2A2A] hover:bg-[#222]"}`}
                      >
                        {day.substring(0, 3)}
                      </button>
                    );
                  })}
                </div>
                {errors.operatingDays && <p className="text-[#FF3D57] text-xs mt-2">{errors.operatingDays.message}</p>}

                {/* Hidden input to properly register the array with react-hook-form */}
                <input type="hidden" {...register("operatingDays")} />
              </div>
            </div>
          )}

          {/* REVIEW & LAUNCH */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="bg-[#111] border border-[#222] rounded-xl p-6">
                <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                  <CheckCircle2 className="text-[#00C853]" size={20} /> {isEditMode ? "Ready to Save?" : "Almost there!"}
                </h3>
                <p className="text-[#888] text-sm leading-relaxed mb-6">{isEditMode ? 'Please review the details below. Once you click "Save Changes", your restaurant profile will be updated.' : 'Please review the details below. Once you click "Submit & Go Live", your restaurant will be officially onboarded and ready for menu uploads.'}</p>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between pb-3 border-b border-[#222]">
                    <span className="text-[#666]">Restaurant Name:</span>
                    <span className="text-white font-medium">{getValues("name")}</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-[#222]">
                    <span className="text-[#666]">Address:</span>
                    <span className="text-white text-right font-medium max-w-50 truncate">{getValues("address")}</span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-[#222]">
                    <span className="text-[#666]">Coordinates:</span>
                    <span className="text-white font-medium">
                      {getValues("lat")}, {getValues("lng")}
                    </span>
                  </div>
                  <div className="flex justify-between pb-3 border-b border-[#222]">
                    <span className="text-[#666]">Operating Days:</span>
                    <span className="text-white font-medium text-right max-w-[60%]">
                      {getValues("operatingDays")?.length
                        ? getValues("operatingDays")!
                            .map((d) => d.substring(0, 3))
                            .join(", ")
                        : "None Selected"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666]">Base Operating Hours:</span>
                    <span className="text-white font-medium">
                      {getValues("openTime")} - {getValues("closeTime")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 mt-8 border-t border-[#1F1F1F]">
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} disabled={isLoading} className="cursor-pointer px-6 py-3.5 rounded-xl text-[14px] font-semibold text-white bg-[#1A1A1A] border border-[#2A2A2A] hover:bg-[#222] transition-colors flex items-center gap-2 disabled:opacity-50">
                <ChevronLeft size={16} /> Back
              </button>
            )}

            {currentStep < 3 ? (
              <button key="btn-continue" type="button" onClick={nextStep} className="cursor-pointer flex-1 px-6 py-3.5 rounded-xl text-[14px] font-semibold text-white bg-linear-to-r from-[#FF3D57] to-[#FF7A30] hover:from-[#FF4E66] hover:to-[#FF8E4D] shadow-lg outline-none focus:ring-4 focus:ring-[#FF7A30]/30 transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
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
