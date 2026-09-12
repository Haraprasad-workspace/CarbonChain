import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { getCarbonSummary } from "../../services/carbonService";

const CarbonSummary = () => {
  const [summary, setSummary] = useState({
    totalWasteProcessed: 0,
    totalCo2eAvoided: 0,
    totalRecords: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const containerRef = useRef(null);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCarbonSummary();

      setSummary(
        data.summary || {
          totalWasteProcessed: 0,
          totalCo2eAvoided: 0,
          totalRecords: 0,
        }
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch carbon summary."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  // Entrance animation for metrics
  useEffect(() => {
    if (!loading && !error && containerRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          containerRef.current.children,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: "power2.out",
          }
        );
      }, containerRef);

      return () => ctx.revert();
    }
  }, [loading, error]);

  // Loading State
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="bg-[#FFFBF5] border border-[#E8DDCB] rounded-2xl p-5 space-y-3 animate-pulse shadow-sm"
          >
            <div className="h-3 w-24 bg-[#E8DDCB] rounded-full" />
            <div className="h-7 w-32 bg-[#E8DDCB]/70 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between text-xs font-sans">
        <div className="flex items-center gap-2 text-red-800">
          <svg className="w-4 h-4 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-bold">{error}</span>
        </div>
        <button
          type="button"
          onClick={fetchSummary}
          className="text-xs font-black text-[#FFA800] underline hover:text-[#FFC24A] transition-colors cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans text-[#422D0B]">
      {/* Metric Cards Grid */}
      <div
        ref={containerRef}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {/* Metric 1: Waste Processed */}
        <div className="bg-[#FFFBF5] border border-[#E8DDCB] hover:border-[#FFA800] rounded-2xl p-5 shadow-sm transition-all duration-300 space-y-2 group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#967A53]">
              Waste Processed
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#FFC24A]/20 border border-[#FFA800]/30 text-[#422D0B] flex items-center justify-center text-xs font-black">
              ♻️
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[#422D0B] tracking-tight">
              {summary.totalWasteProcessed?.toLocaleString() ?? 0}
            </span>
            <span className="text-xs font-extrabold text-[#FFA800]">TON</span>
          </div>
        </div>

        {/* Metric 2: CO2e Avoided */}
        <div className="bg-[#FFFBF5] border border-[#E8DDCB] hover:border-[#FFA800] rounded-2xl p-5 shadow-sm transition-all duration-300 space-y-2 group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#967A53]">
              CO₂e Avoided
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#FFC24A]/20 border border-[#FFA800]/30 text-[#422D0B] flex items-center justify-center text-xs font-black">
              🌱
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[#422D0B] tracking-tight">
              {summary.totalCo2eAvoided?.toLocaleString() ?? 0}
            </span>
            <span className="text-xs font-extrabold text-[#FFA800]">TON</span>
          </div>
        </div>

        {/* Metric 3: Carbon Records */}
        <div className="bg-[#FFFBF5] border border-[#E8DDCB] hover:border-[#FFA800] rounded-2xl p-5 shadow-sm transition-all duration-300 space-y-2 group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#967A53]">
              Carbon Records
            </span>
            <div className="w-7 h-7 rounded-lg bg-[#FFFBF5] border border-[#E8DDCB] text-[#967A53] flex items-center justify-center text-xs font-black">
              📋
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-[#422D0B] tracking-tight">
              {summary.totalRecords?.toLocaleString() ?? 0}
            </span>
            <span className="text-xs font-extrabold text-[#967A53]">LOGS</span>
          </div>
        </div>
      </div>

      {/* Informational Context Banner */}
      <div className="bg-[#FFFBF5] border border-[#E8DDCB] rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <h4 className="text-xs font-black text-[#422D0B] uppercase tracking-wider">
            Morning Marigold Impact Verification
          </h4>
          <p className="text-xs text-[#967A53] leading-relaxed">
            All registered biomass and waste conversions are audited step-by-step. By converting organic residue into biochar, compost, or biogas, your organization helps offset atmospheric carbon and promotes circular economy initiatives across regional networks.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2 px-3 py-1.5 bg-[#FFC24A]/20 border border-[#FFA800]/30 rounded-xl text-[11px] font-bold text-[#422D0B]">
          <span className="w-2 h-2 rounded-full bg-[#FFA800] animate-pulse" />
          Real-time Audit Active
        </div>
      </div>
    </div>
  );
};

export default CarbonSummary;