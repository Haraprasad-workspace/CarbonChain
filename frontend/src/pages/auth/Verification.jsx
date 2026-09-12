import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AadhaarVerification from "../../components/auth/AadhaarVerification";
import GSTVerification from "../../components/auth/GSTVerification";

const Verification = () => {
  const navigate = useNavigate();

  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [gstVerified, setGstVerified] = useState(false);

  const handleContinue = () => {
    console.log("[Verification Debug] Navigating to dashboard after onboarding checks.");
    navigate("/");
  };

  const isComplete = aadhaarVerified && gstVerified;

  return (
    <div className="min-h-screen w-full bg-[#FFFBF5] text-[#422D0B] font-['Montserrat',sans-serif] flex flex-col justify-between selection:bg-[#FFA800] selection:text-white">
      {/* Background Decorative Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#FFA800]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#FFC24A]/15 rounded-full blur-3xl" />
      </div>

      {/* Header Bar */}
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

        <div className="flex items-center gap-2 text-xs text-[#967A53] bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#E8DDCB]">
          <span className="w-2 h-2 rounded-full bg-[#FFA800] animate-pulse" />
          <span>Onboarding Step 2 of 2</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl space-y-8">
          
          {/* Header Title & Description */}
          <div className="text-center max-w-xl mx-auto">
            <h1 className="text-3xl font-extrabold text-[#422D0B] tracking-tight">
              Account Compliance Verification
            </h1>
            <p className="text-xs text-[#967A53] mt-2">
              Complete your government identity and tax registration checks to gain verified trading status on CarbonChain.
            </p>
          </div>

          {/* Real-time Status Banner */}
          <div className="bg-white/80 border border-[#E8DDCB] rounded-2xl p-4 shadow-sm flex flex-wrap items-center justify-around gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#422D0B]">Aadhaar Identity:</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  aadhaarVerified
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-amber-100 text-amber-900 border border-amber-300"
                }`}
              >
                {aadhaarVerified ? "✓ Verified" : "Pending Action"}
              </span>
            </div>

            <div className="h-4 w-px bg-[#E8DDCB] hidden sm:block" />

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#422D0B]">GST Tax Registration:</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  gstVerified
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-amber-100 text-amber-900 border border-amber-300"
                }`}
              >
                {gstVerified ? "✓ Verified" : "Pending Action"}
              </span>
            </div>
          </div>

          {/* Verification Cards Layout Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <AadhaarVerification
              onVerified={() => setAadhaarVerified(true)}
            />

            <GSTVerification
              onVerified={() => setGstVerified(true)}
            />
          </div>

          {/* Primary Action Button */}
          <div className="flex flex-col items-center pt-4 space-y-3">
            <button
              onClick={handleContinue}
              className={`w-full max-w-md py-3.5 px-6 font-bold text-sm rounded-xl shadow-md transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 ${
                isComplete
                  ? "bg-[#FFA800] hover:bg-[#FFC24A] text-[#422D0B] shadow-lg"
                  : "bg-[#E8DDCB] text-[#967A53] hover:bg-[#FFA800] hover:text-[#422D0B]"
              }`}
            >
              <span>{isComplete ? "Complete Onboarding & Enter Dashboard" : "Skip or Continue to Dashboard"}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            
            {!isComplete && (
              <p className="text-[11px] text-[#967A53]">
                You can complete verification later from your Account Settings panel.
              </p>
            )}
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

export default Verification;