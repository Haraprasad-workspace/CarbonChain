import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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

      // Route dynamically based on system stakeholder role
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
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F4F6F0] px-4 py-12 font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#143B36] selection:text-white">
      <div className="w-full max-w-md bg-white border border-[#E6EDE8] rounded-2xl shadow-[0px_1px_3px_rgba(0,0,0,0.03),0px_4px_12px_rgba(22,41,37,0.03)] p-8 transition-all">
        {/* Header & Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#DCE9DF] flex items-center justify-center shadow-sm mb-3">
            <svg
              className="w-6 h-6 text-[#143B36]"
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
          <h2 className="text-2xl font-bold tracking-tight text-[#1E332B]">
            Welcome to CarbonChain
          </h2>
          <p className="text-xs text-[#63786E] mt-1 font-medium">
            Sign in to access your circular carbon dashboard
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div>
            <label className="block text-xs font-semibold text-[#1E332B] uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="name@organization.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 text-sm bg-white border border-[#DFE6E1] rounded-xl text-[#1E332B] placeholder-[#8EA097] focus:outline-none focus:ring-2 focus:ring-[#143B36] transition-all"
            />
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-[#1E332B] uppercase tracking-wider">
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
              className="w-full px-4 py-2.5 text-sm bg-white border border-[#DFE6E1] rounded-xl text-[#1E332B] placeholder-[#8EA097] focus:outline-none focus:ring-2 focus:ring-[#143B36] transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#143B36] hover:bg-[#0D2925] text-white font-semibold text-sm rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 cursor-pointer shadow-xs active:scale-[0.99]"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center border-t border-[#E8EFEA] pt-6">
          <p className="text-xs text-[#63786E]">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-[#143B36] hover:text-[#2D6357] transition-colors">
              Register Stakeholder Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;