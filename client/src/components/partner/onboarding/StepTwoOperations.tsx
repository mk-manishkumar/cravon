import { useState, useEffect } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import { Clock, X, Plus } from "lucide-react";
import { OnboardingFormValues } from "./schema";

export const StepTwoOperations = ({ form }: { form: UseFormReturn<OnboardingFormValues> }) => {
  const {
    register,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = form;
  const selectedDays = useWatch({ control, name: "operatingDays" }) || [];

  // Determine which meals are initially active based on form values
  const [activeMeals, setActiveMeals] = useState<string[]>(() => {
    const initial = [];
    if (getValues("breakfastOpen") || getValues("breakfastClose")) initial.push("breakfast");
    if (getValues("lunchOpen") || getValues("lunchClose")) initial.push("lunch");
    if (getValues("dinnerOpen") || getValues("dinnerClose")) initial.push("dinner");
    
    // If empty initially (e.g. new form), populate with all 3
    if (initial.length === 0 && !getValues("name")) {
      return ["breakfast", "lunch", "dinner"];
    }
    return initial;
  });

  useEffect(() => {
    // Hard-force defaults in case React-Hook-Form state was preserved empty during hot-reloads
    if (activeMeals.includes("breakfast") && !getValues("breakfastOpen")) {
      setValue("breakfastOpen", "07:00");
      setValue("breakfastClose", "10:00");
    }
    if (activeMeals.includes("lunch") && !getValues("lunchOpen")) {
      setValue("lunchOpen", "12:00");
      setValue("lunchClose", "16:00");
    }
    if (activeMeals.includes("dinner") && !getValues("dinnerOpen")) {
      setValue("dinnerOpen", "18:00");
      setValue("dinnerClose", "22:00");
    }
  }, [activeMeals, getValues, setValue]);

  const removeMeal = (meal: string) => {
    setActiveMeals((prev) => prev.filter((m) => m !== meal));
    // Clear values so they aren't saved
    setValue(`${meal}Open` as keyof OnboardingFormValues, "");
    setValue(`${meal}Close` as keyof OnboardingFormValues, "");
  };

  const addMeal = (meal: string) => {
    if (!activeMeals.includes(meal)) {
      setActiveMeals((prev) => {
        const order = ["breakfast", "lunch", "dinner"];
        const newMeals = [...prev, meal];
        return newMeals.sort((a, b) => order.indexOf(a) - order.indexOf(b));
      });
      // Set defaults for the newly added meal
      if (meal === "breakfast") { setValue("breakfastOpen", "07:00"); setValue("breakfastClose", "10:00"); }
      if (meal === "lunch") { setValue("lunchOpen", "12:00"); setValue("lunchClose", "16:00"); }
      if (meal === "dinner") { setValue("dinnerOpen", "18:00"); setValue("dinnerClose", "22:00"); }
    }
  };

  const availableMeals = ["breakfast", "lunch", "dinner"].filter((m) => !activeMeals.includes(m));

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
          
          {activeMeals.map((meal) => (
            <div key={meal} className="flex items-center gap-4">
              <div className="w-24 text-[12px] font-medium text-[#888] capitalize">{meal}</div>
              <div className="flex-1 grid grid-cols-2 gap-3 relative">
                <input type="time" {...register(`${meal}Open` as keyof OnboardingFormValues)} defaultValue={getValues(`${meal}Open` as keyof OnboardingFormValues) as string} className="w-full px-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[13px] text-white outline-none transition-all focus:border-[#FF7A30] scheme-dark" placeholder="Open" />
                <input type="time" {...register(`${meal}Close` as keyof OnboardingFormValues)} defaultValue={getValues(`${meal}Close` as keyof OnboardingFormValues) as string} className="w-full px-3 py-2 pr-8 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-[13px] text-white outline-none transition-all focus:border-[#FF7A30] scheme-dark" placeholder="Close" />
              </div>
              <button type="button" onClick={() => removeMeal(meal)} className="p-1.5 text-[#555] hover:text-[#FF3D57] hover:bg-[#FF3D57]/10 rounded-md transition-colors" title={`Remove ${meal}`}>
                <X size={16} />
              </button>
            </div>
          ))}

          {availableMeals.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center gap-2">
                <div className="relative group">
                  <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2A2A2A] text-[#888] text-[12px] font-medium hover:bg-[#1A1A1A] hover:text-white transition-all cursor-pointer">
                    <Plus size={14} /> Add Column
                  </button>
                  <div className="absolute top-full left-0 mt-1 w-32 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    {availableMeals.map(m => (
                      <button key={m} type="button" onClick={() => addMeal(m)} className="w-full text-left px-3 py-2 text-[12px] text-[#888] hover:text-white hover:bg-[#222] capitalize first:rounded-t-lg last:rounded-b-lg cursor-pointer">
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
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
