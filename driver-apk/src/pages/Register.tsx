import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import api from "../lib/axios";
import { Bike, Loader2 } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    vehicleDetails: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

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

  const inputClass = "appearance-none block w-full px-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FF7A30] focus:border-[#FF7A30] sm:text-sm";
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
              <label htmlFor="password" className={labelClass}>Password</label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  inputMode="numeric"
                  pattern="\d{4}"
                  maxLength={4}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                  className={inputClass}
                  placeholder="••••"
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
