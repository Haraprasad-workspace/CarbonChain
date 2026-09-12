import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useAuth from "../../hooks/useAuth";
import {
  getGeneratorNegotiations,
  getFacilityNegotiations,
} from "../../services/negotiationService";

import NegotiationCard from "./NegotiationCard";

gsap.registerPlugin(ScrollTrigger);

const NegotiationList = () => {
  const { user } = useAuth();

  const [negotiations, setNegotiations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");

  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const staticSummaryRef = useRef(null);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role) {
      fetchNegotiations();
    }
  }, [user?.role]);

  // Filter Calculations
  const filteredNegotiations = negotiations.filter((item) => {
    if (activeTab === "ALL") return true;

    if (activeTab === "PENDING") {
      return (
        item.status === "ACTIVE" ||
        item.status === "NEGOTIATING" ||
        item.status === "PENDING" ||
        item.status === "COUNTERED"
      );
    }

    if (activeTab === "ACCEPTED") {
      return item.status === "ACCEPTED";
    }

    if (activeTab === "REJECTED") {
      return (
        item.status === "REJECTED" ||
        item.status === "CANCELLED" ||
        item.status === "EXPIRED"
      );
    }

    return true;
  });

  // Static Overview Metrics Calculations
  const totalCount = negotiations.length;
  const activeCount = negotiations.filter((i) =>
    ["ACTIVE", "NEGOTIATING", "PENDING", "COUNTERED"].includes(i.status)
  ).length;
  const acceptedCount = negotiations.filter((i) => i.status === "ACCEPTED").length;

  // GSAP ScrollTrigger Animations
  useEffect(() => {
    if (!loading && !error) {
      const ctx = gsap.context(() => {
        // Header Reveal
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: -20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Static Summary Cards Staggered Reveal
        if (staticSummaryRef.current?.children) {
          gsap.fromTo(
            staticSummaryRef.current.children,
            { opacity: 0, y: 15 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.1,
              ease: "power2.out",
              delay: 0.2,
              scrollTrigger: {
                trigger: containerRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // Negotiation Cards Grid Staggered Scroll Reveal
        if (cardsGridRef.current?.children) {
          gsap.fromTo(
            cardsGridRef.current.children,
            { opacity: 0, y: 25 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.08,
              ease: "power2.out",
              delay: 0.3,
              scrollTrigger: {
                trigger: cardsGridRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      }, containerRef);

      return () => ctx.revert();
    }
  }, [loading, error, negotiations, activeTab]);

  // Loading State - Dark Forest Green Theme
  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-[#E2F1E7] font-['Montserrat',sans-serif]">
        <div className="w-10 h-10 border-4 border-[#1B382B] border-t-[#10B981] rounded-full animate-spin mb-4" />

        <p className="text-xs font-black uppercase tracking-widest text-[#6E9B82] animate-pulse">
          Retrieving Active Negotiations...
        </p>
      </div>
    );
  }

  // Error State - Dark Forest Green Theme
  if (error) {
    return (
      <div className="bg-[#0B1A12] border border-[#EF4444]/30 rounded-2xl p-6 text-center space-y-4 shadow-xl my-4 font-['Montserrat',sans-serif]">
        <div className="w-10 h-10 bg-[#EF4444]/15 border border-[#EF4444]/30 text-[#F87171] rounded-full flex items-center justify-center mx-auto font-black text-sm">
          ✕
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-black text-[#F87171]">
            Error Loading Negotiations
          </h3>

          <p className="text-xs text-[#6E9B82]">{error}</p>
        </div>

        <button
          type="button"
          onClick={fetchNegotiations}
          className="px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-[#0B1A12] font-black text-xs rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="space-y-6 font-['Montserrat',sans-serif] text-[#E2F1E7] relative"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#10B981]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div
        ref={headerRef}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1B382B] pb-4"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />

            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#6E9B82]">
              Deals & Offers
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#E2F1E7] tracking-tight mt-0.5">
            Negotiations Hub
          </h2>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center bg-[#132A1D] border border-[#1B382B] p-1 rounded-xl self-start sm:self-auto overflow-x-auto">
          {[
            { key: "ALL", label: "All Deals" },
            { key: "PENDING", label: "Active" },
            { key: "ACCEPTED", label: "Accepted" },
            { key: "REJECTED", label: "Closed" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-[#10B981] text-[#0B1A12] shadow-md"
                  : "text-[#6E9B82] hover:text-[#E2F1E7]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Static Overview Metric Cards */}
      <div
        ref={staticSummaryRef}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        <div className="bg-[#0B1A12] border border-[#1B382B] p-3.5 rounded-xl flex items-center justify-between">
          <span className="text-xs font-extrabold text-[#6E9B82] uppercase tracking-wider">
            Total Negotiations
          </span>
          <span className="text-base font-black text-[#E2F1E7]">
            {totalCount}
          </span>
        </div>

        <div className="bg-[#0B1A12] border border-[#1B382B] p-3.5 rounded-xl flex items-center justify-between">
          <span className="text-xs font-extrabold text-[#6E9B82] uppercase tracking-wider">
            Active Counteroffers
          </span>
          <span className="text-base font-black text-[#34D399]">
            {activeCount}
          </span>
        </div>

        <div className="bg-[#0B1A12] border border-[#1B382B] p-3.5 rounded-xl flex items-center justify-between">
          <span className="text-xs font-extrabold text-[#6E9B82] uppercase tracking-wider">
            Finalized Contracts
          </span>
          <span className="text-base font-black text-[#10B981]">
            {acceptedCount}
          </span>
        </div>
      </div>

      {/* Empty State / Cards Grid */}
      {filteredNegotiations.length === 0 ? (
        <div className="bg-[#0B1A12] border border-[#1B382B] rounded-2xl p-8 sm:p-12 text-center space-y-4 relative overflow-hidden shadow-xl">
          <div className="w-14 h-14 bg-[#132A1D] border border-[#1B382B] text-[#10B981] rounded-2xl flex items-center justify-center mx-auto text-xl shadow-sm">
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
            <h3 className="text-base font-black text-[#E2F1E7]">
              No Negotiations Found
            </h3>

            <p className="text-xs text-[#6E9B82] max-w-sm mx-auto leading-relaxed">
              {activeTab === "ALL"
                ? "There are currently no active negotiations or deal offers linked to your account."
                : `No negotiations matching the "${activeTab.toLowerCase()}" filter.`}
            </p>
          </div>

          {activeTab !== "ALL" && (
            <button
              type="button"
              onClick={() => setActiveTab("ALL")}
              className="text-xs font-extrabold text-[#10B981] hover:underline pt-2 inline-block cursor-pointer"
            >
              Clear Filter
            </button>
          )}
        </div>
      ) : (
        <div
          ref={cardsGridRef}
          className="grid grid-cols-1 gap-4"
        >
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