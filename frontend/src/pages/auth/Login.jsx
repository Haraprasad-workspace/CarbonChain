import LoginForm from "../../components/auth/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen w-full bg-[#FFFBF5] text-[#422D0B] font-['Montserrat',sans-serif] flex flex-col justify-between selection:bg-[#FFA800] selection:text-white">
      {/* Background Decorative Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#FFA800]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#FFC24A]/15 rounded-full blur-3xl" />
      </div>

      {/* Header / Brand Navigation Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FFA800] flex items-center justify-center shadow-md">
            <svg
              className="w-6 h-6 text-[#422D0B]"
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
          <span className="text-xl font-bold tracking-tight text-[#422D0B]">
            Carbon<span className="text-[#FFA800]">Chain</span>
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-[#967A53] bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#E8DDCB]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Ecosystem Active</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Content (Visible on Large Screens) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-center space-y-6 pr-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFA800]/15 text-[#422D0B] text-xs font-semibold w-fit">
              <span>Circular Economy Marketplace</span>
            </div>
            
            <h1 className="text-3xl font-extrabold text-[#422D0B] leading-tight">
              Empowering Sustainable Waste & Carbon Credit Trading
            </h1>
            
            <p className="text-sm text-[#967A53] leading-relaxed">
              Connect waste generators, treatment facilities, and logistics partners seamlessly with verified tracking and secure auth operations.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs text-[#422D0B] font-medium">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">✓</div>
                <span>End-to-End Asset Traceability</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#422D0B] font-medium">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">✓</div>
                <span>Role-Based Multi-Stakeholder Access</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#422D0B] font-medium">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">✓</div>
                <span>Automated Verification Systems</span>
              </div>
            </div>
          </div>

          {/* Right Login Form Wrapper */}
          <div className="col-span-1 lg:col-span-7 flex justify-center">
            <div className="w-full max-w-md">
              <LoginForm />
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-6 text-center text-xs text-[#967A53] border-t border-[#E8DDCB]/60">
        <p>© 2026 CarbonChain Network. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Login;