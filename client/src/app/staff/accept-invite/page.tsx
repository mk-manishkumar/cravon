"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2, User as UserIcon, Lock } from "lucide-react";
import { staffService } from "@/services/staff.service";
import { useAuthStore } from "@/store/authStore";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function AcceptInvitePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
  });

  // 1. Fetch Invite Details (Runs immediately if token exists)
  const { data: inviteDetails, isLoading: detailsLoading, isError: detailsError, error: detailsErrObj } = useQuery({
    queryKey: ["invite-details", token],
    queryFn: async () => {
      return await staffService.getInviteDetails(token as string);
    },
    enabled: !!token,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // 2. Accept Invite for EXISTING user (Runs if user is logged in & invite details say account exists)
  const { data: acceptData, isLoading: acceptLoading, isError: acceptError, error: acceptErrObj } = useQuery({
    queryKey: ["accept-invite-existing", token, user?.id],
    queryFn: async () => {
      return await staffService.acceptInvite({ token: token as string, userId: user!.id });
    },
    enabled: !!token && !!user && !!inviteDetails?.accountExists,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // 3. Accept Invite for NEW user (Mutation)
  const registerMutation = useMutation({
    mutationFn: async () => {
      return await staffService.acceptInviteNewUser({
        token,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
      });
    },
    onSuccess: async () => {
      toast.success("Account created successfully!");
      // Fetch the new user session
      await checkAuth();
      router.push("/partner/dashboard");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to create account");
    },
  });

  // --- DERIVED STATES ---
  const isInvalidToken = !token;
  const isGlobalLoading = detailsLoading || (user && acceptLoading);
  const showSuccessExisting = !!acceptData;
  const showRegistrationForm = inviteDetails && !inviteDetails.accountExists;
  const showAuthRequired = inviteDetails && inviteDetails.accountExists && !user;

  // Extract error messages
  const errDetail = detailsErrObj as any;
  const errAccept = acceptErrObj as any;
  const globalErrorMsg = errDetail?.response?.data?.message || errAccept?.response?.data?.message;
  const isGlobalError = detailsError || acceptError;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    registerMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#111] p-8 rounded-3xl border border-[#222] text-center shadow-2xl relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[150px] bg-[#FF7A30]/10 rounded-full blur-[80px] -z-10 pointer-events-none" />

        {isInvalidToken && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
              <XCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Invalid Link</h2>
            <p className="text-[#888] mb-8">This invite link is invalid or missing a token.</p>
            <button type="button" onClick={() => router.push("/")} className="w-full py-4 bg-[#222] hover:bg-[#333] text-white rounded-xl font-bold transition cursor-pointer">
              Return Home
            </button>
          </div>
        )}

        {isGlobalLoading && (
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-[#FF7A30] animate-spin mb-4" />
            <h2 className="text-2xl font-bold mb-2">Verifying Invite...</h2>
            <p className="text-[#888]">Please wait while we check your access.</p>
          </div>
        )}

        {isGlobalError && !isGlobalLoading && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6 border border-red-500/20">
              <XCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Invite Failed</h2>
            <p className="text-[#888] mb-8">{globalErrorMsg || "Failed to process invite."}</p>
            <button type="button" onClick={() => router.push("/")} className="w-full py-4 bg-[#222] hover:bg-[#333] text-white rounded-xl font-bold transition cursor-pointer">
              Return Home
            </button>
          </div>
        )}

        {showAuthRequired && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-[#FF7A30]/10 text-[#FF7A30] rounded-full flex items-center justify-center mb-6 border border-[#FF7A30]/20">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-white">Authentication Required</h2>
            <p className="text-[#888] mb-6">
              You already have a Cravon account associated with <span className="text-white font-medium">{inviteDetails?.email}</span>. Please log in to accept your invite to <span className="text-[#FF7A30] font-medium">{inviteDetails?.restaurantName}</span>.
            </p>
            <button type="button" onClick={() => router.push("/auth/restaurant/login")} className="w-full py-4 bg-gradient-to-r from-[#FF7A30] to-[#FF5E00] hover:scale-[1.02] text-white rounded-xl font-bold transition-all shadow-lg cursor-pointer">
              Go to Login
            </button>
          </div>
        )}

        {showSuccessExisting && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6 border border-green-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-white">Invite Accepted!</h2>
            <p className="text-[#888] mb-8">You now have staff access to <span className="text-white font-medium">{inviteDetails?.restaurantName}</span>. Welcome to the team!</p>
            <button type="button" onClick={() => router.push("/partner/dashboard")} className="w-full py-4 bg-gradient-to-r from-[#FF7A30] to-[#FF5E00] hover:scale-[1.02] text-white rounded-xl font-bold transition-all shadow-lg cursor-pointer">
              Go to Dashboard
            </button>
          </div>
        )}

        {showRegistrationForm && (
          <div className="text-left animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#FF7A30]/10 text-[#FF7A30] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#FF7A30]/20">
                <UserIcon className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Welcome to the Team!</h2>
              <p className="text-[#888]">
                You've been invited to join <span className="text-[#FF7A30] font-medium">{inviteDetails?.restaurantName}</span>. 
                Set up your profile to accept the invite.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#888] mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={inviteDetails?.email} 
                  disabled
                  className="w-full px-4 py-3 bg-[#1A1A1A] border border-[#333] rounded-xl text-[#888] cursor-not-allowed outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#888] mb-1">First Name</label>
                  <input 
                    type="text" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    placeholder="John"
                    className="w-full px-4 py-3 bg-transparent border border-[#333] rounded-xl text-white focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30] transition outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#888] mb-1">Last Name</label>
                  <input 
                    type="text" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    placeholder="Doe"
                    className="w-full px-4 py-3 bg-transparent border border-[#333] rounded-xl text-white focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30] transition outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#888] mb-1">Create Password</label>
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-transparent border border-[#333] rounded-xl text-white focus:border-[#FF7A30] focus:ring-1 focus:ring-[#FF7A30] transition outline-none"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={registerMutation.isPending}
                className="w-full py-4 mt-6 bg-gradient-to-r from-[#FF7A30] to-[#FF5E00] hover:scale-[1.02] text-white rounded-xl font-bold transition-all shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {registerMutation.isPending && <Loader2 className="w-5 h-5 animate-spin" />}
                Create Account & Accept
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
