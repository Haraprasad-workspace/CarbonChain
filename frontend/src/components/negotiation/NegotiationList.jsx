import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import useAuth from "../../hooks/useAuth";
import {
  getGeneratorNegotiations,
  getFacilityNegotiations,
} from "../../services/negotiationService";

import NegotiationCard from "./NegotiationCard";

const NegotiationList = () => {
  const { user } = useAuth();

  const [negotiations, setNegotiations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");

  // GSAP Animation Refs
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const cardsGridRef = useRef(null);

  const fetchNegotiations = async () => {
    try {
      setLoading(true);
      setError("");

      let data;

      if (user?.role === "WASTE_GENERATOR") {
        data = await getGeneratorNegotiations();
      } else if (user?.role === "FACILITY") {
        data = await getFacilityNegotiations();
      } else {
        setNegotiations([]);
        return;
      }

      setNegotiations(data.negotiations || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch negotiations. Please try again."
      );
    } font-sans finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role) {
      fetchNegotiations();
    }
  }, [user?.role]);

  // GSAP Stagger Entrance Effect
  useEffect(() => {
    if (!loading && !error) {
      const ctx = gsap.context(() => {
        // Header Reveal
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: -15 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
        );

        // Staggered Cards Reveal
        if (cardsGridRef.current?.children) {
          gsap.fromTo(
            cardsGridRef.current.children,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.08,
              ease: "power2.out",
              delay: 0.1,
            }
          );
        }
      }, containerRef);

      return () => ctx.revert();
    }
  }, [loading, error, negotiations, activeTab]);

  // Filter Negotiations by Tab
  const filteredNegotiations = negotiations.filter((item) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "PENDING") return item.status === "PENDING" || item.status === "COUNTERED";
    if (activeTab === "ACCEPTED") return item.status === "ACCEPTED";
    if (activeTab === "REJECTED") return item.status === "REJECTED" || item.status === "CANCELLED";
    return true;
  });

  // Loading State UI
  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-[#422D0B]">
        <div className="w-10 h-10 border-4 border-[#E8DDCB] border-t-[#FFA800] rounded-full animate-spin mb-3" />
        <p className="text-xs font-extrabold uppercase tracking-widest text-[#967A53] animate-pulse">
          Loading Active Negotiations...
        </p>
      </div>
    );
  }

  // Error State UI
  if (error) {
    return (
      <div className="bg-white border border-red-200 rounded-2xl p-6 text-center space-y-4 shadow-xs my-4">
        <div className="w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto font-black text-sm">
          ✕
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-extrabold text-red-900">
            Error Loading Negotiations
          </h3>
          <p className="text-xs text-[#967A53]">{error}</p>
        </div>
        <button
          type="button"
          onClick={fetchNegotiations}
          className="px-4 py-2 bg-[#FFA800] hover:bg-[#FFC24A] text-[#422D0B] font-extrabold text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="space-y-6 font-['Montserrat',sans-serif] text-[#422D0B]"
    >
      {/* Top Header & Filter Controls */}
      <div
        ref={headerRef}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDCB] pb-4"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FFA800]" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#967A53]">
              Deals & Offers
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#422D0B] tracking-tight mt-0.5">
            Negotiations
          </h2>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center bg-[#FFFBF5] border border-[#E8DDCB] p-1 rounded-xl self-start sm:self-auto overflow-x-auto">
          {[
            { key: "ALL", label: "All" },
            { key: "PENDING", label: "Active" },
            { key: "ACCEPTED", label: "Accepted" },
            { key: "REJECTED", label: "Closed" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-white text-[#422D0B] shadow-xs border border-[#E8DDCB]"
                  : "text-[#967A53] hover:text-[#422D0B]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {filteredNegotiations.length === 0 ? (
        <div className="bg-white border border-[#E8DDCB] rounded-2xl p-8 sm:p-12 text-center space-y-3 relative overflow-hidden">
          <div className="w-14 h-14 bg-[#FFFBF5] border border-[#E8DDCB] text-[#FFA800] rounded-2xl flex items-center justify-center mx-auto text-xl shadow-xs">
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
              />
            </svg>
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-[#422D0B]">
              No Negotiations Found
            </h3>
            <p className="text-xs text-[#967A53] max-w-sm mx-auto leading-relaxed">
              {activeTab === "ALL"
                ? "There are currently no active negotiations or deal offers linked to your account."
                : `No negotiations matching the "${activeTab.toLowerCase()}" filter.`}
            </p>
          </div>
          {activeTab !== "ALL" && (
            <button
              type="button"
              onClick={() => setActiveTab("ALL")}
              className="text-xs font-extrabold text-[#FFA800] hover:underline pt-2 inline-block cursor-pointer"
            >
              Clear Filter
            </button>
          )}
        </div>
      ) : (
        /* Negotiations List Grid */
        <div ref={cardsGridRef} className="grid grid-cols-1 gap-4">
          {filteredNegotiations.map((negotiation) => (
            <NegotiationCard
              key={negotiation._id}
              negotiation={negotiation}
              onUpdate={fetchNegotiations}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NegotiationList;