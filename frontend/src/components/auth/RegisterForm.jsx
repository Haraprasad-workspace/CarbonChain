import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import gsap from "gsap";
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

  // GSAP Animation Refs
  const cardRef = useRef(null);
  const alertRef = useRef(null);

  // Initial Entrance Animation
  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  // Alert Box Pop Motion
  useEffect(() => {
    if (error && alertRef.current) {
      gsap.fromTo(
        alertRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" }
      );
    }
  }, [error]);

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

    if (error) setError("");
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
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050B07] px-4 py-12 font-sans selection:bg-[#10B981] selection:text-[#050B07]">
      <div
        ref={cardRef}
        className="w-full max-w-2xl bg-[#0B1610]/80 backdrop-blur-xl border border-[rgba(16,185,129,0.2)] rounded-2xl p-8 text-[#ECFDF5] shadow-[0_20px_25px_-5px_rgba(2,44,34,0.7)] relative overflow-hidden transition-all"
      >
        {/* Ambient Radial Background Glow */}
        <div className="absolute -top-24 -right-24 w-56 h-56 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header & Branding */}
        <div className="flex flex-col items-center mb-8 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-[#022C22] border border-[rgba(16,185,129,0.3)] flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.15)] mb-3">
            <svg
              className="w-6 h-6 text-[#34D399]"
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
          <h2 className="text-2xl font-bold tracking-tight text-[#ECFDF5]">
            Join CarbonChain Ecosystem
          </h2>
          <p className="text-xs text-[#A7F3D0]/70 mt-1 font-medium">
            Register your entity to start trading circular carbon assets
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div
            ref={alertRef}
            className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-medium flex items-center gap-2.5 backdrop-blur-md"
          >
            <svg className="w-4 h-4 shrink-0 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Section 1: Basic Identity */}
          <div>
            <h3 className="text-xs font-bold text-[#A7F3D0] uppercase tracking-wider mb-3 border-b border-[rgba(16,185,129,0.15)] pb-1.5">
              1. Account Identity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#ECFDF5] mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 text-sm bg-[#12221A] text-[#ECFDF5] placeholder-[#065F46] border border-[rgba(16,185,129,0.25)] rounded-xl focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#ECFDF5] mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 text-sm bg-[#12221A] text-[#ECFDF5] placeholder-[#065F46] border border-[rgba(16,185,129,0.25)] rounded-xl focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#ECFDF5] mb-1.5">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 text-sm bg-[#12221A] text-[#ECFDF5] placeholder-[#065F46] border border-[rgba(16,185,129,0.25)] rounded-xl focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#ECFDF5] mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 text-sm bg-[#12221A] text-[#ECFDF5] placeholder-[#065F46] border border-[rgba(16,185,129,0.25)] rounded-xl focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Role & Stakeholder Info */}
          <div>
            <h3 className="text-xs font-bold text-[#A7F3D0] uppercase tracking-wider mb-3 border-b border-[rgba(16,185,129,0.15)] pb-1.5">
              2. Stakeholder Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#ECFDF5] mb-1.5">
                  Stakeholder Role *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 text-sm bg-[#12221A] text-[#ECFDF5] border border-[rgba(16,185,129,0.25)] rounded-xl focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-inner"
                >
                  <option value="" className="bg-[#0B1610] text-[#A7F3D0]">
                    Select Role
                  </option>
                  {roles.map((role) => (
                    <option key={role.value} value={role.value} className="bg-[#0B1610] text-[#ECFDF5]">
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#ECFDF5] mb-1.5">
                  Organization / Entity Name
                </label>
                <input
                  type="text"
                  name="organization"
                  placeholder="Green Farms / Biochar Corp"
                  value={formData.organization}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm bg-[#12221A] text-[#ECFDF5] placeholder-[#065F46] border border-[rgba(16,185,129,0.25)] rounded-xl focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Facility / Location Details */}
          <div>
            <h3 className="text-xs font-bold text-[#A7F3D0] uppercase tracking-wider mb-3 border-b border-[rgba(16,185,129,0.15)] pb-1.5">
              3. Operational Location
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#ECFDF5] mb-1.5">
                  Street Address
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="Street / Industrial Area / Survey No."
                  value={formData.location.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm bg-[#12221A] text-[#ECFDF5] placeholder-[#065F46] border border-[rgba(16,185,129,0.25)] rounded-xl focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-inner"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#ECFDF5] mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Ahmedabad"
                    value={formData.location.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm bg-[#12221A] text-[#ECFDF5] placeholder-[#065F46] border border-[rgba(16,185,129,0.25)] rounded-xl focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#ECFDF5] mb-1.5">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    placeholder="Gujarat"
                    value={formData.location.state}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm bg-[#12221A] text-[#ECFDF5] placeholder-[#065F46] border border-[rgba(16,185,129,0.25)] rounded-xl focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#ECFDF5] mb-1.5">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    placeholder="380001"
                    value={formData.location.pincode}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm bg-[#12221A] text-[#ECFDF5] placeholder-[#065F46] border border-[rgba(16,185,129,0.25)] rounded-xl focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-inner"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#34D399] hover:to-[#10B981] text-[#050B07] font-bold text-sm rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#050B07] border-t-transparent rounded-full animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Register Stakeholder</span>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center border-t border-[rgba(16,185,129,0.15)] pt-6 relative z-10">
          <p className="text-xs text-[#A7F3D0]/70">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-[#34D399] hover:text-[#10B981] transition-colors">
              Sign In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;