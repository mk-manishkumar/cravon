"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/services/auth.service";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");
  
  const [email, setEmail] = useState(emailParam || "");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !otp) {
      toast.error("Please provide both email and OTP.");
      return;
    }
    
    setIsLoading(true);

    try {
      await authService.verifyRestaurantOtp({ email, otp });
      await useAuthStore.getState().checkAuth();
      toast.success("Email verified! Welcome to Cravon.");
      router.push("/partner/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || err.response?.data?.error || "Invalid OTP.");
      } else {
        toast.error("Something went wrong on our end. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const displayFont = "'Baloo 2', 'Poppins', 'Segoe UI', sans-serif";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A0A0A] flex items-center justify-center p-4">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#FFC93C0A_1px,transparent_1px),linear-gradient(to_bottom,#FF3D570A_1px,transparent_1px)] bg-size-[32px_32px]"></div>

      <div className="relative w-full max-w-md bg-[#111111] rounded-3xl border border-[#222] shadow-[0_30px_80px_-20px_rgba(255,61,87,0.15)] px-8 py-10 sm:px-10 z-10 my-auto">
        {/* Brand */}
        <div className="text-center mb-4">
          <span className="text-[26px] font-extrabold text-white tracking-tight" style={{ fontFamily: displayFont }}>
            Cravon <span className="text-[#FFC93C]">Partner</span>
          </span>
        </div>

        <h2 className="text-[22px] text-white text-center mb-2" style={{ fontFamily: displayFont, fontWeight: 600 }}>
          Verify Your Email
        </h2>
        <p className="text-center text-[#888] text-[13px] mb-8">
          We sent a 6-digit code to <span className="text-white font-semibold">{emailParam || "your email"}</span>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {!emailParam && (
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#777777] mb-1.5" htmlFor="email">
                Email Address
              </label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-xl text-[14px] text-white outline-none transition-all focus:bg-[#222] focus:border-[#FFC93C] focus:ring-1 focus:ring-[#FFC93C]" />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#777777] mb-1.5" htmlFor="otp">
              6-Digit Code
            </label>
            <input 
              id="otp" 
              type="text" 
              maxLength={6}
              required 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
              placeholder="000000"
              className="w-full px-4 py-4 text-center tracking-[0.5em] font-mono font-bold bg-[#1A1A1A] border border-[#333] rounded-xl text-[24px] text-white outline-none transition-all focus:bg-[#222] focus:border-[#FFC93C] focus:ring-1 focus:ring-[#FFC93C]" 
            />
          </div>

          <button type="submit" disabled={isLoading || otp.length < 6} className="cursor-pointer w-full py-3.5 mt-5 rounded-xl text-[14px] font-semibold text-black shadow-lg outline-none focus:ring-4 focus:ring-[#FFC93C]/30 disabled:opacity-70 disabled:cursor-not-allowed transition-colors bg-linear-to-r from-[#FFC93C] to-[#FF7A30] hover:from-[#FFD566] hover:to-[#FF8E4D]">
            {isLoading ? "Verifying..." : "Verify & Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">Loading...</div>}>
      <VerifyOtpForm />
    </Suspense>
  );
}
