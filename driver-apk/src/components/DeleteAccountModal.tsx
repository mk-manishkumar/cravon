import { useState } from "react";
import { X, AlertTriangle, Trash2, Loader2 } from "lucide-react";
import api from "../lib/axios";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteAccountModal({ isOpen, onClose, onSuccess }: DeleteAccountModalProps) {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setPassword("");
    setError(null);
    onClose();
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    try {
      setIsLoading(true);
      await api.delete("/driver/account", {
        data: { password },
      });
      handleClose();
      onSuccess();
    } catch (err: unknown) {
      console.error("Delete account failed:", err);
      const apiErr = err as { response?: { data?: { message?: string } } };
      setError(apiErr.response?.data?.message || "Failed to delete account. Please verify your password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] border border-red-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-red-100 bg-red-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-red-600 leading-tight">Delete Account</h2>
              <p className="text-xs text-gray-500">Danger Zone</p>
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
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
            <p className="text-xs text-red-700 leading-relaxed font-medium">
              Permanently delete your driver account and all associated delivery records. This action cannot be undone.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3">
              {error}
            </div>
          )}

          <form id="delete-account-form" onSubmit={handleDelete} className="space-y-4">
            <div>
              <label
                htmlFor="deletePassword"
                className="block text-xs font-bold text-gray-700 mb-1"
              >
                Enter Password to Confirm
              </label>
              <input
                id="deletePassword"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-red-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-500 transition-colors text-gray-900"
                placeholder="Enter your password"
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
            form="delete-account-form"
            disabled={isLoading || !password.trim()}
            className="flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md shadow-red-500/20 disabled:opacity-50 cursor-pointer transition-all"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            {isLoading ? "Deleting..." : "Confirm Deletion"}
          </button>
        </div>
      </div>
    </div>
  );
}
