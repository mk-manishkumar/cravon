import { useState } from "react";
import { authService } from "@/services/auth.service";
import toast from "react-hot-toast";
import { Lock, KeyRound } from "lucide-react";

export default function SecuritySection() {
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
              <input id="oldPassword" type="password" value={passwordForm.oldPassword} onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})} className="w-full bg-[#222] border border-[#333] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FF7A30] text-white" />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-[11px] font-semibold uppercase tracking-widest text-[#777] mb-1.5">New Password</label>
              <input id="newPassword" type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})} className="w-full bg-[#222] border border-[#333] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FF7A30] text-white" />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-[11px] font-semibold uppercase tracking-widest text-[#777] mb-1.5">Confirm New Password</label>
              <input id="confirmPassword" type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} className="w-full bg-[#222] border border-[#333] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#FF7A30] text-white" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={handleChangePassword} disabled={isLoading || !passwordForm.oldPassword || !passwordForm.newPassword} className="cursor-pointer px-6 py-2.5 bg-[#FF7A30] text-white text-sm font-bold rounded-xl hover:bg-[#FF8E4D] transition-colors disabled:opacity-50">Save Password</button>
              <button type="button" onClick={() => setShowChangePassword(false)} className="cursor-pointer px-6 py-2.5 bg-transparent border border-[#333] text-white text-sm font-bold rounded-xl hover:bg-[#222] transition-colors">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
