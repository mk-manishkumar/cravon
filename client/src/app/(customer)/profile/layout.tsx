"use client";

import { useAuthStore } from "@/store/authStore";
import { User, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfileLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (!user) {
      router.push("/auth/login?redirect=/profile");
    }
  }, [user, router]);

  if (!mounted || !user) return null;

  return (
    <div className="min-h-screen bg-[#e9ecee] py-8">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="bg-white shadow-sm border border-gray-100 flex flex-col">
            {/* Header / Name */}
            <div className="p-6 bg-[#fffaf5] border-b border-gray-50">
              <h1 className="text-[#022A4E] text-lg font-bold uppercase tracking-wide">
                {user.firstName} {user.lastName}
              </h1>
            </div>

            {/* Links */}
            <div className="flex flex-col py-2">
              <Link href="/profile" className={`flex items-center gap-4 px-6 py-4 text-[15px] font-medium transition-colors ${pathname === "/profile" ? "text-gray-900 bg-gray-50 font-bold border-r-4 border-[#022A4E]" : "text-[#4b5563] hover:bg-gray-50"}`}>
                <User size={20} className={pathname === "/profile" ? "text-[#022A4E]" : "text-[#4b5563]"} />
                View Profile
              </Link>

              <Link href="/account" className={`flex items-center gap-4 px-6 py-4 text-[15px] font-medium transition-colors ${pathname === "/account" ? "text-gray-900 bg-gray-50 font-bold border-r-4 border-[#022A4E]" : "text-[#4b5563] hover:bg-gray-50"}`}>
                <Settings size={20} className={pathname === "/account" ? "text-[#022A4E]" : "text-[#4b5563]"} />
                Account Settings
              </Link>
            </div>

            <div className="w-full h-px bg-gray-100" />

            {/* Logout */}
            <div className="py-2 mb-2">
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="w-full flex items-center gap-4 px-6 py-4 text-[15px] font-medium text-[#FF3D57] hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut size={20} className="text-[#FF3D57]" />
                Log out
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-8 lg:col-span-9">{children}</div>
      </div>
    </div>
  );
}
