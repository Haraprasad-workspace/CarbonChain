import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const GeneratorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 font-['Montserrat',sans-serif] text-[#422D0B] p-4 sm:p-6 selection:bg-[#FFA800] selection:text-white">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDCB] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#422D0B] tracking-tight">
            Waste Generator Dashboard
          </h1>
          <p className="text-xs text-[#967A53] mt-1">
            Manage your biomass waste listings, track verification status, and monitor environmental impacts.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="self-start sm:self-auto px-4 py-2 bg-white hover:bg-red-50 text-red-700 border border-[#E8DDCB] hover:border-red-200 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Sign Out</span>
        </button>
      </div>

      {/* User Greeting & Profile Overview */}
      <div className="bg-white border border-[#E8DDCB] rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFA800]/10 rounded-bl-full pointer-events-none" />

        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFA800]/20 flex items-center justify-center text-[#422D0B] font-extrabold text-xl shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : "G"}
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#967A53]">
              Welcome Back
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#422D0B]">
              {user?.name || "Generator"}
            </h2>
            
            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[#967A53] pt-1">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-[#422D0B]">Organization:</span>
                <span>{user?.organization || "Not specified"}</span>
              </div>
              <span className="hidden sm:inline text-[#E8DDCB]">•</span>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-[#422D0B]">Email:</span>
                <span>{user?.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Navigation Cards for Easy Access */}
      <div className="space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#967A53]">
          Quick Actions & Operations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Action Card 1: Register Waste */}
          <div className="bg-white border border-[#E8DDCB] rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#FFA800] transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFFBF5] border border-[#E8DDCB] flex items-center justify-center group-hover:bg-[#FFA800]/20 transition-colors">
                <svg className="w-5 h-5 text-[#FFA800]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-bold text-[#422D0B]">Register New Waste</h4>
                <p className="text-xs text-[#967A53] mt-1 leading-relaxed">
                  List available organic, agricultural, or industrial byproducts for recycling.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/generator/register-waste")}
              className="w-full py-2.5 px-4 bg-[#FFA800] hover:bg-[#FFC24A] text-[#422D0B] font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2"
            >
              <span>+ Start Registration</span>
            </button>
          </div>

          {/* Action Card 2: My Waste */}
          <div className="bg-white border border-[#E8DDCB] rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#FFA800] transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFFBF5] border border-[#E8DDCB] flex items-center justify-center group-hover:bg-[#FFA800]/20 transition-colors">
                <svg className="w-5 h-5 text-[#FFA800]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-bold text-[#422D0B]">My Waste Listings</h4>
                <p className="text-xs text-[#967A53] mt-1 leading-relaxed">
                  View, track status, or cancel active waste batches registered under your account.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/generator/waste")}
              className="w-full py-2.5 px-4 bg-white hover:bg-[#FFFBF5] text-[#422D0B] border border-[#E8DDCB] hover:border-[#FFA800] font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>View Inventory</span>
            </button>
          </div>

          {/* Action Card 3: Verification */}
          <div className="bg-white border border-[#E8DDCB] rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#FFA800] transition-all flex flex-col justify-between space-y-4 group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFFBF5] border border-[#E8DDCB] flex items-center justify-center group-hover:bg-[#FFA800]/20 transition-colors">
                <svg className="w-5 h-5 text-[#FFA800]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="text-base font-bold text-[#422D0B]">Verification Hub</h4>
                <p className="text-xs text-[#967A53] mt-1 leading-relaxed">
                  Check legal compliance, quality certifications, and carbon offset validations.
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/verification")}
              className="w-full py-2.5 px-4 bg-white hover:bg-[#FFFBF5] text-[#422D0B] border border-[#E8DDCB] hover:border-[#FFA800] font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Open Verification</span>
            </button>
          </div>

        </div>
      </div>

      {/* Support Guidance for Non-Tech Users */}
      <div className="p-4 bg-[#FFFBF5] border border-[#E8DDCB] rounded-xl flex items-center gap-3 text-xs text-[#967A53]">
        <svg className="w-5 h-5 text-[#FFA800] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>
          Need help registering or managing a batch? Reach out to support or check your verification status to ensure compliance.
        </span>
      </div>
    </div>
  );
};

export default GeneratorDashboard;