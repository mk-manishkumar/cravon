"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import axios from "axios";
import toast from "react-hot-toast";

import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authService.login({ email, password });
      await useAuthStore.getState().checkAuth();
      toast.success("Welcome back!");
      router.push("/");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || err.response?.data?.error || "We couldn't sign you in.");
      } else {
        toast.error("Something went wrong on our end. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const displayFont = "'Baloo 2', 'Poppins', 'Segoe UI', sans-serif";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FFF3EA] flex items-center justify-center p-4">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-[#FF3D57] opacity-20 blur-[100px]" />
        <div className="absolute top-1/3 -right-32 h-112 w-md rounded-full bg-[#FFC93C] opacity-25 blur-[110px]" />
        <div className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-[#FF7A30] opacity-20 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-105 bg-white rounded-[28px] shadow-[0_20px_60px_-15px_rgba(255,61,87,0.25)] px-8 py-10 sm:px-10">
        {/* Brand */}
        <div className="text-center mb-4">
          <span className="text-[32px] font-extrabold bg-clip-text text-transparent" style={{ fontFamily: displayFont, backgroundImage: "linear-gradient(135deg, #FF3D57 0%, #FF7A30 55%, #FFC93C 100%)" }}>
            Cravon
          </span>
        </div>

        <h2 className="text-[26px] text-[#2B1210] text-center mb-6" style={{ fontFamily: displayFont, fontWeight: 700 }}>
          Welcome back
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          <div>
            <label className="block text-[12px] font-bold uppercase tracking-[0.04em] text-[#B08A81] mb-1.5" htmlFor="email">
              Email address
            </label>
            <input id="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-4 py-3 bg-[#FFFBF8] border-[1.5px] border-[#F1E1D6] rounded-2xl text-[15px] text-[#2B1210] placeholder:text-[#C9B3AA] outline-none transition-all focus:bg-white focus:border-[#FF7A30] focus:ring-4 focus:ring-[#FF7A30]/12" />
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-1.5">
              <label className="text-[12px] font-bold uppercase tracking-[0.04em] text-[#B08A81]" htmlFor="password">
                Password
              </label>
            </div>
            <div className="relative">
              <input id="password" type={showPassword ? "text" : "password"} required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 pr-11 bg-[#FFFBF8] border-[1.5px] border-[#F1E1D6] rounded-2xl text-[15px] text-[#2B1210] placeholder:text-[#C9B3AA] outline-none transition-all focus:bg-white focus:border-[#FF7A30] focus:ring-4 focus:ring-[#FF7A30]/12" />
              <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#C9B3AA] hover:text-[#2B1210] transition-colors">
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.3 5.3A9.6 9.6 0 0112 5c5.4 0 9 5 9 7-1.06 1.6-2.34 3.16-3.98 4.36M6.6 6.6C4.6 7.9 3 10.1 3 12c0 2 3.6 7 9 7 1.1 0 2.14-.2 3.1-.56" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M3 12c0-2 3.6-7 9-7s9 5 9 7-3.6 7-9 7-9-5-9-7z" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="12" r="2.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="cursor-pointer w-full py-3.5 rounded-full text-[15px] font-bold text-white shadow-[0_12px_24px_-8px_rgba(255,61,87,0.55)] outline-none focus:ring-4 focus:ring-[#FF3D57]/25 disabled:opacity-80 disabled:cursor-not-allowed transition-transform active:scale-[0.98]" style={{ fontFamily: displayFont, backgroundImage: "linear-gradient(135deg, #FF3D57 0%, #FF7A30 55%, #FFC93C 100%)" }}>
            {isLoading ? (
              <span className="flex items-center justify-center gap-1.5">
                {"Signing in"}
                <span className="flex gap-0.5 ml-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-bounce [animation-delay:-0.2s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-bounce [animation-delay:-0.1s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-bounce" />
                </span>
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="mt-7 flex flex-col items-center gap-3">
          <p className="text-center text-[14px] text-[#8A6F68]">
            New to Cravon?{" "}
            <Link href="/auth/register" className="font-bold text-[#FF3D57] hover:text-[#E22B45] transition-colors">
              Create an account
            </Link>
          </p>
          <div className="w-full h-1px bg-linear-to-r from-transparent via-[#F1E1D6] to-transparent my-1" />
          <Link href="/auth/restaurant/login" className="flex items-center justify-center w-full py-2.5 rounded-xl border-2 border-[#FFC93C]/30 text-[14px] font-bold text-[#FF7A30] hover:bg-[#FFFBF8] transition-colors">
            Login as a Partner
          </Link>
        </div>
      </div>
    </div>
  );
}
