import RegisterForm from "../../components/auth/RegisterForm";

const Register = () => {
  return (
    <div className="min-h-screen w-full bg-[#F4F6F0] text-[#1E332B] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col justify-between selection:bg-[#143B36] selection:text-white">
      {/* Background Decorative Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#73A892]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#DCE9DF]/40 rounded-full blur-3xl" />
      </div>

      {/* Header / Brand Navigation Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#DCE9DF] flex items-center justify-center shadow-sm">
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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#1E332B]">
            Carbon<span className="text-[#2D6357]">Chain</span>
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-[#63786E] bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#E6EDE8]">
          <span className="w-2 h-2 rounded-full bg-[#2D6B4E] animate-pulse" />
          <span>Ecosystem Active</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Side Highlights (Visible on Large Screens) */}
          <div className="hidden lg:flex lg:col-span-4 flex-col justify-center space-y-6 pr-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E4EFE9] text-[#1E3B30] text-xs font-semibold w-fit border border-[#DCE9DF]">
              <span>Stakeholder Onboarding</span>
            </div>

            <h1 className="text-3xl font-extrabold text-[#1E332B] leading-tight">
              Join the Circular Carbon Marketplace
            </h1>

            <p className="text-sm text-[#63786E] leading-relaxed">
              Register your organization to trade organic waste, monitor biochar transformation, and manage verified carbon offsets.
            </p>

            {/* Stakeholder Category Badge Grid */}
            <div className="space-y-3 pt-2">
              <div className="p-3 bg-white rounded-2xl border border-[#E6EDE8] shadow-[0px_1px_3px_rgba(0,0,0,0.03)] flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#DCEFE3] flex items-center justify-center text-[#2D6B4E] font-bold text-xs">
                  01
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1E332B]">Waste Generators</h4>
                  <p className="text-[11px] text-[#63786E]">Farms, food processing, and industrial suppliers</p>
                </div>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-[#E6EDE8] shadow-[0px_1px_3px_rgba(0,0,0,0.03)] flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#DCEFE3] flex items-center justify-center text-[#2D6B4E] font-bold text-xs">
                  02
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1E332B]">Treatment Facilities</h4>
                  <p className="text-[11px] text-[#63786E]">Biochar units, biogas plants, and composters</p>
                </div>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-[#E6EDE8] shadow-[0px_1px_3px_rgba(0,0,0,0.03)] flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#DCEFE3] flex items-center justify-center text-[#2D6B4E] font-bold text-xs">
                  03
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1E332B]">Logistics & Municipalities</h4>
                  <p className="text-[11px] text-[#63786E]">Fleet haulers and urban compliance authorities</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side Register Form Container */}
          <div className="col-span-1 lg:col-span-8 flex justify-center">
            <div className="w-full">
              <RegisterForm />
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-6 text-center text-xs text-[#63786E] border-t border-[#E8EFEA]">
        <p>© 2026 CarbonChain Network. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Register;