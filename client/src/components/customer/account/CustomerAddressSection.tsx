import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/auth.service";
import toast from "react-hot-toast";
import { MapPin, Plus, Trash2, Home, Building, Briefcase } from "lucide-react";

export default function CustomerAddressSection() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addressForm, setAddressForm] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    type: "HOME",
  });

  if (!user) return null;

  const handleAddAddress = async () => {
    try {
      setIsLoading(true);
      if (!addressForm.street || !addressForm.city || !addressForm.state || !addressForm.zipCode) {
        return toast.error("Please fill all required fields");
      }

      const newAddress = {
        street: addressForm.street,
        city: addressForm.city,
        state: addressForm.state,
        zipCode: addressForm.zipCode,
        type: addressForm.type,
      };

      // Since the backend updateProfile allows sending any fields, we can send the updated addresses array.
      // Make sure the backend accepts updating addresses.
      const currentAddresses = user.addresses || [];
      const updatedAddresses = [...currentAddresses, newAddress];

      await authService.updateProfile({ addresses: updatedAddresses });
      updateUser({ addresses: updatedAddresses });
      toast.success("Address added successfully");
      setShowAddForm(false);
      setAddressForm({ street: "", city: "", state: "", zipCode: "", type: "HOME" });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to add address");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async (index: number) => {
    try {
      setIsLoading(true);
      const currentAddresses = user.addresses || [];
      const updatedAddresses = currentAddresses.filter((_, i) => i !== index);

      await authService.updateProfile({ addresses: updatedAddresses });
      updateUser({ addresses: updatedAddresses });
      toast.success("Address deleted");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to delete address");
    } finally {
      setIsLoading(false);
    }
  };

  const getIconForType = (type: string) => {
    if (type === "WORK") return <Briefcase className="w-4 h-4 text-orange-500" />;
    if (type === "OTHER") return <Building className="w-4 h-4 text-orange-500" />;
    return <Home className="w-4 h-4 text-orange-500" />;
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-3xl overflow-hidden mb-8">
      <div className="p-8 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-gray-900">
            <MapPin size={20} className="text-orange-500" /> Saved Addresses
          </h2>
          <p className="text-sm text-gray-500">Manage your delivery addresses.</p>
        </div>
        {!showAddForm && (
          <button onClick={() => setShowAddForm(true)} className="flex items-center gap-1 px-4 py-2 bg-orange-50 text-orange-600 font-bold rounded-xl hover:bg-orange-100 transition-colors cursor-pointer text-sm">
            <Plus size={16} /> Add New
          </button>
        )}
      </div>

      <div className="p-8 bg-gray-50/50">
        {showAddForm && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 animate-in slide-in-from-top-4">
            <h3 className="font-bold text-gray-900 mb-4">Add New Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="address-street" className="block text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
                  Street Address
                </label>
                <input id="address-street" value={addressForm.street} onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500 text-gray-900" placeholder="e.g. 123 Main St, Apt 4B" />
              </div>
              <div>
                <label htmlFor="address-city" className="block text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
                  City
                </label>
                <input id="address-city" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500 text-gray-900" placeholder="e.g. Mumbai" />
              </div>
              <div>
                <label htmlFor="address-state" className="block text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
                  State
                </label>
                <input id="address-state" value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500 text-gray-900" placeholder="e.g. Maharashtra" />
              </div>
              <div>
                <label htmlFor="address-zip" className="block text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-1.5">
                  Zip Code
                </label>
                <input id="address-zip" value={addressForm.zipCode} onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500 text-gray-900" placeholder="e.g. 400001" />
              </div>
              <fieldset className="md:col-span-2">
                <legend className="block text-[11px] font-semibold uppercase tracking-widest text-gray-500 mb-2">Address Type</legend>
                <div className="flex gap-3">
                  {["HOME", "WORK", "OTHER"].map((type) => (
                    <button key={type} type="button" onClick={() => setAddressForm({ ...addressForm, type })} className={`px-4 py-2 text-xs font-bold rounded-xl border ${addressForm.type === type ? "bg-orange-50 border-orange-500 text-orange-600" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                      {type}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={handleAddAddress} disabled={isLoading} className="cursor-pointer px-6 py-2.5 bg-orange-500 text-white text-sm font-bold rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50">
                Save Address
              </button>
              <button type="button" onClick={() => setShowAddForm(false)} className="cursor-pointer px-6 py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(!user.addresses || user.addresses.length === 0) && !showAddForm ? (
            <div className="col-span-2 text-center py-8 text-gray-500 bg-white border border-dashed border-gray-300 rounded-2xl">You haven&apos;t saved any addresses yet.</div>
          ) : (
            user.addresses?.map((address, idx) => (
              <div key={address._id || idx} className="bg-white border border-gray-200 rounded-2xl p-5 flex justify-between items-start hover:border-gray-300 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {getIconForType(address.type)}
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-900">{address.type}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
                    {address.street}, {address.city}, {address.state} - {address.zipCode}
                  </p>
                </div>
                <button onClick={() => handleDeleteAddress(idx)} disabled={isLoading} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50" title="Delete address">
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
