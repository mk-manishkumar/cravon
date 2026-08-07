"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, MapPin, Store, ChevronRight, ChevronLeft } from "lucide-react";
import { OnboardingFormValues, onboardingSchema, InitialData } from "./onboarding/schema";
import { StepOneLocation } from "./onboarding/StepOneLocation";
import { StepTwoOperations } from "./onboarding/StepTwoOperations";
import { StepThreeMenu } from "./onboarding/StepThreeMenu";

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
  { id: 3, title: "Menu Upload", icon: CheckCircle2 },
];

export default function OnboardingWizard({ onComplete, onClose, isLoading = false, initialData, isEditMode = false }: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const addressParts = initialData?.address ? initialData.address.split(",") : [];
  const stateZipPart = addressParts.length > 0 ? addressParts.at(-1)?.trim() || "" : "";
  const parsedState = stateZipPart.split(" ")[0] || "";
  const parsedZip = stateZipPart.split(" ").slice(1).join(" ") || "";
  const parsedCity = addressParts.length > 1 ? addressParts.at(-2)?.trim() || "" : "";
  const parsedStreet = addressParts.length > 2 ? addressParts.slice(0, -2).join(",").trim() : (addressParts.at(0)?.trim() || "");

  const defaultValues = {
    name: initialData?.name || "",
    franchiseName: initialData?.franchiseName || "",
    image: initialData?.image || "",
    street: parsedStreet,
    city: parsedCity,
    state: parsedState,
    zip: parsedZip,
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
    else if (currentStep === 3) fieldsToValidate = ["menu"];

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
      menu: data.menu
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
          {currentStep === 1 && <StepOneLocation form={form} isUploadingLogo={isUploadingLogo} setIsUploadingLogo={setIsUploadingLogo} />}
          {currentStep === 2 && <StepTwoOperations form={form} />}
          {currentStep === 3 && <StepThreeMenu form={form} />}

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
