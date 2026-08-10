import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/auth.service";
import toast from "react-hot-toast";
import { Trash2, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeleteAccountSection() {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  return (
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
  );
}
