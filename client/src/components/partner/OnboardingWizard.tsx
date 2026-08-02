"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle2, MapPin, Store, Utensils, Users, DollarSign, Clock, ChevronRight, ChevronLeft } from "lucide-react";

const onboardingSchema = z.object({
  name: z.string().min(2, "Restaurant name must be at least 2 characters"),
  address: z.string().min(10, "Please provide a complete address"),
  lat: z.number().min(-90).max(90, "Invalid latitude"),
  lng: z.number().min(-180).max(180, "Invalid longitude"),
  cuisines: z.string().min(2, "Add at least one cuisine (e.g. Italian, Chinese)"),
  costForTwo: z.number().min(1, "Please provide average cost for two"),
  staffCount: z.number().min(1, "How many staff members do you have?"),
  openTime: z.string().min(4, "Opening time required"),
  closeTime: z.string().min(4, "Closing time required"),
});

type OnboardingFormValues = z.infer<typeof onboardingSchema>;

interface Props {
  readonly onComplete: (data: Record<string, unknown>) => void;
  readonly onClose?: () => void;
  readonly isLoading?: boolean;
}

const steps = [
  { id: 1, title: "Identity & Location", icon: MapPin },
  { id: 2, title: "Operations", icon: Store },
  { id: 3, title: "Review & Launch", icon: CheckCircle2 },
];

export default function OnboardingWizard({ onComplete, onClose, isLoading = false }: Props) {
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      cuisines: "",
      openTime: "09:00",
      closeTime: "22:00",
    },
  });

  const nextStep = async () => {
    let fieldsToValidate: (keyof OnboardingFormValues)[] = [];
    if (currentStep === 1) {
      fieldsToValidate = ["name", "address", "lat", "lng"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["cuisines", "costForTwo", "staffCount", "openTime", "closeTime"];
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
      address: data.address,
      lat: data.lat,
      lng: data.lng,
      cuisines: data.cuisines.split(",").map((c) => c.trim()),
      costForTwo: data.costForTwo,
      staffCount: data.staffCount,
      operatingHours: {
        open: data.openTime,
        close: data.closeTime,
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
        <h2 className="text-2xl font-bold text-white mb-6">Complete your Onboarding</h2>

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
              <div>
                <label htmlFor="cuisines" className="block text-[11px] font-semibold uppercase tracking-widest text-[#777777] mb-1.5">
                  Cuisines (Comma Separated)
                </label>
                <div className="relative">
                  <Utensils className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]" size={16} />
                  <input id="cuisines" {...register("cuisines")} className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-[14px] text-white outline-none transition-all focus:bg-[#222222] focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30]" placeholder="Italian, Pizza, Fast Food" />
                </div>
                {errors.cuisines && <p className="text-[#FF3D57] text-xs mt-1.5">{errors.cuisines.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="costForTwo" className="block text-[11px] font-semibold uppercase tracking-widest text-[#777777] mb-1.5">
                    Cost for Two ($)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]" size={16} />
                    <input id="costForTwo" type="number" {...register("costForTwo", { valueAsNumber: true })} className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-[14px] text-white outline-none transition-all focus:bg-[#222222] focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30]" placeholder="e.g. 45" />
                  </div>
                  {errors.costForTwo && <p className="text-[#FF3D57] text-xs mt-1.5">{errors.costForTwo.message}</p>}
                </div>
                <div>
                  <label htmlFor="staffCount" className="block text-[11px] font-semibold uppercase tracking-widest text-[#777777] mb-1.5">
                    Total Staff
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555]" size={16} />
                    <input id="staffCount" type="number" {...register("staffCount", { valueAsNumber: true })} className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-[14px] text-white outline-none transition-all focus:bg-[#222222] focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30]" placeholder="e.g. 15" />
                  </div>
                  {errors.staffCount && <p className="text-[#FF3D57] text-xs mt-1.5">{errors.staffCount.message}</p>}
                </div>
              </div>

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
            </div>
          )}

          {/* REVIEW & LAUNCH */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="bg-[#111] border border-[#222] rounded-xl p-6">
                <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                  <CheckCircle2 className="text-[#00C853]" size={20} /> Almost there!
                </h3>
                <p className="text-[#888] text-sm leading-relaxed mb-6">Please review the details below. Once you click &quot;Submit &amp; Go Live&quot;, your restaurant will be officially onboarded and ready for menu uploads.</p>

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
                    <span className="text-[#666]">Cuisines:</span>
                    <span className="text-white font-medium">{getValues("cuisines")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666]">Operating Hours:</span>
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
                {isLoading ? "Submitting..." : "Submit & Go Live"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
