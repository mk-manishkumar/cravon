import { useState, useRef } from "react";
import { X, Camera, Loader2 } from "lucide-react";
import type { Driver } from "../store/authStore";
import api from "../lib/axios";

interface EditProfileModalProps {
  driver: Driver;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedDriver: Driver) => void;
}

export default function EditProfileModal({ driver, isOpen, onClose, onSuccess }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    firstName: driver.firstName || "",
    lastName: driver.lastName || "",
    phone: driver.phone || "",
    vehicleDetails: driver.vehicleDetails || "",
    profilePicture: driver.profilePicture || "",
  });
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB");
      return;
    }

    try {
      setIsUploadingImage(true);
      setError(null);

      const uploadData = new FormData();
      uploadData.append("file", file);

      // Uploads through server ImageKit endpoint
      const res = await api.post("/upload", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const imageUrl = res.data.url;
      setFormData((prev) => ({ ...prev, profilePicture: imageUrl }));
    } catch (err: unknown) {
      console.error("Image upload failed:", err);
      const apiErr = err as { response?: { data?: { message?: string } } };
      setError(apiErr.response?.data?.message || "Failed to upload image. Please try again.");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setError(null);

      const res = await api.put("/driver/profile", formData);
      onSuccess(res.data.data);
      onClose();
    } catch (err: unknown) {
      console.error("Profile save failed:", err);
      const apiErr = err as { response?: { data?: { message?: string; errors?: { message: string }[] } } };
      if (apiErr.response?.data?.errors?.[0]?.message) {
        setError(apiErr.response.data.errors[0].message);
      } else {
        setError(apiErr.response?.data?.message || "Failed to save profile. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const initials = `${formData.firstName?.[0] || ""}${formData.lastName?.[0] || ""}`.toUpperCase() || "D";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h2 className="font-bold text-lg text-gray-900">Edit Driver Profile</h2>
            <p className="text-xs text-gray-500">Update your account and vehicle details</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3">
              {error}
            </div>
          )}

          {/* Profile Picture Upload Section (ImageKit) */}
          <div className="flex items-center gap-5 p-4 bg-orange-50/50 border border-orange-100 rounded-2xl">
            <div className="relative w-20 h-20 rounded-full bg-linear-to-br from-[#FF3D57] to-[#FF7A30] text-white flex items-center justify-center overflow-hidden shrink-0 shadow-md">
              {formData.profilePicture ? (
                <img
                  src={formData.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl font-black">{initials}</span>
              )}

              {isUploadingImage && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <p className="text-xs font-bold text-gray-700 mb-1">Profile Photo</p>
              <p className="text-[11px] text-gray-500 mb-2.5">Upload a clear photo for customers to recognize you</p>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
                id="driver-photo-upload"
              />

              <div className="flex items-center gap-2">
                <label
                  htmlFor="driver-photo-upload"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF7A30] hover:bg-[#e66a25] text-white text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-xs"
                >
                  <Camera className="w-3.5 h-3.5" />
                  {isUploadingImage ? "Uploading..." : "Upload Photo"}
                </label>

                {formData.profilePicture && !isUploadingImage && (
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, profilePicture: "" }))}
                    className="px-2.5 py-1.5 text-xs text-gray-500 hover:text-red-500 cursor-pointer transition-colors font-medium"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          <form id="profile-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF7A30]/20 focus:border-[#FF7A30] transition-colors"
                  placeholder="First name"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF7A30]/20 focus:border-[#FF7A30] transition-colors"
                  placeholder="Last name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF7A30]/20 focus:border-[#FF7A30] transition-colors"
                placeholder="10-digit phone"
              />
            </div>

            <div>
              <label htmlFor="vehicleDetails" className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wider">
                Vehicle Details
              </label>
              <input
                id="vehicleDetails"
                type="text"
                required
                value={formData.vehicleDetails}
                onChange={(e) => setFormData({ ...formData, vehicleDetails: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF7A30]/20 focus:border-[#FF7A30] transition-colors"
                placeholder="e.g. Honda Activa - BR01AB1234"
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="profile-form"
            disabled={isSaving || isUploadingImage}
            className="flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-bold text-white bg-[#FF7A30] hover:bg-[#e66a25] rounded-xl shadow-md shadow-orange-500/20 disabled:opacity-50 cursor-pointer transition-all"
          >
            {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
