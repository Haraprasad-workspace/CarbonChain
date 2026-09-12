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
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: -15 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
        );

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
      <div className="min-h-screen bg-[#F4F6F0] font-['Plus_Jakarta_Sans',sans-serif] flex flex-col items-center justify-center p-6 text-[#1E332B]">
        <div className="w-12 h-12 border-4 border-[#E6EDE8] border-t-[#143B36] rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold uppercase tracking-widest text-[#63786E] animate-pulse">
          Retrieving Waste Batch Details...
        </p>
      </div>
    );
  }

  // Error State UI
  if (error) {
    return (
      <div className="min-h-screen bg-[#F4F6F0] font-['Plus_Jakarta_Sans',sans-serif] flex items-center justify-center p-6 text-[#1E332B]">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-2xl p-6 text-center space-y-4 shadow-[0px_1px_3px_rgba(0,0,0,0.03)]">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
            ✕
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-red-900">
              Unable to Load Batch
            </h3>
            <p className="text-xs text-[#63786E] leading-relaxed">{error}</p>
          </div>
          <button
            type="button"
            onClick={handleBack}
            className="w-full py-2.5 px-4 bg-[#143B36] hover:bg-[#0D2925] text-white font-semibold text-xs rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer"
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
      <div className="min-h-screen bg-[#F4F6F0] font-['Plus_Jakarta_Sans',sans-serif] flex items-center justify-center p-6 text-[#1E332B]">
        <div className="max-w-md w-full bg-white border border-[#E6EDE8] rounded-2xl p-6 text-center space-y-4 shadow-[0px_1px_3px_rgba(0,0,0,0.03)]">
          <div className="w-12 h-12 bg-[#F4F6F0] border border-[#E6EDE8] text-[#143B36] rounded-full flex items-center justify-center mx-auto text-xl font-bold">
            ?
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#1E332B]">
              Waste Batch Not Found
            </h3>
            <p className="text-xs text-[#63786E] leading-relaxed">
              The requested waste batch record does not exist or has been removed.
            </p>
          </div>
          <button
            type="button"
            onClick={handleBack}
            className="w-full py-2.5 px-4 bg-[#143B36] hover:bg-[#0D2925] text-white font-semibold text-xs rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer"
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
      className="min-h-screen bg-[#F4F6F0] font-['Plus_Jakarta_Sans',sans-serif] text-[#1E332B] p-4 sm:p-[28px] selection:bg-[#143B36] selection:text-white"
    >
      <div className="max-w-4xl mx-auto space-y-6">
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
                <span>My Waste</span>
              </button>
              <span className="text-[#DFE6E1]">•</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8EA097]">
                Batch Profile
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E332B] tracking-tight">
              {waste?.wasteType ? `${waste.wasteType} Batch` : "Waste Details"}
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
            <span>Back to Inventory</span>
          </button>
        </header>

        {/* Content Sections Wrapper */}
        <main ref={contentSectionsRef} className="space-y-6">
          {/* Status Overview Card */}
          <WasteStatus status={waste.status} />

          {/* Details Overview Card */}
          <div className="bg-white border border-[#E6EDE8] rounded-2xl p-6 sm:p-8 shadow-[0px_1px_3px_rgba(0,0,0,0.03),0px_4px_12px_rgba(22,41,37,0.03)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E4EFE9]/50 rounded-bl-full pointer-events-none" />
            <WasteDetails waste={waste} />
          </div>

          {/* Facility Matchmaking Action Card (If Active) */}
          {waste.status !== "CANCELLED" && waste.status !== "PROCESSED" && (
            <div className="bg-white border border-[#E6EDE8] hover:border-[#73A892] rounded-2xl p-6 sm:p-8 shadow-[0px_1px_3px_rgba(0,0,0,0.03)] transition-all relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 group">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#73A892] animate-ping" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#63786E]">
                    AI Recommended Action
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#1E332B]">
                  Find Processing Facility
                </h3>
                <p className="text-xs text-[#63786E] leading-relaxed">
                  Discover top suitable biomass processing plants based on waste
                  composition, transport distance, capacity limits, and operational
                  status.
                </p>
              </div>

              <button
                type="button"
                onClick={handleNavigateToMatches}
                className="px-6 py-3 bg-[#143B36] hover:bg-[#0D2925] text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95 cursor-pointer"
              >
                <span>Find Matching Facilities</span>
                <svg
                  className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform"
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