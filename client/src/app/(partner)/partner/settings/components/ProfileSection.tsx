import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/auth.service";
import toast from "react-hot-toast";
import { Edit2, Save, X } from "lucide-react";

// Simple user icon to avoid extra lucide imports
function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF7A30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export default function ProfileSection() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [editingField, setEditingField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    email: user?.email || "",
  });

  const [showEmailOtp, setShowEmailOtp] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!user) return null;

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

  return (
    <div className="bg-[#111] border border-[#222] rounded-3xl p-8 mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF7A30]/5 rounded-full blur-3xl pointer-events-none"></div>
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
        <UserIcon /> Profile Details
      </h2>

      <div className="space-y-6 relative z-10">
        {/* Name Field */}
        <div className="flex items-center justify-between p-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl hover:border-[#333] transition-colors group">
          <div className="flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#777] mb-1">Full Name</p>
            {editingField === "name" ? (
              <div className="flex gap-3 mt-1">
                <input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className="bg-[#222] border border-[#333] rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#FF7A30] w-1/3 text-white" placeholder="First Name" />
                <input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className="bg-[#222] border border-[#333] rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#FF7A30] w-1/3 text-white" placeholder="Last Name" />
              </div>
            ) : (
              <p className="text-sm font-medium">
                {user.firstName} {user.lastName}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {editingField === "name" ? (
              <>
                <button type="button" onClick={() => handleProfileUpdate("name")} disabled={isLoading} className="p-2 bg-[#00C853]/10 text-[#00C853] hover:bg-[#00C853]/20 rounded-xl transition-colors cursor-pointer">
                  <Save size={18} />
                </button>
                <button type="button" onClick={() => setEditingField(null)} className="p-2 bg-[#FF3D57]/10 text-[#FF3D57] hover:bg-[#FF3D57]/20 rounded-xl transition-colors cursor-pointer">
                  <X size={18} />
                </button>
              </>
            ) : (
              <button type="button" onClick={() => setEditingField("name")} className="p-2 text-[#666] hover:text-[#FF7A30] hover:bg-[#FF7A30]/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                <Edit2 size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Email Field */}
        <div className="flex items-center justify-between p-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl hover:border-[#333] transition-colors group">
          <div className="flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#777] mb-1">Email Address</p>
            {editingField === "email" ? (
              <div className="flex gap-3 items-center mt-1">
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="bg-[#222] border border-[#333] rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#FF7A30] w-2/3 text-white" placeholder="New Email" />
              </div>
            ) : (
              <p className="text-sm font-medium">{user.email}</p>
            )}
            {showEmailOtp && (
              <div className="mt-3 flex gap-3 items-center animate-in slide-in-from-top-2">
                <input type="text" value={emailOtp} onChange={(e) => setEmailOtp(e.target.value)} maxLength={6} className="bg-[#222] border border-[#333] rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#FF7A30] w-32 tracking-widest text-center text-white" placeholder="OTP" />
                <button type="button" onClick={handleVerifyEmail} disabled={isLoading || emailOtp.length !== 6} className="px-4 py-1.5 bg-[#FF7A30] text-white text-xs font-bold rounded-lg hover:bg-[#FF8E4D] transition-colors disabled:opacity-50 cursor-pointer">
                  Verify
                </button>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {editingField === "email" ? (
              <>
                {!showEmailOtp && (
                  <button type="button" onClick={() => handleProfileUpdate("email")} disabled={isLoading} className="p-2 bg-[#00C853]/10 text-[#00C853] hover:bg-[#00C853]/20 rounded-xl transition-colors cursor-pointer">
                    <Save size={18} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setEditingField(null);
                    setShowEmailOtp(false);
                    setEmailOtp("");
                    setFormData({ ...formData, email: user.email });
                  }}
                  className="p-2 bg-[#FF3D57]/10 text-[#FF3D57] hover:bg-[#FF3D57]/20 rounded-xl transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </>
            ) : (
              <button type="button" onClick={() => setEditingField("email")} className="p-2 text-[#666] hover:text-[#FF7A30] hover:bg-[#FF7A30]/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                <Edit2 size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Phone Field */}
        <div className="flex items-center justify-between p-4 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl hover:border-[#333] transition-colors group">
          <div className="flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#777] mb-1">Phone Number</p>
            {editingField === "phone" ? <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="mt-1 bg-[#222] border border-[#333] rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#FF7A30] w-1/3 text-white" placeholder="Phone Number" /> : <p className="text-sm font-medium">{user.phone || "Not provided"}</p>}
          </div>
          <div className="flex gap-2">
            {editingField === "phone" ? (
              <>
                <button type="button" onClick={() => handleProfileUpdate("phone")} disabled={isLoading} className="p-2 bg-[#00C853]/10 text-[#00C853] hover:bg-[#00C853]/20 rounded-xl transition-colors cursor-pointer">
                  <Save size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingField(null);
                    setFormData({ ...formData, phone: user.phone || "" });
                  }}
                  className="p-2 bg-[#FF3D57]/10 text-[#FF3D57] hover:bg-[#FF3D57]/20 rounded-xl transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </>
            ) : (
              <button type="button" onClick={() => setEditingField("phone")} className="p-2 text-[#666] hover:text-[#FF7A30] hover:bg-[#FF7A30]/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                <Edit2 size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
