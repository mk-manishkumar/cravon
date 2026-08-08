import { Utensils } from "lucide-react";

export type DashboardMenuItem = {
  category: string;
  name: string;
  price: number;
  description?: string;
  dietary?: string;
  spiceLevel?: string;
  prepTime?: string;
};

interface Props {
  readonly menu?: readonly DashboardMenuItem[];
}

export default function DashboardMenuDisplay({ menu }: Props) {
  if (!menu || menu.length === 0) return null;

  return (
    <div className="bg-[#111] border border-[#222] rounded-3xl p-8 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Utensils className="text-[#FF7A30]" size={22} /> Your Menu
        </h3>
        <span className="text-sm text-[#888] bg-[#1A1A1A] px-3 py-1 rounded-full border border-[#333]">{menu.length} Items</span>
      </div>

      <div className="space-y-8">
        {Object.entries(
          (menu as DashboardMenuItem[]).reduce(
            (acc, item) => {
              if (!acc[item.category]) acc[item.category] = [];
              acc[item.category].push(item);
              return acc;
            },
            {} as Record<string, DashboardMenuItem[]>,
          ),
        ).map(([category, items]) => (
          <div key={category} className="space-y-4">
            <h4 className="text-[13px] font-bold uppercase tracking-widest text-[#FF7A30] border-b border-[#222] pb-2">{category}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((item) => (
                <div key={item.name} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-4 hover:border-[#FF7A30]/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-semibold text-white">{item.name}</h5>
                    <span className="font-bold text-[#00C853]">₹{item.price}</span>
                  </div>
                  {item.description && <p className="text-xs text-[#888] mb-3">{item.description}</p>}
                  <div className="flex flex-wrap gap-2">
                    {item.dietary && <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.dietary.toLowerCase() === "veg" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"}`}>{item.dietary}</span>}
                    {item.spiceLevel && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20">🌶 {item.spiceLevel}</span>}
                    {item.prepTime && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">⏱ {item.prepTime}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
