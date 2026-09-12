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

  // GSAP Animation Refs
  const containerRef = useRef(null);
  const headerRef = useRef(null);
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
          "Failed to retrieve your facilities. Please check your network connection."
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

  // GSAP Initial & Grid Entrance Animations
  useEffect(() => {
    if (!loading && containerRef.current) {
      const ctx = gsap.context(() => {
        // Header Fade Down
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        );

        // Stagger Cards Grid Entrance
        if (cardsGridRef.current && cardsGridRef.current.children.length > 0) {
          gsap.fromTo(
            cardsGridRef.current.children,
            { opacity: 0, y: 30, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
              stagger: 0.08,
              ease: "power2.out",
            }
          );
        }

        // Empty State Pop
        if (emptyStateRef.current) {
          gsap.fromTo(
            emptyStateRef.current,
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
          );
        }
      }, containerRef);

      return () => ctx.revert();
    }
  }, [loading, filteredFacilities.length]);

  // Loading Skeleton View
  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto font-['Montserrat',sans-serif] p-4 sm:p-6 space-y-8 text-[#422D0B]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDCB] pb-6">
          <div className="space-y-2">
            <div className="h-4 w-32 bg-[#E8DDCB]/50 rounded animate-pulse" />
            <div className="h-8 w-60 bg-[#E8DDCB]/70 rounded-lg animate-pulse" />
          </div>
          <div className="h-10 w-36 bg-[#E8DDCB]/50 rounded-xl animate-pulse" />
        </div>

        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border border-[#E8DDCB] rounded-2xl p-6 space-y-4 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-[#FFFBF5] rounded-xl animate-pulse border border-[#E8DDCB]" />
                <div className="h-5 w-20 bg-[#E8DDCB]/40 rounded-full animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-5 w-3/4 bg-[#E8DDCB]/60 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-[#E8DDCB]/40 rounded animate-pulse" />
              </div>
              <div className="pt-4 border-t border-[#E8DDCB]/50 flex justify-between">
                <div className="h-4 w-24 bg-[#E8DDCB]/40 rounded animate-pulse" />
                <div className="h-4 w-16 bg-[#E8DDCB]/40 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State View
  if (error) {
    return (
      <div className="w-full max-w-xl mx-auto font-['Montserrat',sans-serif] p-6 my-12 text-[#422D0B]">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center font-black text-xl mx-auto">
            !
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-red-900">
              Unable to Load Facilities
            </h3>
            <p className="text-xs text-red-700 leading-relaxed">{error}</p>
          </div>
          <button
            onClick={fetchFacilities}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow transition-all active:scale-95"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full max-w-6xl mx-auto font-['Montserrat',sans-serif] text-[#422D0B] p-4 sm:p-6 selection:bg-[#FFA800] selection:text-white space-y-8"
    >
      {/* Top Bar Header */}
      <div
        ref={headerRef}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDCB] pb-6"
      >
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#967A53]">
            Processing Network
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#422D0B] tracking-tight mt-0.5">
            My Registered Facilities
          </h1>
          <p className="text-xs text-[#967A53] mt-1">
            Manage operational parameters, edit details, or register additional capacity.
          </p>
        </div>

        <button
          onClick={() => navigate("/facility/register")}
          className="self-start sm:self-auto px-5 py-3 bg-[#FFA800] hover:bg-[#FFC24A] text-[#422D0B] font-extrabold text-xs rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2 group active:scale-95"
        >
          <svg
            className="w-4 h-4 text-[#422D0B] group-hover:rotate-90 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Register New Facility</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      {facilities.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3 border border-[#E8DDCB] rounded-2xl shadow-sm">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <svg
              className="w-4 h-4 text-[#967A53] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, city, or waste type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#FFFBF5] border border-[#E8DDCB] rounded-xl text-xs font-medium text-[#422D0B] focus:outline-none focus:border-[#FFA800] transition-all placeholder:text-[#967A53]/60"
            />
          </div>

          {/* Type Filter Select */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-[11px] font-bold text-[#967A53] shrink-0">
              Type:
            </span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 bg-[#FFFBF5] border border-[#E8DDCB] rounded-xl text-xs font-bold text-[#422D0B] focus:outline-none focus:border-[#FFA800] cursor-pointer"
            >
              <option value="ALL">All Facility Types</option>
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

      {/* Facilities Display Area */}
      {filteredFacilities.length === 0 ? (
        /* Empty State */
        <div
          ref={emptyStateRef}
          className="bg-white border border-[#E8DDCB] rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-sm max-w-lg mx-auto my-8"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#FFFBF5] border border-[#E8DDCB] flex items-center justify-center mx-auto text-[#FFA800]">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H9" />
            </svg>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-extrabold text-[#422D0B]">
              {facilities.length === 0
                ? "No Facilities Registered Yet"
                : "No Matching Facilities Found"}
            </h3>
            <p className="text-xs text-[#967A53] leading-relaxed max-w-xs mx-auto">
              {facilities.length === 0
                ? "Register your biomass conversion or waste treatment plant to start accepting waste supplies."
                : "Try adjusting your search criteria or type filter to locate your facility."}
            </p>
          </div>

          {facilities.length === 0 ? (
            <button
              onClick={() => navigate("/facility/register")}
              className="px-6 py-3 bg-[#FFA800] hover:bg-[#FFC24A] text-[#422D0B] font-extrabold text-xs rounded-xl shadow-sm hover:shadow transition-all active:scale-95 inline-flex items-center gap-2"
            >
              <span>Add Your First Facility</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterType("ALL");
              }}
              className="px-5 py-2.5 bg-[#FFFBF5] border border-[#E8DDCB] hover:border-[#FFA800] text-[#422D0B] font-bold text-xs rounded-xl transition-all"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        /* Cards Grid */
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