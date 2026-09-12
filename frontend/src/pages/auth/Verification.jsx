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
    <div className="min-h-screen w-full bg-[#F4F6F0] text-[#1E332B] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col justify-between selection:bg-[#143B36] selection:text-white">
      {/* Background Decorative Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#73A892]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#DCE9DF]/40 rounded-full blur-3xl" />
      </div>

      {/* Header Bar */}
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

        <div className="flex items-center gap-2 text-xs text-[#63786E] bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#E6EDE8]">
          <span className="w-2 h-2 rounded-full bg-[#2D6B4E] animate-pulse" />
          <span>Onboarding Step 2 of 2</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl space-y-8">
          
          {/* Header Title & Description */}
          <div className="text-center max-w-xl mx-auto">
            <h1 className="text-3xl font-extrabold text-[#1E332B] tracking-tight">
              Account Compliance Verification
            </h1>
            <p className="text-xs text-[#63786E] mt-2">
              Complete your government identity and tax registration checks to gain verified trading status on CarbonChain.
            </p>
          </div>

          {/* Real-time Status Banner */}
          <div className="bg-white border border-[#E6EDE8] rounded-2xl p-4 shadow-[0px_1px_3px_rgba(0,0,0,0.03)] flex flex-wrap items-center justify-around gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#1E332B]">Aadhaar Identity:</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  aadhaarVerified
                    ? "bg-[#D8EEDF] text-[#1E5E38]"
                    : "bg-[#FDEED9] text-[#875218]"
                }`}
              >
                {aadhaarVerified ? "✓ Verified" : "Pending Action"}
              </span>
            </div>

            <div className="h-4 w-px bg-[#E8EFEA] hidden sm:block" />

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#1E332B]">GST Tax Registration:</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  gstVerified
                    ? "bg-[#D8EEDF] text-[#1E5E38]"
                    : "bg-[#FDEED9] text-[#875218]"
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
              className={`w-full max-w-md py-2.5 px-6 text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99] ${
                isComplete
                  ? "bg-[#143B36] hover:bg-[#0D2925] text-white"
                  : "bg-[#E4EFE9] text-[#1E3B30] hover:bg-[#D4E4DC]"
              }`}
            >
              <span>{isComplete ? "Complete Onboarding & Enter Dashboard" : "Skip or Continue to Dashboard"}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            
            {!isComplete && (
              <p className="text-[11px] text-[#8EA097]">
                You can complete verification later from your Account Settings panel.
              </p>
            )}
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

export default Verification;