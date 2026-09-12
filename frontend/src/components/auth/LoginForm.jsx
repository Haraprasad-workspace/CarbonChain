import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import gsap from "gsap";
import useAuth from "../../hooks/useAuth";

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("[LoginForm Debug] Submitting authentication payload for:", formData.email);

    try {
      const data = await login(formData);
      const userRole = data?.user?.role;

      console.log("[LoginForm Debug] Authentication successful. User Role:", userRole);

      switch (userRole) {
        case "WASTE_GENERATOR":
          console.log("[LoginForm Debug] Navigating to Generator Dashboard...");
          navigate("/generator");
          break;

        case "FACILITY":
          console.log("[LoginForm Debug] Navigating to Facility Dashboard...");
          navigate("/facility");
          break;

        case "LOGISTICS_PROVIDER":
          console.log("[LoginForm Debug] Navigating to Logistics Dashboard...");
          navigate("/logistics");
          break;

        case "MUNICIPALITY":
          console.log("[LoginForm Debug] Navigating to Municipality Dashboard...");
          navigate("/municipality");
          break;

        case "ADMIN":
          console.log("[LoginForm Debug] Navigating to Admin Dashboard...");
          navigate("/admin");
          break;

        default:
          console.warn("[LoginForm Debug] Unknown or missing role. Defaulting to home...");
          navigate("/");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Login failed. Please verify your credentials and try again.";
      console.error("[LoginForm Debug Error]", err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={cardRef}
      className="w-full max-w-md bg-[#0B1610]/80 backdrop-blur-xl border border-[rgba(16,185,129,0.2)] rounded-2xl p-6 text-[#ECFDF5] shadow-[0_20px_25px_-5px_rgba(2,44,34,0.7)] font-sans relative overflow-hidden transition-all"
    >
      {/* Radial Green Ambient Glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Branding */}
      <div className="flex flex-col items-center mb-6 relative z-10">
        <div className="w-11 h-11 rounded-xl bg-[#022C22] border border-[rgba(16,185,129,0.3)] flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.15)] mb-3">
          <svg
            className="w-5 h-5 text-[#34D399]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-[#ECFDF5]">
          Welcome to CarbonChain
        </h2>
        <p className="text-xs text-[#A7F3D0]/70 mt-1 font-medium text-center">
          Sign in to access your circular carbon dashboard
        </p>
      </div>

      {/* Error Alert Box */}
      {error && (
        <div
          ref={alertRef}
          className="mb-5 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-medium flex items-center gap-2.5 backdrop-blur-md"
        >
          <svg className="w-4 h-4 shrink-0 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
        {/* Email Input */}
        <div>
          <label className="block text-[11px] font-semibold text-[#A7F3D0] uppercase tracking-wider mb-2">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="name@organization.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 text-sm bg-[#12221A] text-[#ECFDF5] placeholder-[#065F46] border border-[rgba(16,185,129,0.25)] rounded-xl focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-inner"
          />
        </div>

        {/* Password Input */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[11px] font-semibold text-[#A7F3D0] uppercase tracking-wider">
              Password
            </label>
          </div>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 text-sm bg-[#12221A] text-[#ECFDF5] placeholder-[#065F46] border border-[rgba(16,185,129,0.25)] rounded-xl focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-inner"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#34D399] hover:to-[#10B981] text-[#050B07] font-bold text-sm rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 cursor-pointer"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-[#050B07] border-t-transparent rounded-full animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>

      {/* Footer Link */}
      <div className="mt-6 text-center border-t border-[rgba(16,185,129,0.15)] pt-4 relative z-10">
        <p className="text-xs text-[#A7F3D0]/70">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-[#34D399] hover:text-[#10B981] transition-colors">
            Register Stakeholder Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;