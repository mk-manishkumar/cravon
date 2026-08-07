import { UseFormReturn } from "react-hook-form";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { OnboardingFormValues } from "./schema";

export const StepThreeReview = ({ form, isEditMode }: { form: UseFormReturn<OnboardingFormValues>; isEditMode: boolean }) => {
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
  );
};
