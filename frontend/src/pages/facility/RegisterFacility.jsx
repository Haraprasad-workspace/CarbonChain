import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import FacilityForm from "../../components/facility/FacilityForm";

const RegisterFacility = () => {
  const navigate = useNavigate();

  // Animation Refs
  const pageRef = useRef(null);
  const headerRef = useRef(null);
  const formWrapperRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Fade & Drop
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );

      // Form Container Scale & Fade
      gsap.fromTo(
        formWrapperRef.current,
        { opacity: 0, y: 20, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          delay: 0.15,
          ease: "power2.out",
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const handleBack = () => {
    gsap.to(pageRef.current, {
      opacity: 0,
      y: 10,
      duration: 0.2,
      onComplete: () => navigate("/facility"),
    });
  };

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#FFFBF5] font-['Montserrat',sans-serif] text-[#422D0B] p-4 sm:p-8 selection:bg-[#FFA800] selection:text-white"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation & Header Section */}
        <header
          ref={headerRef}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDCB] pb-6"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleBack}
                className="text-[#967A53] hover:text-[#422D0B] text-xs font-bold transition-colors flex items-center gap-1 group cursor-pointer"
              >
                <svg
                  className="w-4 h-4 text-[#FFA800] group-hover:-translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span>Dashboard</span>
              </button>
              <span className="text-[#E8DDCB]">•</span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#967A53]">
                Facility Onboarding
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#422D0B] tracking-tight">
              Register New Facility
            </h1>
          </div>

          <button
            type="button"
            onClick={handleBack}
            className="self-start sm:self-auto px-4 py-2 bg-white hover:bg-[#FFFBF5] text-[#422D0B] border border-[#E8DDCB] hover:border-[#FFA800] font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <svg
              className="w-3.5 h-3.5 text-[#967A53]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back to Dashboard</span>
          </button>
        </header>

        {/* Facility Registration Form Container */}
        <main
          ref={formWrapperRef}
          className="bg-white border border-[#E8DDCB] rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden"
        >
          {/* Subtle Decorative Accent Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFA800]/5 rounded-bl-full pointer-events-none" />

          <FacilityForm />
        </main>
      </div>
    </div>
  );
};

export default RegisterFacility;