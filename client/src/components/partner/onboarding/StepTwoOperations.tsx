import { UseFormReturn, useWatch } from "react-hook-form";
import { Clock } from "lucide-react";
import { OnboardingFormValues } from "./schema";

export const StepTwoOperations = ({ form }: { form: UseFormReturn<OnboardingFormValues> }) => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = form;
  const selectedDays = useWatch({ control, name: "operatingDays" }) || [];

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-2 gap-4">

        {/* Opening Time */}
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

        {/* Closing Time */}
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

      {/* Operating Days */}
      <div className="pt-4 border-t border-[#1F1F1F]">
        <div className="block text-[13px] font-semibold text-white uppercase tracking-wider mb-3">Operating Days</div>
        <div className="flex flex-wrap gap-2">
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => {
            const isSelected = selectedDays.includes(day);
            return (
              <button key={day} type="button" onClick={() => setValue("operatingDays", isSelected ? selectedDays.filter((d) => d !== day) : [...selectedDays, day], { shouldValidate: true, shouldDirty: true })} className={`cursor-pointer px-4 py-2 rounded-xl text-[13px] font-medium transition-all ${isSelected ? "bg-[#FF7A30] text-white border border-[#FF7A30]" : "bg-[#1A1A1A] text-[#888] border border-[#2A2A2A] hover:bg-[#222]"}`}>
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
