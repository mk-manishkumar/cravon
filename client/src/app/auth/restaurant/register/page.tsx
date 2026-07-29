"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import axios from "axios";
import toast from "react-hot-toast";

export default function RestaurantRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authService.registerRestaurant(formData);
      toast.success("Application submitted successfully! Please verify your email.");
      router.push(`/auth/restaurant/verify?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || err.response?.data?.error || "We couldn't create your partner account.");
      } else {
        toast.error("Something went wrong on our end. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const displayFont = "'Baloo 2', 'Poppins', 'Segoe UI', sans-serif";

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0A0A0A] flex items-center justify-center p-4 py-12">
      {/* Sleek Dark Atmospheric Background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 flex items-center justify-center">
        <div className="absolute top-0 right-0 h-125 w-125 rounded-full bg-[#FF7A30] opacity-[0.03] blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-125 w-125 rounded-full bg-[#FF3D57] opacity-[0.03] blur-[120px]" />
      </div>

      <div className="relative w-full max-w-lg bg-[#121212] rounded-3xl border border-[#222222] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] px-8 py-8 sm:px-10 z-10 my-auto">
        {/* Brand */}
        <div className="text-center mb-5">
          <span className="text-[28px] font-extrabold bg-clip-text text-transparent" style={{ fontFamily: displayFont, backgroundImage: "linear-gradient(135deg, #FF3D57 0%, #FF7A30 55%, #FFC93C 100%)" }}>
            Cravon Partners
          </span>
        </div>

        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="flex h-2 w-2 rounded-full bg-[#FF7A30] shadow-[0_0_8px_rgba(255,122,48,0.6)] animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#888888]">Restaurant Portal</span>
        </div>

        <h2 className="text-[24px] text-white text-center mb-6" style={{ fontFamily: displayFont, fontWeight: 600 }}>
          Apply to Partner
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#777777] mb-1.5" htmlFor="firstName">
                Owner First Name
              </label>
              <input id="firstName" name="firstName" type="text" required value={formData.firstName} onChange={handleChange} className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-[14px] text-white outline-none transition-all focus:bg-[#222222] focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30]" />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#777777] mb-1.5" htmlFor="lastName">
                Owner Last Name
              </label>
              <input id="lastName" name="lastName" type="text" required value={formData.lastName} onChange={handleChange} className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-[14px] text-white outline-none transition-all focus:bg-[#222222] focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30]" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#777777] mb-1.5" htmlFor="email">
              Business Email
            </label>
            <input id="email" name="email" type="email" required autoComplete="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-[14px] text-white placeholder:text-[#555555] outline-none transition-all focus:bg-[#222222] focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30]" />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#777777] mb-1.5" htmlFor="phone">
              Business Phone
            </label>
            <input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-[14px] text-white placeholder:text-[#555555] outline-none transition-all focus:bg-[#222222] focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30]" />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#777777] mb-1.5" htmlFor="password">
              Secure Password
            </label>
            <div className="relative">
              <input id="password" name="password" type={showPassword ? "text" : "password"} required autoComplete="new-password" value={formData.password} onChange={handleChange} className="w-full px-4 py-3 pr-11 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl text-[14px] text-white placeholder:text-[#555555] outline-none transition-all focus:bg-[#222222] focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30]" />
              <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#555555] hover:text-white transition-colors cursor-pointer">
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.3 5.3A9.6 9.6 0 0112 5c5.4 0 9 5 9 7-1.06 1.6-2.34 3.16-3.98 4.36M6.6 6.6C4.6 7.9 3 10.1 3 12c0 2 3.6 7 9 7 1.1 0 2.14-.2 3.1-.56" strokeLinecap="round" strokeLinejoin="round" /></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 12c0-2 3.6-7 9-7s9 5 9 7-3.6 7-9 7-9-5-9-7z" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="cursor-pointer w-full py-3.5 mt-4 rounded-xl text-[14px] font-semibold text-white shadow-lg outline-none focus:ring-4 focus:ring-[#FF7A30]/30 disabled:opacity-70 disabled:cursor-not-allowed transition-transform active:scale-[0.98]" style={{ backgroundImage: "linear-gradient(135deg, #FF3D57 0%, #FF7A30 100%)" }}>
            {isLoading ? "Submitting Application..." : "Apply Now"}
          </button>
        </form>

        <div className="mt-6 flex flex-col items-center gap-3">
          <p className="text-center text-[13px] text-[#666666]">
            Already a partner?{" "}
            <Link href="/auth/restaurant/login" className="font-semibold text-white hover:text-[#FF7A30] transition-colors">
              Log in to Dashboard
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
