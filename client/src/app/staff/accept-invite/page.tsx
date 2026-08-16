"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { staffService } from "@/services/staff.service";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";

export default function AcceptInvitePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  // Run the accept-invite mutation on load
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["accept-invite", token, user?.id],
    queryFn: async () => {
      const res = await staffService.acceptInvite({ token: token as string, userId: user!.id });
      return res;
    },
    enabled: !!token && !!user,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Derived states
  const showLoading = isLoading;
  const showUnauthorized = !!token && !user;
  const showInvalidToken = !token;
  const showSuccess = !!data;

  // Extract error message
  const err = error as { response?: { data?: { message?: string } } };
  const errorMessage = err?.response?.data?.message || "Failed to accept invite.";

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#111] p-8 rounded-3xl border border-[#222] text-center shadow-2xl">
        {showLoading && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-[#FF7A30] animate-spin mb-4" />
            <h2 className="text-2xl font-bold mb-2">Verifying Invite...</h2>
            <p className="text-[#888]">Please wait while we set up your access.</p>
          </div>
        )}

        {showInvalidToken && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-6">
              <XCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Invalid Link</h2>
            <p className="text-[#888] mb-8">This invite link is invalid or missing a token.</p>
            <button type="button" onClick={() => router.push("/")} className="w-full py-4 bg-[#222] hover:bg-[#333] text-white rounded-xl font-bold transition">
              Return Home
            </button>
          </div>
        )}

        {showUnauthorized && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-[#FF7A30]/20 text-[#FF7A30] rounded-full flex items-center justify-center mb-6">
              <XCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-[#888] mb-8">You must be logged into the account associated with the invited email address to accept this invite.</p>
            <button type="button" onClick={() => router.push("/auth/login")} className="w-full py-4 bg-[#FF7A30] hover:bg-[#FF7A30]/90 text-white rounded-xl font-bold transition">
              Go to Login
            </button>
          </div>
        )}

        {showSuccess && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Invite Accepted!</h2>
            <p className="text-[#888] mb-8">You now have staff access. Welcome to the team!</p>
            <button type="button" onClick={() => router.push(`/dashboard/${data.restaurantId}`)} className="w-full py-4 bg-[#FF7A30] hover:bg-[#FF7A30]/90 text-white rounded-xl font-bold transition">
              Go to Restaurant Dashboard
            </button>
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-6">
              <XCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Invite Failed</h2>
            <p className="text-[#888] mb-8">{errorMessage}</p>
            <button type="button" onClick={() => router.push("/")} className="w-full py-4 bg-[#222] hover:bg-[#333] text-white rounded-xl font-bold transition">
              Return Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
