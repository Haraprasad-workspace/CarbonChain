import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const roles = [
  { value: "WASTE_GENERATOR", label: "Waste Generator (Farm / Food / Industrial)" },
  { value: "FACILITY", label: "Treatment Facility (Biochar / Biogas / Compost)" },
  { value: "LOGISTICS_PROVIDER", label: "Logistics Provider" },
  { value: "MUNICIPALITY", label: "Municipality Authority" }
];

const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "",
    organization: "",
    location: {
      address: "",
      city: "",
      state: "",
      pincode: ""
    }
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["address", "city", "state", "pincode"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [name]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    console.log("[RegisterForm Debug] Initiating stakeholder registration...", {
      email: formData.email,
      role: formData.role,
      organization: formData.organization
    });

    try {
      await register(formData);
      console.log("[RegisterForm Debug] Stakeholder account created successfully.");

      navigate("/login", {
        state: {
          message: "Registration successful. Please log in with your credentials."
        }
      });
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Registration failed. Please review your details and try again.";
      console.error("[RegisterForm Debug Error]", err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FFFBF5] px-4 py-12 font-['Montserrat',sans-serif] selection:bg-[#FFA800] selection:text-white">
      <div className="w-full max-w-2xl bg-[#FFFBF5] border border-[#E8DDCB] rounded-2xl shadow-xl p-8 transition-all">
        {/* Header & Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#FFA800] flex items-center justify-center shadow-md mb-3">
            <svg
              className="w-7 h-7 text-[#422D0B]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#422D0B]">
            Join CarbonChain Ecosystem
          </h2>
          <p className="text-xs text-[#967A53] mt-1 font-medium">
            Register your entity to start trading circular carbon assets
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic Identity */}
          <div>
            <h3 className="text-xs font-bold text-[#422D0B] uppercase tracking-wider mb-3 border-b border-[#E8DDCB] pb-1">
              1. Account Identity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#422D0B] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 text-sm bg-white text-[#422D0B] placeholder-[#967A53]/60 border border-[#E8DDCB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA800] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#422D0B] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 text-sm bg-white text-[#422D0B] placeholder-[#967A53]/60 border border-[#E8DDCB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA800] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#422D0B] mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 text-sm bg-white text-[#422D0B] placeholder-[#967A53]/60 border border-[#E8DDCB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA800] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#422D0B] mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 text-sm bg-white text-[#422D0B] placeholder-[#967A53]/60 border border-[#E8DDCB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA800] focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Role & Stakeholder Info */}
          <div>
            <h3 className="text-xs font-bold text-[#422D0B] uppercase tracking-wider mb-3 border-b border-[#E8DDCB] pb-1">
              2. Stakeholder Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#422D0B] mb-1">
                  Stakeholder Role *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 text-sm bg-white text-[#422D0B] border border-[#E8DDCB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA800] focus:border-transparent transition-all"
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#422D0B] mb-1">
                  Organization / Entity Name
                </label>
                <input
                  type="text"
                  name="organization"
                  placeholder="Green Farms / Biochar Corp"
                  value={formData.organization}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm bg-white text-[#422D0B] placeholder-[#967A53]/60 border border-[#E8DDCB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA800] focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Facility / Location Details */}
          <div>
            <h3 className="text-xs font-bold text-[#422D0B] uppercase tracking-wider mb-3 border-b border-[#E8DDCB] pb-1">
              3. Operational Location
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#422D0B] mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="Street / Industrial Area / Survey No."
                  value={formData.location.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm bg-white text-[#422D0B] placeholder-[#967A53]/60 border border-[#E8DDCB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA800] focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#422D0B] mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Ahmedabad"
                    value={formData.location.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm bg-white text-[#422D0B] placeholder-[#967A53]/60 border border-[#E8DDCB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA800] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#422D0B] mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    placeholder="Gujarat"
                    value={formData.location.state}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm bg-white text-[#422D0B] placeholder-[#967A53]/60 border border-[#E8DDCB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA800] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#422D0B] mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    placeholder="380001"
                    value={formData.location.pincode}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm bg-white text-[#422D0B] placeholder-[#967A53]/60 border border-[#E8DDCB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA800] focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-[#FFA800] hover:bg-[#FFC24A] text-[#422D0B] font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#422D0B] border-t-transparent rounded-full animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Register Stakeholder</span>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center border-t border-[#E8DDCB] pt-6">
          <p className="text-xs text-[#967A53]">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-[#422D0B] hover:text-[#FFA800] transition-colors">
              Sign In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;