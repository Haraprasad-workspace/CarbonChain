import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import FacilityList from "../../components/facility/FacilityList";

const MyFacilities = () => {
  const navigate = useNavigate();

  // GSAP Animation Refs
  const pageRef = useRef(null);
  const headerRef = useRef(null);
  const contentWrapperRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Fade & Slide Down
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );

      // Main Content & FacilityList Fade-In
      gsap.fromTo(
        contentWrapperRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
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
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation & Header Bar */}
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
                Facility Directory
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#422D0B] tracking-tight">
              My Registered Facilities
            </h1>
          </div>

          {/* Action Header Buttons */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2.5 bg-white hover:bg-[#FFFBF5] text-[#422D0B] border border-[#E8DDCB] hover:border-[#FFA800] font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
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
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/facility/register")}
              className="px-4 py-2.5 bg-[#FFA800] hover:bg-[#FFC24A] text-[#422D0B] font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <svg
                className="w-4 h-4 text-[#422D0B]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Register New Facility</span>
            </button>
          </div>
        </header>

        {/* List Section Wrapper */}
        <main
          ref={contentWrapperRef}
          className="bg-white border border-[#E8DDCB] rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden"
        >
          {/* Subtle Background Glow Accent */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#FFA800]/5 rounded-bl-full pointer-events-none" />

          <FacilityList />
        </main>
      </div>
    </div>
  );
};

export default MyFacilities;