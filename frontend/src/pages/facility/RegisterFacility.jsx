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
      className="min-h-screen bg-[#0C1C18] font-['Plus_Jakarta_Sans',sans-serif] text-[#F4F6F0] p-4 sm:p-8 selection:bg-[#2D6B4E] selection:text-white relative"
    >
      {/* Background Decorative Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#2D6B4E]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#143B36]/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        {/* Navigation & Header Section */}
        <header
          ref={headerRef}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#143B36] pb-6"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleBack}
                className="text-[#8EA097] hover:text-[#F4F6F0] text-xs font-bold transition-colors flex items-center gap-1 group cursor-pointer"
              >
                <svg
                  className="w-4 h-4 text-[#73A892] group-hover:-translate-x-1 transition-transform"
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
              <span className="text-[#235349]">•</span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8EA097]">
                Facility Onboarding
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#F4F6F0] tracking-tight">
              Register New Facility
            </h1>
          </div>

          <button
            type="button"
            onClick={handleBack}
            className="self-start sm:self-auto px-4 py-2.5 bg-[#143B36] hover:bg-[#1E5247] text-[#F4F6F0] border border-[#235349] hover:border-[#2D6B4E] font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <svg
              className="w-3.5 h-3.5 text-[#8EA097]"
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
          className="bg-[#143B36] border border-[#235349] rounded-2xl p-6 sm:p-8 shadow-[0px_4px_24px_rgba(10,28,24,0.4)] relative overflow-hidden"
        >
          {/* Subtle Decorative Accent Glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#1E5247]/30 rounded-bl-full pointer-events-none blur-2xl" />

          <FacilityForm />
        </main>
      </div>
    </div>
  );
};

export default RegisterFacility;