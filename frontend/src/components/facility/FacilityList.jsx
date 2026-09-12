import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import FacilityCard from "./FacilityCard";
import { getMyFacilities } from "../../services/facilityService";

const FacilityList = () => {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState([]);
  const [filteredFacilities, setFilteredFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const statsRef = useRef(null);
  const cardsGridRef = useRef(null);
  const emptyStateRef = useRef(null);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyFacilities();
      const facilityList = data.facilities || [];
      setFacilities(facilityList);
      setFilteredFacilities(facilityList);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to establish connection with CarbonChain hub directory."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  // Filter & Search Logic
  useEffect(() => {
    let result = facilities;

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.facilityName?.toLowerCase().includes(q) ||
          f.location?.city?.toLowerCase().includes(q) ||
          f.acceptedWasteTypes?.some((w) => w.toLowerCase().includes(q))
      );
    }

    if (filterType !== "ALL") {
      result = result.filter((f) => f.facilityType === filterType);
    }

    setFilteredFacilities(result);
  }, [searchQuery, filterType, facilities]);

  // GSAP Animations configured to JSON spec
  useEffect(() => {
    if (!loading && containerRef.current) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { duration: 0.8, ease: "power3.out" },
        });

        if (headerRef.current) {
          tl.fromTo(
            headerRef.current,
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0 }
          );
        }

        if (statsRef.current) {
          tl.fromTo(
            statsRef.current.children,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, stagger: 0.08 },
            "-=0.4"
          );
        }

        if (cardsGridRef.current && cardsGridRef.current.children.length > 0) {
          gsap.fromTo(
            cardsGridRef.current.children,
            { opacity: 0, y: 25, scale: 0.97 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              stagger: 0.1, // Matches JSON stagger.cards
              ease: "power3.out",
            }
          );
        }

        if (emptyStateRef.current) {
          gsap.fromTo(
            emptyStateRef.current,
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" }
          );
        }
      }, containerRef);

      return () => ctx.revert();
    }
  }, [loading, filteredFacilities.length]);

  const totalCapacity = facilities.reduce(
    (acc, f) => acc + (Number(f.processingCapacity?.value) || 0),
    0
  );
  const citiesCount = new Set(facilities.map((f) => f.location?.city).filter(Boolean)).size;

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto font-['Montserrat',sans-serif] p-4 sm:p-6 space-y-8 text-[#ECFDF5] bg-[#050B07] min-h-screen">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(16,185,129,0.15)] pb-6">
          <div className="space-y-2">
            <div className="h-3 w-28 bg-[#0B1610] rounded animate-pulse" />
            <div className="h-7 w-56 bg-[#12221A] rounded-lg animate-pulse" />
          </div>
          <div className="h-10 w-40 bg-[#12221A] rounded-xl animate-pulse" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-[#0B1610] border border-[rgba(16,185,129,0.15)] rounded-2xl animate-pulse" />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[#12221A] border border-[rgba(16,185,129,0.15)] rounded-2xl p-6 h-56 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-xl mx-auto font-['Montserrat',sans-serif] p-6 my-12 text-[#ECFDF5]">
        <div className="bg-[#12221A] border border-red-500/30 rounded-2xl p-8 text-center space-y-4 shadow-[0_20px_25px_-5px_rgba(2,44,34,0.7)]">
          <div className="w-12 h-12 rounded-2xl bg-red-950/50 border border-red-500/40 text-red-400 flex items-center justify-center font-black text-xl mx-auto">
            !
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-red-200">
              Hub Network Connection Failure
            </h3>
            <p className="text-xs text-red-400/80 leading-relaxed font-['Fira_Code',monospace]">{error}</p>
          </div>
          <button
            onClick={fetchFacilities}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow transition-all active:scale-95 cursor-pointer"
          >
            Reconnect Hub Network
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full max-w-6xl mx-auto font-['Montserrat',sans-serif] text-[#ECFDF5] p-4 sm:p-6 space-y-6 selection:bg-[#10B981] selection:text-[#050B07]"
    >
      {/* Header */}
      <div
        ref={headerRef}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(16,185,129,0.15)] pb-5"
      >
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#10B981] font-['Fira_Code',monospace]">
            CarbonChain Ecosystem
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#ECFDF5] tracking-tight mt-0.5">
            Registered Processing Facilities
          </h1>
          <p className="text-xs text-[#A7F3D0] mt-1">
            Real-time infrastructure management, capacity metrics, and feedstock routing.
          </p>
        </div>

        <button
          onClick={() => navigate("/facility/register")}
          className="self-start sm:self-auto px-5 py-3 bg-[#D97706] hover:bg-[#F59E0B] text-[#ECFDF5] font-extrabold text-xs rounded-xl shadow-[0_4px_12px_-2px_rgba(2,44,34,0.5)] transition-all flex items-center gap-2 group active:scale-95 cursor-pointer"
        >
          <svg
            className="w-4 h-4 text-[#ECFDF5] group-hover:rotate-90 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Register New Hub</span>
        </button>
      </div>

      {/* Static Telemetry Banner */}
      <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0B1610] border border-[rgba(16,185,129,0.15)] p-4 rounded-2xl flex items-center justify-between shadow-[0_4px_12px_-2px_rgba(2,44,34,0.5)]">
          <div>
            <span className="text-[10px] font-extrabold text-[#047857] uppercase tracking-wider block font-['Fira_Code',monospace]">
              Active Nodes
            </span>
            <span className="text-2xl font-extrabold text-[#ECFDF5] font-['Fira_Code',monospace]">
              {facilities.length}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 text-[#34D399] font-black text-sm flex items-center justify-center">
            🌲
          </div>
        </div>

        <div className="bg-[#0B1610] border border-[rgba(16,185,129,0.15)] p-4 rounded-2xl flex items-center justify-between shadow-[0_4px_12px_-2px_rgba(2,44,34,0.5)]">
          <div>
            <span className="text-[10px] font-extrabold text-[#047857] uppercase tracking-wider block font-['Fira_Code',monospace]">
              Combined Throughput
            </span>
            <span className="text-2xl font-extrabold text-[#34D399] font-['Fira_Code',monospace]">
              {totalCapacity}{" "}
              <span className="text-xs font-bold text-[#A7F3D0]">MT/DAY</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 text-[#34D399] font-black text-sm flex items-center justify-center">
            ⚡
          </div>
        </div>

        <div className="bg-[#0B1610] border border-[rgba(16,185,129,0.15)] p-4 rounded-2xl flex items-center justify-between shadow-[0_4px_12px_-2px_rgba(2,44,34,0.5)]">
          <div>
            <span className="text-[10px] font-extrabold text-[#047857] uppercase tracking-wider block font-['Fira_Code',monospace]">
              Coverage Footprint
            </span>
            <span className="text-2xl font-extrabold text-[#D97706] font-['Fira_Code',monospace]">
              {citiesCount}{" "}
              <span className="text-xs font-bold text-[#A7F3D0]">REGIONS</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#D97706]/10 border border-[#D97706]/20 text-[#D97706] font-black text-sm flex items-center justify-center">
            📍
          </div>
        </div>
      </div>

      {/* Control Toolbar */}
      {facilities.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-[#0B1610] p-3 border border-[rgba(16,185,129,0.15)] rounded-2xl backdrop-blur-md">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <svg
              className="w-4 h-4 text-[#047857] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by hub name, city, feedstock..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-8 py-2 bg-[#12221A] border border-[rgba(16,185,129,0.15)] rounded-xl text-xs font-medium text-[#ECFDF5] focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] transition-all placeholder:text-[#047857]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#047857] hover:text-[#ECFDF5] text-xs font-bold px-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-[11px] font-bold text-[#A7F3D0] shrink-0 font-['Fira_Code',monospace]">
              Process Filter:
            </span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 bg-[#12221A] border border-[rgba(16,185,129,0.15)] rounded-xl text-xs font-bold text-[#ECFDF5] focus:outline-none focus:border-[#10B981] cursor-pointer"
            >
              <option value="ALL">All Conversion Types</option>
              <option value="BIOCHAR">Biochar</option>
              <option value="BIOGAS">Biogas</option>
              <option value="COMPOSTING">Composting</option>
              <option value="RECYCLING">Recycling</option>
              <option value="WASTE_TO_ENERGY">Waste to Energy</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>
      )}

      {/* Grid State */}
      {filteredFacilities.length === 0 ? (
        <div
          ref={emptyStateRef}
          className="bg-[#0B1610] border border-[rgba(16,185,129,0.15)] rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-[0_20px_25px_-5px_rgba(2,44,34,0.7)] max-w-lg mx-auto my-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#12221A] border border-[rgba(16,185,129,0.30)] flex items-center justify-center mx-auto text-[#10B981]">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H9" />
            </svg>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-[#ECFDF5]">
              {facilities.length === 0
                ? "No Registered Processing Facilities"
                : "No Facilities Match Selected Criteria"}
            </h3>
            <p className="text-xs text-[#A7F3D0] leading-relaxed max-w-xs mx-auto">
              {facilities.length === 0
                ? "Register your biomass conversion or circular waste treatment plant to link into the supply chain."
                : "Try resetting your search query or selecting a different facility conversion type."}
            </p>
          </div>

          {facilities.length === 0 ? (
            <button
              onClick={() => navigate("/facility/register")}
              className="px-6 py-3 bg-[#D97706] hover:bg-[#F59E0B] text-[#ECFDF5] font-extrabold text-xs rounded-xl shadow transition-all active:scale-95 inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Add Your First Hub</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterType("ALL");
              }}
              className="px-5 py-2.5 bg-[#12221A] border border-[rgba(16,185,129,0.30)] hover:border-[#34D399] text-[#ECFDF5] font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Reset Search Parameters
            </button>
          )}
        </div>
      ) : (
        <div
          ref={cardsGridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredFacilities.map((facility) => (
            <FacilityCard
              key={facility._id}
              facility={facility}
              onUpdate={fetchFacilities}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FacilityList;