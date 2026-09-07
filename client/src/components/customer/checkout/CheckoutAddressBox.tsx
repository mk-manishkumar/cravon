"use client";
import { useState } from "react";
import { MapPin, CheckCircle2, Plus, X } from "lucide-react";
import { User as AuthUser, useAuthStore } from "@/store/authStore";
import { authService } from "@/services/auth.service";
import toast from "react-hot-toast";

interface CheckoutAddressBoxProps {
  user: AuthUser | null;
  selectedAddressIndex: number;
  setSelectedAddressIndex: (index: number) => void;
}

export default function CheckoutAddressBox({ user, selectedAddressIndex, setSelectedAddressIndex }: Readonly<CheckoutAddressBoxProps>) {
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

  const handleAddAddress = async () => {
    try {
      setIsLoading(true);
      if (!addressForm.street || !addressForm.city || !addressForm.state || !addressForm.zipCode) {
        return toast.error("Please fill all required fields");
      }

      const newAddress = { ...addressForm };
      const currentAddresses = user?.addresses || [];
      const updatedAddresses = [...currentAddresses, newAddress];

      await authService.updateProfile({ addresses: updatedAddresses });
      updateUser({ addresses: updatedAddresses });
      toast.success("Address added successfully");
      
      // Auto-select the newly added address
      setSelectedAddressIndex(updatedAddresses.length - 1);
      
      setShowAddForm(false);
      setAddressForm({ street: "", city: "", state: "", zipCode: "", type: "HOME" });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to add address");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-start gap-4">
          <div className="bg-black text-white p-2 rounded flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mt-1">Delivery Address</h2>
        </div>
        {!showAddForm && (
          <button onClick={() => setShowAddForm(true)} className="flex items-center gap-1 px-4 py-2 bg-orange-50 text-orange-600 font-bold rounded-xl hover:bg-orange-100 transition-colors cursor-pointer text-sm">
            <Plus size={16} /> Add New
          </button>
        )}
      </div>

      <div className="pl-12">
        {showAddForm ? (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-6 animate-in slide-in-from-top-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">Add New Address</h3>
              <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="street-address" className="block text-[11px] font-semibold uppercase text-gray-500 mb-1.5">Street Address</label>
                <input id="street-address" value={addressForm.street} onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500 text-gray-900" placeholder="e.g. 123 Main St, Apt 4B" />
              </div>
              <div>
                <label htmlFor="city" className="block text-[11px] font-semibold uppercase text-gray-500 mb-1.5">City</label>
                <input id="city" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500 text-gray-900" placeholder="e.g. Mumbai" />
              </div>
              <div>
                <label htmlFor="state" className="block text-[11px] font-semibold uppercase text-gray-500 mb-1.5">State</label>
                <input id="state" value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500 text-gray-900" placeholder="e.g. Maharashtra" />
              </div>
              <div>
                <label htmlFor="zip-code" className="block text-[11px] font-semibold uppercase text-gray-500 mb-1.5">Zip Code</label>
                <input id="zip-code" value={addressForm.zipCode} onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })} className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-500 text-gray-900" placeholder="e.g. 400001" />
              </div>
              <fieldset className="md:col-span-2">
                <legend className="block text-[11px] font-semibold uppercase text-gray-500 mb-2">Address Type</legend>
                <div className="flex gap-3">
                  {["HOME", "WORK", "OTHER"].map((type) => (
                    <button key={type} type="button" onClick={() => setAddressForm({ ...addressForm, type })} className={`px-4 py-2 text-xs font-bold rounded-xl border cursor-pointer ${addressForm.type === type ? "bg-orange-50 border-orange-500 text-orange-600" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                      {type}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
            
            <button type="button" onClick={handleAddAddress} disabled={isLoading} className="cursor-pointer w-full md:w-auto px-6 py-2.5 bg-orange-500 text-white text-sm font-bold rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50">
              Save & Use This Address
            </button>
          </div>
        ) : null}

        {!showAddForm && (!user?.addresses || user.addresses.length === 0) ? (
          <div className="bg-orange-50 text-orange-800 border border-orange-200 p-4 rounded-lg text-sm">
            You don&apos;t have any saved addresses. Please add a new address to continue.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user?.addresses?.map((address, idx) => (
              <button type="button" key={address._id || `${address.street}-${address.city}`} onClick={() => setSelectedAddressIndex(idx)} className={`text-left w-full block border-2 rounded-xl p-4 cursor-pointer transition-all ${selectedAddressIndex === idx ? "border-orange-500 bg-orange-50/50 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-semibold text-gray-600 uppercase">{address.type}</span>
                  {selectedAddressIndex === idx && <CheckCircle2 className="w-4 h-4 text-orange-500 ml-auto" />}
                </div>
                <p className="text-gray-800 font-medium text-sm leading-snug">
                  {address.street}, {address.city}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
