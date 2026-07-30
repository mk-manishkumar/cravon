"use client";

import { useState, useEffect, Suspense } from "react";
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
  const [isResending, setIsResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Handle countdown for resend button
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (!email) {
      toast.error("Email address is required to resend the code.");
      return;
    }
    setIsResending(true);
    try {
      await authService.resendRestaurantOtp({ email });
      toast.success("A new verification code has been sent!");
      setCooldown(60); // 60 seconds cooldown
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || err.response?.data?.error || "Failed to resend code.");
      } else {
        toast.error("Something went wrong on our end. Please try again.");
      }
    } finally {
      setIsResending(false);
    }
  };

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

  let resendButtonText = "Didn't receive a code? Resend";
  if (isResending) {
    resendButtonText = "Sending...";
  } else if (cooldown > 0) {
    resendButtonText = `Resend code in ${cooldown}s`;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#000000] flex items-center justify-center p-4">
      {/* Super Sleek Minimalist Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>

      {/* Main Card Container with Fixed Width */}
      <div className="relative w-full max-w-sm bg-[#0A0A0A] rounded-3xl border border-[#1F1F1F] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] px-8 py-10 z-10 my-auto mx-auto">
        {/* Brand */}
        <div className="text-center mb-2">
          <span className="text-[26px] font-extrabold bg-clip-text text-transparent tracking-tight" style={{ fontFamily: displayFont, backgroundImage: "linear-gradient(135deg, #FF3D57 0%, #FF7A30 55%, #FFC93C 100%)" }}>
            Cravon Partners
          </span>
        </div>

        <h2 className="text-[22px] text-white text-center mb-3" style={{ fontFamily: displayFont, fontWeight: 600 }}>
          Verify Your Email
        </h2>
        <p className="text-center text-[#A1A1AA] text-[13px] mb-6 leading-relaxed">
          We sent a 6-digit code to <br />
          <span className="text-white font-semibold">{emailParam || "your email"}</span>
        </p>

        <div className="flex items-start gap-2.5 bg-[#FF7A30]/10 border border-[#FF7A30]/20 rounded-xl px-4 py-3 mb-8">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-0.5">
            <path d="M8 15A7 7 0 108 1a7 7 0 000 14z" stroke="#FF7A30" strokeWidth="1.4" />
            <path d="M8 8V4M8 11.5h.01" stroke="#FF7A30" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <p className="text-[12px] leading-snug text-[#FF7A30]">This code is only valid for 10 minutes.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {!emailParam && (
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#555555] mb-1.5" htmlFor="email">
                Email Address
              </label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-[#111111] border border-[#222222] rounded-xl text-[14px] text-white outline-none transition-all focus:bg-[#151515] focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30]" />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-widest text-[#555555] mb-1.5 text-center" htmlFor="otp">
              6-Digit Secure Code
            </label>
            <input id="otp" type="text" maxLength={6} required value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="••••••" className="w-full px-4 py-4 text-center tracking-[1em] font-mono font-bold bg-[#111111] border border-[#222222] rounded-xl text-[24px] text-white outline-none transition-all focus:bg-[#151515] focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30]" />
          </div>

          <button type="submit" disabled={isLoading || otp.length < 6} className="cursor-pointer w-full py-3.5 rounded-xl text-[14px] font-semibold text-white shadow-lg outline-none focus:ring-4 focus:ring-[#FF7A30]/30 disabled:opacity-70 disabled:cursor-not-allowed transition-transform active:scale-[0.98]" style={{ backgroundImage: "linear-gradient(135deg, #FF3D57 0%, #FF7A30 100%)" }}>
            {isLoading ? "Verifying..." : "Verify & Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button onClick={handleResend} disabled={cooldown > 0 || isResending} className="text-[13px] font-semibold text-[#888] hover:text-white transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed disabled:hover:text-[#888]">
            {resendButtonText}
          </button>
        </div>
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
