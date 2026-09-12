import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import AadhaarVerification from "../../components/auth/AadhaarVerification";
import GSTVerification from "../../components/auth/GSTVerification";

const Verification = () => {
  const navigate = useNavigate();

  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [gstVerified, setGstVerified] = useState(false);

  // Animation Ref
  const pageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (pageRef.current) {
        gsap.fromTo(
          pageRef.current.children,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
        );
      }
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const handleContinue = () => {
    console.log("[Verification Debug] Navigating to dashboard after onboarding checks.");
    navigate("/");
  };

  const isComplete = aadhaarVerified && gstVerified;

  return (
    <div
      ref={pageRef}
      className="min-h-screen w-full bg-[#0C1C18] text-[#F4F6F0] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col justify-between selection:bg-[#2D6B4E] selection:text-white"
    >
      {/* Background Decorative Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#2D6B4E]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#143B36]/30 rounded-full blur-3xl" />
      </div>

      {/* Header Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#143B36] border border-[#235349] flex items-center justify-center shadow-sm">
            <svg
              className="w-6 h-6 text-[#73A892]"
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
          <span className="text-xl font-bold tracking-tight text-[#F4F6F0]">
            Carbon<span className="text-[#73A892]">Chain</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#8EA097] bg-[#143B36]/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#235349]">
          <span className="w-2 h-2 rounded-full bg-[#73A892] animate-pulse" />
          <span>Onboarding Step 2 of 2</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-4xl space-y-8">
          
          {/* Header Title & Description */}
          <div className="text-center max-w-xl mx-auto">
            <h1 className="text-3xl font-extrabold text-[#F4F6F0] tracking-tight">
              Account Compliance Verification
            </h1>
            <p className="text-xs text-[#8EA097] mt-2">
              Complete your government identity and tax registration checks to gain verified trading status on CarbonChain.
            </p>
          </div>

          {/* Real-time Status Banner */}
          <div className="bg-[#143B36] border border-[#235349] rounded-2xl p-4 shadow-[0px_4px_24px_rgba(10,28,24,0.4)] flex flex-wrap items-center justify-around gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#8EA097]">Aadhaar Identity:</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  aadhaarVerified
                    ? "bg-[#1E5247] text-[#73A892] border border-[#2D6B4E]"
                    : "bg-[#3D2C1E] text-[#E0A865] border border-[#5C3D24]"
                }`}
              >
                {aadhaarVerified ? "✓ Verified" : "Pending Action"}
              </span>
            </div>

            <div className="h-4 w-px bg-[#235349] hidden sm:block" />

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#8EA097]">GST Tax Registration:</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  gstVerified
                    ? "bg-[#1E5247] text-[#73A892] border border-[#2D6B4E]"
                    : "bg-[#3D2C1E] text-[#E0A865] border border-[#5C3D24]"
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
              className={`w-full max-w-md py-2.5 px-6 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.99] ${
                isComplete
                  ? "bg-[#73A892] hover:bg-[#85B8A2] active:bg-[#62947F] text-[#0C1C18]"
                  : "bg-[#143B36] text-[#8EA097] border border-[#235349] hover:bg-[#1E5247] hover:text-[#F4F6F0]"
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
      <footer className="relative z-10 w-full py-6 text-center text-xs text-[#8EA097] border-t border-[#143B36]">
        <p>© 2026 CarbonChain Network. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Verification;