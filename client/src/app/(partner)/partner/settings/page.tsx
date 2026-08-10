"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/auth.service";
import toast from "react-hot-toast";
import { Edit2, Save, X, Lock, Trash2, KeyRound, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AccountSettingsPage() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  // Profile Edit States
  const [editingField, setEditingField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    email: user?.email || "",
  });

  // Email OTP States
  const [showEmailOtp, setShowEmailOtp] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");

  // Section Toggles
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);

  // Forms
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [deletePassword, setDeletePassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // Handlers
  const handleProfileUpdate = async (field: string) => {
    try {
      setIsLoading(true);
      if (field === "email") {
        await authService.requestEmailChange({ newEmail: formData.email });
        setShowEmailOtp(true);
        toast.success("OTP sent to your new email");
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const payload: any = {};
        if (field === "name") {
          payload.firstName = formData.firstName;
          payload.lastName = formData.lastName;
        } else if (field === "phone") {
          payload.phone = formData.phone;
        }
        
        await authService.updateProfile(payload);
        updateUser(payload);
        toast.success("Profile updated successfully");
        setEditingField(null);
      }
    } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      setIsLoading(true);
      await authService.verifyEmailChange({ newEmail: formData.email, otp: emailOtp });
      updateUser({ email: formData.email });
      toast.success("Email updated successfully");
      setShowEmailOtp(false);
      setEditingField(null);
      setEmailOtp("");
    } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error("New passwords do not match");
    }
    try {
      setIsLoading(true);
      await authService.changePassword({ oldPassword: passwordForm.oldPassword, newPassword: passwordForm.newPassword });
      toast.success("Password changed successfully");
      setShowChangePassword(false);
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true);
      await authService.deleteAccount({ password: deletePassword });
      toast.success("Account deleted successfully");
      logout();
      router.push("/login");
    } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to delete account");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex-1 p-8 text-white max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold mb-2">Account Settings</h1>
      <p className="text-[#888] mb-10">Manage your personal information and security preferences.</p>

      {/* Profile Section */}
      <div className="bg-[#111] border border-[#222] rounded-3xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF7A30]/5 rounded-full blur-3xl pointer-events-none"></div>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10"><UserIcon /> Profile Details</h2>
        
        <div className="space-y-6 relative z-10">
          {/* Name Field */}
          <div className="flex items-center justify-between p-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl hover:border-[#333] transition-colors group">
            <div className="flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#777] mb-1">Full Name</p>
              {editingField === "name" ? (
                <div className="flex gap-3 mt-1">
                  <input value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="bg-[#222] border border-[#333] rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#FF7A30] w-1/3" placeholder="First Name" />
                  <input value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="bg-[#222] border border-[#333] rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#FF7A30] w-1/3" placeholder="Last Name" />
                </div>
              ) : (
                <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
              )}
            </div>
            <div className="flex gap-2">
              {editingField === "name" ? (
                <>
                  <button type="button" onClick={() => handleProfileUpdate("name")} disabled={isLoading} className="p-2 bg-[#00C853]/10 text-[#00C853] hover:bg-[#00C853]/20 rounded-xl transition-colors cursor-pointer"><Save size={18} /></button>
                  <button type="button" onClick={() => setEditingField(null)} className="p-2 bg-[#FF3D57]/10 text-[#FF3D57] hover:bg-[#FF3D57]/20 rounded-xl transition-colors cursor-pointer"><X size={18} /></button>
                </>
              ) : (
                <button type="button" onClick={() => setEditingField("name")} className="p-2 text-[#666] hover:text-[#FF7A30] hover:bg-[#FF7A30]/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"><Edit2 size={18} /></button>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div className="flex items-center justify-between p-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl hover:border-[#333] transition-colors group">
            <div className="flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#777] mb-1">Email Address</p>
              {editingField === "email" ? (
                <div className="flex gap-3 items-center mt-1">
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="bg-[#222] border border-[#333] rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#FF7A30] w-2/3" placeholder="New Email" />
                </div>
              ) : (
                <p className="text-sm font-medium">{user.email}</p>
              )}
              {showEmailOtp && (
                <div className="mt-3 flex gap-3 items-center animate-in slide-in-from-top-2">
                  <input type="text" value={emailOtp} onChange={(e) => setEmailOtp(e.target.value)} maxLength={6} className="bg-[#222] border border-[#333] rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#FF7A30] w-32 tracking-widest text-center" placeholder="OTP" />
                  <button type="button" onClick={handleVerifyEmail} disabled={isLoading || emailOtp.length !== 6} className="px-4 py-1.5 bg-[#FF7A30] text-white text-xs font-bold rounded-lg hover:bg-[#FF8E4D] transition-colors disabled:opacity-50 cursor-pointer">Verify</button>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {editingField === "email" ? (
                <>
                  {!showEmailOtp && <button type="button" onClick={() => handleProfileUpdate("email")} disabled={isLoading} className="p-2 bg-[#00C853]/10 text-[#00C853] hover:bg-[#00C853]/20 rounded-xl transition-colors cursor-pointer"><Save size={18} /></button>}
                  <button type="button" onClick={() => { setEditingField(null); setShowEmailOtp(false); setEmailOtp(""); setFormData({...formData, email: user.email}); }} className="p-2 bg-[#FF3D57]/10 text-[#FF3D57] hover:bg-[#FF3D57]/20 rounded-xl transition-colors cursor-pointer"><X size={18} /></button>
                </>
              ) : (
                <button type="button" onClick={() => setEditingField("email")} className="p-2 text-[#666] hover:text-[#FF7A30] hover:bg-[#FF7A30]/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"><Edit2 size={18} /></button>
              )}
            </div>
          </div>

          {/* Phone Field */}
          <div className="flex items-center justify-between p-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl hover:border-[#333] transition-colors group">
            <div className="flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-[#777] mb-1">Phone Number</p>
              {editingField === "phone" ? (
                <input value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="mt-1 bg-[#222] border border-[#333] rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#FF7A30] w-1/3" placeholder="Phone Number" />
              ) : (
                <p className="text-sm font-medium">{user.phone || "Not provided"}</p>
              )}
            </div>
            <div className="flex gap-2">
              {editingField === "phone" ? (
                <>
                  <button type="button" onClick={() => handleProfileUpdate("phone")} disabled={isLoading} className="p-2 bg-[#00C853]/10 text-[#00C853] hover:bg-[#00C853]/20 rounded-xl transition-colors cursor-pointer"><Save size={18} /></button>
                  <button type="button" onClick={() => { setEditingField(null); setFormData({...formData, phone: user.phone || ""}); }} className="p-2 bg-[#FF3D57]/10 text-[#FF3D57] hover:bg-[#FF3D57]/20 rounded-xl transition-colors cursor-pointer"><X size={18} /></button>
                </>
              ) : (
                <button type="button" onClick={() => setEditingField("phone")} className="p-2 text-[#666] hover:text-[#FF7A30] hover:bg-[#FF7A30]/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"><Edit2 size={18} /></button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-[#111] border border-[#222] rounded-3xl overflow-hidden mb-8">
        <div className="p-8 border-b border-[#222]">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Lock size={20} className="text-[#FF7A30]"/> Security</h2>
          <p className="text-sm text-[#888]">Update your password to keep your account secure.</p>
        </div>

        <div className="p-8 bg-[#151515]">
          {!showChangePassword ? (
            <button type="button" onClick={() => setShowChangePassword(true)} className="flex items-center gap-2 text-sm font-semibold text-white bg-[#222] border border-[#333] px-6 py-3 rounded-xl hover:bg-[#FF7A30] hover:border-[#FF7A30] transition-all cursor-pointer">
              <KeyRound size={16} /> Change Password
            </button>
          ) : (
            <div className="space-y-4 max-w-md animate-in slide-in-from-top-4">
              <div>
                <label htmlFor="oldPassword" className="block text-[11px] font-semibold uppercase tracking-widest text-[#777] mb-1.5">Old Password</label>
                <input id="oldPassword" type="password" value={passwordForm.oldPassword} onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})} className="w-full bg-[#222] border border-[#333] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FF7A30]" />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-[11px] font-semibold uppercase tracking-widest text-[#777] mb-1.5">New Password</label>
                <input id="newPassword" type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})} className="w-full bg-[#222] border border-[#333] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FF7A30]" />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-[11px] font-semibold uppercase tracking-widest text-[#777] mb-1.5">Confirm New Password</label>
                <input id="confirmPassword" type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} className="w-full bg-[#222] border border-[#333] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FF7A30]" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={handleChangePassword} disabled={isLoading || !passwordForm.oldPassword || !passwordForm.newPassword} className="cursor-pointer px-6 py-2.5 bg-[#FF7A30] text-white text-sm font-bold rounded-xl hover:bg-[#FF8E4D] transition-colors disabled:opacity-50">Save Password</button>
                <button type="button" onClick={() => setShowChangePassword(false)} className="cursor-pointer px-6 py-2.5 bg-transparent border border-[#333] text-white text-sm font-bold rounded-xl hover:bg-[#222] transition-colors">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-[#111] border border-[#3A1515] rounded-3xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#FF3D57] to-transparent opacity-20"></div>
        <div className="p-8">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-[#FF3D57]"><AlertTriangle size={20} /> Danger Zone</h2>
          <p className="text-sm text-[#888] mb-6">Permanently delete your account and all associated restaurant data. This action cannot be undone.</p>

          {!showDeleteAccount ? (
            <button type="button" onClick={() => setShowDeleteAccount(true)} className="flex items-center gap-2 text-sm font-semibold text-[#FF3D57] bg-[#FF3D57]/10 border border-[#FF3D57]/20 px-6 py-3 rounded-xl hover:bg-[#FF3D57] hover:text-white transition-all cursor-pointer">
              <Trash2 size={16} /> Delete Account
            </button>
          ) : (
            <div className="p-6 bg-[#3A1515]/30 border border-[#FF3D57]/20 rounded-2xl max-w-md animate-in slide-in-from-top-4">
              <p className="text-sm text-[#FF3D57] mb-4 font-medium">Please enter your password to confirm deletion.</p>
              <input type="password" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} placeholder="Enter password" className="w-full bg-[#1A1A1A] border border-[#FF3D57]/30 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-[#FF3D57] mb-4" />
              <div className="flex gap-3">
                <button type="button" onClick={handleDeleteAccount} disabled={isLoading || !deletePassword} className="cursor-pointer px-6 py-2.5 bg-[#FF3D57] text-white text-sm font-bold rounded-xl hover:bg-[#FF5269] transition-colors disabled:opacity-50">Confirm Deletion</button>
                <button type="button" onClick={() => { setShowDeleteAccount(false); setDeletePassword(""); }} className="cursor-pointer px-6 py-2.5 bg-transparent border border-[#333] text-white text-sm font-bold rounded-xl hover:bg-[#222] transition-colors">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Simple user icon to avoid extra lucide imports
function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF7A30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
