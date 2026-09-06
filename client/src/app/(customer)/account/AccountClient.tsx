"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CustomerProfileSection from "@/components/customer/account/CustomerProfileSection";
import CustomerAddressSection from "@/components/customer/account/CustomerAddressSection";
import CustomerSecuritySection from "@/components/customer/account/CustomerSecuritySection";
import CustomerDeleteAccountSection from "@/components/customer/account/CustomerDeleteAccountSection";

export default function CustomerAccountSettingsPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (!user) {
      router.push("/auth/login?redirect=/account");
    }
  }, [user, router]);

  if (!mounted || !user) return null;

  return (
    <div className="bg-[#e9ecee] min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Account Settings</h1>
        <p className="text-gray-600 mb-10">Manage your personal information, security preferences, and delivery addresses.</p>

        <CustomerProfileSection />
        <CustomerAddressSection />
        <CustomerSecuritySection />
        <CustomerDeleteAccountSection />
      </div>
    </div>
  );
}
