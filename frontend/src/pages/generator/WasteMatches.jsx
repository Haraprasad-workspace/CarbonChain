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
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: -15 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
        );
      }

      // Informational Banner Animation
      if (bannerRef.current) {
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
      }

      // Match List Container Staggered Entrance
      if (matchesWrapperRef.current) {
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
      }
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
      className="min-h-screen bg-[#0C1C18] font-['Plus_Jakarta_Sans',sans-serif] text-[#F4F6F0] p-4 sm:p-[28px] selection:bg-[#2D6B4E] selection:text-white relative"
    >
      {/* Background Decorative Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#2D6B4E]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#143B36]/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto space-y-6 relative z-10">
        {/* Navigation & Page Header */}
        <header
          ref={headerRef}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#143B36] pb-5"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleBack}
                className="text-[#8EA097] hover:text-[#F4F6F0] text-xs font-semibold transition-colors flex items-center gap-1 group cursor-pointer"
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
                <span>Waste Profile</span>
              </button>
              <span className="text-[#235349]">•</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8EA097]">
                AI Matchmaking
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4F6F0] tracking-tight">
              Matching Processing Facilities
            </h1>
          </div>

          <button
            type="button"
            onClick={handleBack}
            className="self-start sm:self-auto px-4 py-2.5 bg-[#143B36] hover:bg-[#1E5247] text-[#F4F6F0] border border-[#235349] hover:border-[#2D6B4E] font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <svg
              className="w-3.5 h-3.5 text-[#73A892]"
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
          className="p-4 sm:p-5 bg-[#143B36] border border-[#235349] rounded-2xl shadow-[0px_4px_24px_rgba(10,28,24,0.4)] flex items-start gap-4 relative overflow-hidden"
        >
          <div className="w-10 h-10 rounded-xl bg-[#1E5247] border border-[#2D6B4E] text-[#73A892] flex items-center justify-center shrink-0">
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
            <h3 className="text-xs font-bold text-[#F4F6F0] uppercase tracking-wider">
              Smart Facility Matchmaking
            </h3>
            <p className="text-xs text-[#8EA097] leading-relaxed">
              We dynamically rank facilities based on compatible biomass waste
              types, optimal transport proximity, available processing capacity,
              and operational verification status.
            </p>
          </div>
        </section>

        {/* Dynamic Match List Container */}
        <main
          ref={matchesWrapperRef}
          className="bg-[#143B36] border border-[#235349] rounded-2xl p-6 sm:p-8 shadow-[0px_4px_24px_rgba(10,28,24,0.4)] relative overflow-hidden"
        >
          {/* Subtle Background Glow Accent */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#1E5247]/40 rounded-bl-full pointer-events-none blur-xl" />

          <MatchList wasteId={id} />
        </main>
      </div>
    </div>
  );
};

export default WasteMatches;