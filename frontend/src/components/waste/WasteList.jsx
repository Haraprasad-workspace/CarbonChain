import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import WasteCard from "./WasteCard";
import { getMyWasteBatches } from "../../services/wasteService";

const WasteList = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [wasteBatches, setWasteBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWasteBatches = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyWasteBatches();
      setWasteBatches(data.wasteBatches || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to fetch waste batches."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWasteBatches();
  }, []);

  useEffect(() => {
    if (!loading && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
      );
    }
  }, [loading]);

  // Loading State
  if (loading) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center font-['Montserrat',sans-serif]">
        <div className="relative flex items-center justify-center mb-3">
          <div className="w-10 h-10 border-4 border-[rgba(16,185,129,0.15)] border-t-[#10B981] rounded-full animate-spin shadow-[0_0_10px_rgba(16,185,129,0.2)]" />
          <div className="absolute w-4 h-4 bg-[#12221A] rounded-full" />
        </div>
        <p className="text-xs font-bold text-[#A7F3D0]/70 tracking-wider uppercase">
          Loading Waste Batches...
        </p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="w-full p-6 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-center font-['Montserrat',sans-serif] shadow-[0_0_10px_rgba(244,63,94,0.15)]">
        <p className="text-xs font-semibold text-rose-400 mb-3">{error}</p>
        <button
          onClick={fetchWasteBatches}
          className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-[#050B07] font-black text-xs rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="w-full space-y-6 font-['Montserrat',sans-serif] text-[#ECFDF5]"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(16,185,129,0.15)] pb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#065F46]">
            Inventory Management
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#ECFDF5] tracking-tight mt-0.5">
            My Waste Batches
          </h2>
          <p className="text-xs text-[#A7F3D0]/70 mt-0.5 font-medium">
            Manage your registered waste inventory, track status, or cancel active listings.
          </p>
        </div>

        <button
          onClick={() => navigate("/generator/waste/new")}
          className="self-start sm:self-auto px-4 py-2.5 bg-[#10B981] hover:bg-[#059669] text-[#050B07] font-black text-xs rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4 text-[#050B07]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Register New Batch</span>
        </button>
      </div>

      {/* Empty Inventory State */}
      {wasteBatches.length === 0 ? (
        <div className="w-full bg-[#0B1610] border border-[rgba(16,185,129,0.15)] rounded-2xl p-10 text-center space-y-3 shadow-[0_4px_24px_-4px_rgba(2,44,34,0.6)] backdrop-blur-[16px]">
          <div className="w-12 h-12 rounded-2xl bg-[#12221A] border border-[rgba(16,185,129,0.3)] flex items-center justify-center mx-auto text-[#10B981]">
            <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-[#ECFDF5]">No Waste Batches Registered</h3>
          <p className="text-xs text-[#A7F3D0]/70 max-w-sm mx-auto font-medium">
            You haven't listed any biomass or waste batches yet. Start by registering your first batch to participate in carbon credit tracking.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate("/generator/waste/new")}
              className="px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-[#050B07] font-black text-xs rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Create First Listing</span>
            </button>
          </div>
        </div>
      ) : (
        /* Responsive Grid of Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wasteBatches.map((waste) => (
            <WasteCard
              key={waste._id}
              waste={waste}
              onUpdate={fetchWasteBatches}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WasteList;