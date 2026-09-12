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
      className="min-h-screen bg-[#F4F6F0] font-['Plus_Jakarta_Sans',sans-serif] text-[#1E332B] p-4 sm:p-[28px] selection:bg-[#143B36] selection:text-white"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation & Page Header */}
        <header
          ref={headerRef}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8EFEA] pb-5"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleBack}
                className="text-[#63786E] hover:text-[#1E332B] text-xs font-semibold transition-colors flex items-center gap-1 group cursor-pointer"
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
              <span className="text-[#DFE6E1]">•</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8EA097]">
                AI Matchmaking
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E332B] tracking-tight">
              Matching Processing Facilities
            </h1>
          </div>

          <button
            type="button"
            onClick={handleBack}
            className="self-start sm:self-auto px-4 py-2.5 bg-white hover:bg-[#F4F6F0] text-[#1E332B] border border-[#E6EDE8] hover:border-[#73A892] font-semibold text-xs rounded-xl shadow-[0px_1px_3px_rgba(0,0,0,0.03)] transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <svg
              className="w-3.5 h-3.5 text-[#63786E]"
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
          className="p-4 sm:p-5 bg-white border border-[#E6EDE8] rounded-2xl shadow-[0px_1px_3px_rgba(0,0,0,0.03)] flex items-start gap-4 relative overflow-hidden"
        >
          <div className="w-10 h-10 rounded-xl bg-[#DCE9DF] border border-[#DCE9DF] text-[#1E3B30] flex items-center justify-center shrink-0">
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
            <h3 className="text-xs font-bold text-[#1E332B] uppercase tracking-wider">
              Smart Facility Matchmaking
            </h3>
            <p className="text-xs text-[#63786E] leading-relaxed">
              We dynamically rank facilities based on compatible biomass waste
              types, optimal transport proximity, available processing capacity,
              and operational verification status.
            </p>
          </div>
        </section>

        {/* Dynamic Match List Container */}
        <main
          ref={matchesWrapperRef}
          className="bg-white border border-[#E6EDE8] rounded-2xl p-6 sm:p-8 shadow-[0px_1px_3px_rgba(0,0,0,0.03),0px_4px_12px_rgba(22,41,37,0.03)] relative overflow-hidden"
        >
          {/* Subtle Background Glow Accent */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#E4EFE9]/40 rounded-bl-full pointer-events-none" />

          <MatchList wasteId={id} />
        </main>
      </div>
    </div>
  );
};

export default WasteMatches;