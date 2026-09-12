import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import gsap from "gsap";
import MatchList from "../../components/matching/MatchList";

const WasteMatches = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // GSAP Animation Refs
  const pageRef = useRef(null);
  const headerRef = useRef(null);
  const bannerRef = useRef(null);
  const matchesWrapperRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );

      // Informational Banner Animation
      gsap.fromTo(
        bannerRef.current,
        { opacity: 0, scale: 0.98, y: 10 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          delay: 0.15,
          ease: "power2.out",
        }
      );

      // Match List Container Staggered Entrance
      gsap.fromTo(
        matchesWrapperRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: 0.25,
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
      onComplete: () => navigate(`/generator/waste/${id}`),
    });
  };

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#FFFBF5] font-['Montserrat',sans-serif] text-[#422D0B] p-4 sm:p-8 selection:bg-[#FFA800] selection:text-white"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation & Page Header */}
        <header
          ref={headerRef}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDCB] pb-5"
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
                <span>Waste Profile</span>
              </button>
              <span className="text-[#E8DDCB]">•</span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#967A53]">
                AI Matchmaking
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#422D0B] tracking-tight">
              Matching Processing Facilities
            </h1>
          </div>

          <button
            type="button"
            onClick={handleBack}
            className="self-start sm:self-auto px-4 py-2.5 bg-white hover:bg-[#FFFBF5] text-[#422D0B] border border-[#E8DDCB] hover:border-[#FFA800] font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
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
            <span>Back to Waste Details</span>
          </button>
        </header>

        {/* Informational Callout Banner */}
        <section
          ref={bannerRef}
          className="p-4 sm:p-5 bg-white border border-[#E8DDCB] rounded-2xl shadow-xs flex items-start gap-4 relative overflow-hidden"
        >
          <div className="w-10 h-10 rounded-xl bg-[#FFFBF5] border border-[#E8DDCB] text-[#FFA800] flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>

          <div className="space-y-1">
            <h3 className="text-xs font-extrabold text-[#422D0B] uppercase tracking-wider">
              Smart Facility Matchmaking
            </h3>
            <p className="text-xs text-[#967A53] leading-relaxed">
              We dynamically rank facilities based on compatible biomass waste
              types, optimal transport proximity, available processing capacity,
              and operational verification status.
            </p>
          </div>
        </section>

        {/* Dynamic Match List Container */}
        <main
          ref={matchesWrapperRef}
          className="bg-white border border-[#E8DDCB] rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden"
        >
          {/* Subtle Background Glow Accent */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#FFA800]/5 rounded-bl-full pointer-events-none" />

          <MatchList wasteId={id} />
        </main>
      </div>
    </div>
  );
};

export default WasteMatches;