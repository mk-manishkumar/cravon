import { useState } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import { UploadCloud, FileSpreadsheet, Trash2, CheckCircle2 } from "lucide-react";
import Papa from "papaparse";
import { OnboardingFormValues } from "./schema";

export const StepThreeMenu = ({ form }: { form: UseFormReturn<OnboardingFormValues> }) => {
  const { setValue, control, formState: { errors } } = form;
  const menuItems = useWatch({ control, name: "menu" }) || [];
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    setParseError(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setIsParsing(false);
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const parsedMenu = results.data.map((row: any) => {
            const price = Number.parseFloat(row["Price"] || "0");
            if (!row["Dish Name"]) throw new Error("A row is missing the 'Dish Name'. Please check your CSV.");
            if (Number.isNaN(price)) throw new Error(`Invalid price for dish '${row["Dish Name"]}'.`);

            return {
              category: row["Category"] || "Uncategorized",
              name: row["Dish Name"],
              price: price,
              dietary: row["Dietary Type"] || "",
              spiceLevel: row["Spice Level"] || "",
              prepTime: row["Prep Time"] || "",
              mealType: row["Meal Type"] || "",
              description: row["Description"] || ""
            };
          });

          if (parsedMenu.length === 0) throw new Error("No menu items found in the file.");
          
          setValue("menu", parsedMenu, { shouldValidate: true, shouldDirty: true });
        } catch (err: unknown) {
          if (err instanceof Error) {
            setParseError(err.message);
          } else {
            setParseError("An unknown error occurred while parsing the CSV.");
          }
        }
        
        // Reset file input so same file can be uploaded again if needed
        e.target.value = "";
      },
      error: (error) => {
        setIsParsing(false);
        setParseError(`CSV Parsing Error: ${error.message}`);
      }
    });
  };

  const clearMenu = () => {
    setValue("menu", [], { shouldValidate: true, shouldDirty: true });
  };

  // Group menu items by category for preview
  const groupedMenu = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof menuItems>);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="bg-[#111] border border-[#222] rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-lg flex items-center gap-2">
            <FileSpreadsheet className="text-[#FF7A30]" size={20} /> Menu Upload
          </h3>
        </div>
        
        <p className="text-[#888] text-sm leading-relaxed mb-6">
          Upload your restaurant&apos;s menu using a CSV or Excel file.
        </p>

        {menuItems.length === 0 ? (
          <div className="border-2 border-dashed border-[#2A2A2A] rounded-xl p-10 flex flex-col items-center justify-center text-center relative hover:bg-[#1A1A1A] hover:border-[#FF7A30] transition-all group">
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleFileUpload} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              disabled={isParsing}
            />
            <div className="w-16 h-16 bg-[#222] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <UploadCloud className="text-[#555] group-hover:text-[#FF7A30]" size={32} />
            </div>
            <h4 className="text-white font-semibold text-[15px] mb-2">{isParsing ? "Parsing File..." : "Click or Drag to Upload CSV"}</h4>
            <p className="text-[#666] text-xs">Only .csv files are supported</p>
          </div>
        ) : (
          <div className="border border-[#00C853]/20 bg-[#00C853]/5 rounded-xl p-6 relative">
            <button type="button" onClick={clearMenu} className="absolute top-4 right-4 text-[#FF3D57] hover:text-[#FF4E66] transition-colors cursor-pointer" title="Remove Menu">
              <Trash2 size={18} />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#00C853]/20 rounded-full flex items-center justify-center text-[#00C853]">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h4 className="text-white font-semibold text-[15px]">Menu Uploaded Successfully</h4>
                <p className="text-[#888] text-xs">{menuItems.length} items parsed</p>
              </div>
            </div>

            <div className="space-y-6 max-h-75 overflow-y-auto pr-2 custom-scrollbar">
              {Object.entries(groupedMenu).map(([category, items]) => (
                <div key={category} className="space-y-3">
                  <h5 className="text-[11px] font-semibold uppercase tracking-widest text-[#FF7A30] border-b border-[#2A2A2A] pb-2">{category}</h5>
                  <div className="grid grid-cols-1 gap-2">
                    {items.map((item) => (
                      <div key={item.name} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-3 flex justify-between items-start">
                        <div>
                          <div className="text-white text-sm font-medium">{item.name}</div>
                          <div className="text-[#666] text-xs mt-1 flex flex-wrap gap-2">
                            {item.dietary && <span>• {item.dietary}</span>}
                            {item.mealType && <span>• {item.mealType}</span>}
                            {item.prepTime && <span>• ⏱ {item.prepTime}</span>}
                          </div>
                        </div>
                        <div className="text-white font-semibold text-sm">₹{item.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {parseError && (
          <div className="mt-4 p-4 bg-[#FF3D57]/10 border border-[#FF3D57]/20 rounded-xl text-[#FF3D57] text-sm">
            {parseError}
          </div>
        )}
        
        {errors.menu && (
          <p className="text-[#FF3D57] text-xs mt-4">Please upload your menu to continue.</p>
        )}
      </div>
    </div>
  );
};
