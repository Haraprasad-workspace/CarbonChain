import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import gsap from "gsap";

import WasteDetails from "../../components/waste/WasteDetails";
import WasteStatus from "../../components/waste/WasteStatus";
import { getWasteBatch } from "../../services/wasteService";

const WasteDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [waste, setWaste] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Animation Refs
  const pageRef = useRef(null);
  const headerRef = useRef(null);
  const contentSectionsRef = useRef(null);

  useEffect(() => {
    const fetchWaste = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getWasteBatch(id);
        setWaste(data.wasteBatch);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to fetch waste batch details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWaste();
  }, [id]);

  // GSAP Entrance Effect on Data Load
  useEffect(() => {
    if (!loading && !error && waste) {
      const ctx = gsap.context(() => {
        // Header entrance
        if (headerRef.current) {
          gsap.fromTo(
            headerRef.current,
            { opacity: 0, y: -15 },
            { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
          );
        }

        // Content cards stagger entrance
        if (contentSectionsRef.current?.children) {
          gsap.fromTo(
            contentSectionsRef.current.children,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.12,
              ease: "power2.out",
              delay: 0.1,
            }
          );
        }
      }, pageRef);

      return () => ctx.revert();
    }
  }, [loading, error, waste]);

  const handleBack = () => {
    gsap.to(pageRef.current, {
      opacity: 0,
      y: 10,
      duration: 0.2,
      onComplete: () => navigate("/generator/waste"),
    });
  };

  const handleNavigateToMatches = () => {
    gsap.to(pageRef.current, {
      opacity: 0,
      y: -10,
      duration: 0.2,
      onComplete: () => navigate(`/generator/waste/${id}/matches`),
    });
  };

  // Loading State UI
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0C1C18] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col items-center justify-center p-6 text-[#F4F6F0]">
        <div className="w-12 h-12 border-4 border-[#235349] border-t-[#73A892] rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold uppercase tracking-widest text-[#8EA097] animate-pulse">
          Retrieving Waste Batch Details...
        </p>
      </div>
    );
  }

  // Error State UI
  if (error) {
    return (
      <div className="min-h-screen bg-[#0C1C18] font-['Plus_Jakarta_Sans',sans-serif] flex items-center justify-center p-6 text-[#F4F6F0]">
        <div className="max-w-md w-full bg-[#143B36] border border-red-500/30 rounded-2xl p-6 text-center space-y-4 shadow-[0px_4px_24px_rgba(10,28,24,0.4)]">
          <div className="w-12 h-12 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto text-xl font-bold border border-red-500/20">
            ✕
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-red-200">
              Unable to Load Batch
            </h3>
            <p className="text-xs text-[#8EA097] leading-relaxed">{error}</p>
          </div>
          <button
            type="button"
            onClick={handleBack}
            className="w-full py-2.5 px-4 bg-[#1E5247] hover:bg-[#2D6B4E] text-[#F4F6F0] font-semibold text-xs rounded-xl border border-[#2D6B4E] transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            Back to My Waste
          </button>
        </div>
      </div>
    );
  }

  // Not Found State UI
  if (!waste) {
    return (
      <div className="min-h-screen bg-[#0C1C18] font-['Plus_Jakarta_Sans',sans-serif] flex items-center justify-center p-6 text-[#F4F6F0]">
        <div className="max-w-md w-full bg-[#143B36] border border-[#235349] rounded-2xl p-6 text-center space-y-4 shadow-[0px_4px_24px_rgba(10,28,24,0.4)]">
          <div className="w-12 h-12 bg-[#0C1C18] border border-[#235349] text-[#73A892] rounded-full flex items-center justify-center mx-auto text-xl font-bold">
            ?
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#F4F6F0]">
              Waste Batch Not Found
            </h3>
            <p className="text-xs text-[#8EA097] leading-relaxed">
              The requested waste batch record does not exist or has been removed.
            </p>
          </div>
          <button
            type="button"
            onClick={handleBack}
            className="w-full py-2.5 px-4 bg-[#1E5247] hover:bg-[#2D6B4E] text-[#F4F6F0] font-semibold text-xs rounded-xl border border-[#2D6B4E] transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            Back to My Waste
          </button>
        </div>
      </div>
    );
  }

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

      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
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
                <span>My Waste</span>
              </button>
              <span className="text-[#235349]">•</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8EA097]">
                Batch Profile
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4F6F0] tracking-tight">
              {waste?.wasteType ? `${waste.wasteType} Batch` : "Waste Details"}
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
            <span>Back to Inventory</span>
          </button>
        </header>

        {/* Content Sections Wrapper */}
        <main ref={contentSectionsRef} className="space-y-6">
          {/* Status Overview Card */}
          <WasteStatus status={waste.status} />

          {/* Details Overview Card */}
          <div className="bg-[#143B36] border border-[#235349] rounded-2xl p-6 sm:p-8 shadow-[0px_4px_24px_rgba(10,28,24,0.4)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#1E5247]/40 rounded-bl-full pointer-events-none blur-xl" />
            <WasteDetails waste={waste} />
          </div>

          {/* Facility Matchmaking Action Card (If Active) */}
          {waste.status !== "CANCELLED" && waste.status !== "PROCESSED" && (
            <div className="bg-[#143B36] border border-[#235349] hover:border-[#2D6B4E] rounded-2xl p-6 sm:p-8 shadow-[0px_4px_24px_rgba(10,28,24,0.4)] transition-all relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 group">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#73A892] animate-ping" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#8EA097]">
                    AI Recommended Action
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#F4F6F0]">
                  Find Processing Facility
                </h3>
                <p className="text-xs text-[#8EA097] leading-relaxed">
                  Discover top suitable biomass processing plants based on waste
                  composition, transport distance, capacity limits, and operational
                  status.
                </p>
              </div>

              <button
                type="button"
                onClick={handleNavigateToMatches}
                className="px-6 py-3 bg-[#1E5247] hover:bg-[#2D6B4E] text-[#F4F6F0] font-semibold text-xs rounded-xl border border-[#2D6B4E] shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95 cursor-pointer"
              >
                <span>Find Matching Facilities</span>
                <svg
                  className="w-4 h-4 text-[#73A892] group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default WasteDetailsPage;