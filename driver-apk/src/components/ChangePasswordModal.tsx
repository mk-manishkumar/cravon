import { useState } from "react";
import { X, KeyRound, Loader2, CheckCircle2 } from "lucide-react";
import api from "../lib/axios";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    setError(null);
    setSuccessMessage(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 4) {
      setError("New password must be at least 4 characters");
      return;
    }

    try {
      setIsLoading(true);
      await api.put("/driver/change-password", {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });

      setSuccessMessage("Password changed successfully!");
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err: unknown) {
      console.error("Change password failed:", err);
      const apiErr = err as { response?: { data?: { message?: string } } };
      setError(apiErr.response?.data?.message || "Failed to change password. Please check your old password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-100/70 text-[#FF7A30] flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-gray-900 leading-tight">Change Password</h2>
              <p className="text-xs text-gray-500">Update your driver password</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-xs rounded-xl p-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form id="change-password-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="oldPassword"
                className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider"
              >
                Old Password
              </label>
              <input
                id="oldPassword"
                type="password"
                required
                value={passwordForm.oldPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    oldPassword: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF7A30]/20 focus:border-[#FF7A30] transition-colors"
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider"
              >
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                required
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF7A30]/20 focus:border-[#FF7A30] transition-colors"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF7A30]/20 focus:border-[#FF7A30] transition-colors"
                placeholder="Confirm new password"
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/80">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-xs sm:text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="change-password-form"
            disabled={
              isLoading ||
              !passwordForm.oldPassword ||
              !passwordForm.newPassword ||
              !passwordForm.confirmPassword
            }
            className="flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-bold text-white bg-[#FF7A30] hover:bg-[#e66a25] rounded-xl shadow-md shadow-orange-500/20 disabled:opacity-50 cursor-pointer transition-all"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? "Saving..." : "Save Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
