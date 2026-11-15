import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import api from "../lib/axios";
import { Bike, Loader2, Smartphone, Download, Info } from "lucide-react";
import { CITIES } from "../components/CitySelector";
import { usePwaStore } from "../store/pwaStore";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    vehicleDetails: "",
    city: "Patna",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [installNotice, setInstallNotice] = useState("");

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { isStandalone, isMobile, triggerInstall } = usePwaStore();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/driver/register", formData);
      setAuth(res.data.data.driver, res.data.data.token);
      void navigate("/dashboard");
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors[0].message);
      } else {
        setError(err.response?.data?.message || "Failed to register. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInstallAction = async () => {
    const res = await triggerInstall();
    if (res === "ios") {
      setInstallNotice("On Safari: Tap the Share button at the bottom, then choose 'Add to Home Screen' ➕.");
    } else if (res === "manual") {
      setInstallNotice("Tap your browser menu (⋮ or ⋯) and select 'Install app' or 'Add to Home screen'.");
    } else if (res === "accepted") {
      setInstallNotice("Driver App installed successfully! You can launch it from your home screen.");
    }
  };

  const inputClass = "appearance-none block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FF7A30] focus:border-[#FF7A30] sm:text-sm text-gray-900 bg-white";
  const labelClass = "block text-sm font-medium text-gray-700";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-[#FF7A30] rounded-full flex items-center justify-center shadow-lg shadow-orange-500/20">
            <Bike className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Partner Registration</h2>
        <p className="mt-2 text-center text-sm text-gray-600">Join the fleet and start earning</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 pb-12">
        {/* Mobile-Only Install App Card */}
        {isMobile && !isStandalone && (
          <div className="md:hidden mb-5 bg-[#1A1A1E] border border-white/10 rounded-2xl p-4 shadow-xl text-white">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#FF3D57] to-[#FF7A30] flex items-center justify-center text-white shrink-0 shadow-md">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-sm font-bold text-white">Install Driver App</h4>
                    <span className="text-[10px] bg-[#FF7A30] text-white font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">App</span>
                  </div>
                  <p className="text-[11px] text-gray-300 mt-0.5">Quick access &amp; real-time order alerts</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleInstallAction}
                className="flex items-center gap-1.5 bg-[#FF3D57] hover:bg-[#E22B45] text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md transition-all active:scale-95 shrink-0 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install</span>
              </button>
            </div>

            {installNotice && (
              <div className="mt-3 pt-3 border-t border-white/10 text-xs text-gray-300">
                <p className="flex items-start gap-1.5 text-[11px] text-gray-200">
                  <Info className="w-3.5 h-3.5 text-[#FF7A30] shrink-0 mt-0.5" />
                  <span>{installNotice}</span>
                </p>
              </div>
            )}
          </div>
        )}

        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-gray-100">
          <form className="space-y-5" onSubmit={handleRegister}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className={labelClass}>First Name</label>
                <div className="mt-1">
                  <input id="firstName" type="text" required value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} className={inputClass} placeholder="John" />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className={labelClass}>Last Name</label>
                <div className="mt-1">
                  <input id="lastName" type="text" required value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} className={inputClass} placeholder="Doe" />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>Email address</label>
              <div className="mt-1">
                <input id="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className={inputClass} placeholder="driver@example.com" />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className={labelClass}>Phone Number</label>
              <div className="mt-1">
                <input id="phone" type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputClass} placeholder="9876543210" />
              </div>
            </div>

            <div>
              <label htmlFor="vehicleDetails" className={labelClass}>Vehicle Details</label>
              <div className="mt-1">
                <input id="vehicleDetails" type="text" required value={formData.vehicleDetails} onChange={(e) => setFormData({ ...formData, vehicleDetails: e.target.value })} className={inputClass} placeholder="Honda Activa - MH12AB1234" />
              </div>
            </div>

            <div>
              <label htmlFor="city" className={labelClass}>Operational City</label>
              <div className="mt-1">
                <select
                  id="city"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className={`${inputClass} bg-white cursor-pointer`}
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="password" className={labelClass}>Password</label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={inputClass}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#FF7A30] hover:bg-[#E66A25] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7A30] disabled:opacity-50 transition-colors cursor-pointer"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Register as Partner"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="font-medium text-[#FF7A30] hover:text-[#E66A25] cursor-pointer">
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
