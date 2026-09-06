import { useState } from "react";
import { authService } from "@/services/auth.service";
import toast from "react-hot-toast";
import { Lock, KeyRound } from "lucide-react";

export default function CustomerSecuritySection() {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-3xl overflow-hidden mb-8">
      <div className="p-8 border-b border-gray-100">
        <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-gray-900"><Lock size={20} className="text-orange-500"/> Security</h2>
        <p className="text-sm text-gray-500">Update your password to keep your account secure.</p>
      </div>

      <div className="p-8 bg-gray-50/50">
        {!showChangePassword ? (
          <button type="button" onClick={() => setShowChangePassword(true)} className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 px-6 py-3 rounded-xl hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-all cursor-pointer">
            <KeyRound size={16} /> Change Password
          </button>
        ) : (
          <div className="space-y-4 max-w-md animate-in slide-in-from-top-4">
            <div>
              <label htmlFor="oldPassword" className="block text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">Old Password</label>
              <input id="oldPassword" type="password" value={passwordForm.oldPassword} onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 text-gray-900" />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">New Password</label>
              <input id="newPassword" type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 text-gray-900" />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">Confirm New Password</label>
              <input id="confirmPassword" type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-500 text-gray-900" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={handleChangePassword} disabled={isLoading || !passwordForm.oldPassword || !passwordForm.newPassword} className="cursor-pointer px-6 py-2.5 bg-orange-500 text-white text-sm font-bold rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50">Save Password</button>
              <button type="button" onClick={() => setShowChangePassword(false)} className="cursor-pointer px-6 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
