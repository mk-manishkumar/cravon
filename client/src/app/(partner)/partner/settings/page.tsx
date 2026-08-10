"use client";

import { useAuthStore } from "@/store/authStore";
import ProfileSection from "./components/ProfileSection";
import SecuritySection from "./components/SecuritySection";
import DeleteAccountSection from "./components/DeleteAccountSection";

export default function AccountSettingsPage() {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  return (
    <div className="flex-1 p-8 text-white max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
      <p className="text-[#888] mb-10">Manage your personal information and security preferences.</p>

      <ProfileSection />
      <SecuritySection />
      <DeleteAccountSection />
    </div>
  );
}
