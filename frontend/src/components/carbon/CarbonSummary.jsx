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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-['Montserrat',sans-serif]">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="bg-white border border-[#E8DDCB] rounded-2xl p-5 space-y-3 animate-pulse"
          >
            <div className="h-3 w-24 bg-[#E8DDCB]/60 rounded-full" />
            <div className="h-7 w-32 bg-[#E8DDCB] rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between text-xs font-['Montserrat',sans-serif]">
        <div className="flex items-center gap-2 text-rose-800">
          <svg className="w-4 h-4 text-rose-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-bold">{error}</span>
        </div>
        <button
          type="button"
          onClick={fetchSummary}
          className="text-xs font-black text-[#422D0B] underline hover:text-[#FFA800] transition-colors cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-['Montserrat',sans-serif]"
    >
      {/* Metric 1: Waste Processed */}
      <div className="bg-white border border-[#E8DDCB] hover:border-[#FFA800]/50 rounded-2xl p-5 shadow-xs transition-all duration-300 space-y-2 group">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#967A53]">
            Waste Processed
          </span>
          <div className="w-7 h-7 rounded-lg bg-[#FFFBF5] border border-[#E8DDCB] text-[#FFA800] flex items-center justify-center text-xs font-black">
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
      <div className="bg-white border border-[#E8DDCB] hover:border-[#FFA800]/50 rounded-2xl p-5 shadow-xs transition-all duration-300 space-y-2 group">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#967A53]">
            CO₂e Avoided
          </span>
          <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center text-xs font-black">
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
      <div className="bg-white border border-[#E8DDCB] hover:border-[#FFA800]/50 rounded-2xl p-5 shadow-xs transition-all duration-300 space-y-2 group">
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
  );
};

export default CarbonSummary;