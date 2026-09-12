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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role) {
      fetchNegotiations();
    }
  }, [user?.role]);

  // GSAP Animation
  useEffect(() => {
    if (!loading && !error) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: -15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          }
        );

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

  // Filter Negotiations
  const filteredNegotiations = negotiations.filter((item) => {
    if (activeTab === "ALL") {
      return true;
    }

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

  // Loading State
  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-[#162925] font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="w-10 h-10 border-4 border-[#E1E6DE] border-t-[#143B36] rounded-full animate-spin mb-3" />

        <p className="text-xs font-extrabold uppercase tracking-widest text-[#6B7D76] animate-pulse">
          Loading Active Negotiations...
        </p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="bg-[#FAFBF9] border border-[#F8D7DA] rounded-2xl p-6 text-center space-y-4 shadow-sm my-4 font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="w-10 h-10 bg-[#FDF2F2] text-[#A94442] rounded-full flex items-center justify-center mx-auto font-black text-sm">
          ✕
        </div>

        <div className="space-y-1">
          <h3 className="text-sm font-extrabold text-[#A94442]">
            Error Loading Negotiations
          </h3>

          <p className="text-xs text-[#6B7D76]">{error}</p>
        </div>

        <button
          type="button"
          onClick={fetchNegotiations}
          className="px-4 py-2 bg-[#143B36] hover:bg-[#0E2C28] text-[#FAFBF9] font-extrabold text-xs rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif] text-[#162925]"
    >
      {/* Header */}
      <div
        ref={headerRef}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E1E6DE] pb-4"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#143B36]" />

            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#6B7D76]">
              Deals & Offers
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#162925] tracking-tight mt-0.5">
            Negotiations
          </h2>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center bg-[#F4F6F0] border border-[#E1E6DE] p-1 rounded-xl self-start sm:self-auto overflow-x-auto">
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
                  ? "bg-[#FAFBF9] text-[#143B36] shadow-sm border border-[#E1E6DE]"
                  : "text-[#6B7D76] hover:text-[#162925]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State / List */}
      {filteredNegotiations.length === 0 ? (
        <div className="bg-[#FAFBF9] border border-[#E1E6DE] rounded-2xl p-8 sm:p-12 text-center space-y-3 relative overflow-hidden shadow-sm">
          <div className="w-14 h-14 bg-[#F4F6F0] border border-[#E1E6DE] text-[#143B36] rounded-2xl flex items-center justify-center mx-auto text-xl shadow-sm">
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
            <h3 className="text-base font-extrabold text-[#162925]">
              No Negotiations Found
            </h3>

            <p className="text-xs text-[#6B7D76] max-w-sm mx-auto leading-relaxed">
              {activeTab === "ALL"
                ? "There are currently no active negotiations or deal offers linked to your account."
                : `No negotiations matching the "${activeTab.toLowerCase()}" filter.`}
            </p>
          </div>

          {activeTab !== "ALL" && (
            <button
              type="button"
              onClick={() => setActiveTab("ALL")}
              className="text-xs font-extrabold text-[#143B36] hover:text-[#204E4A] hover:underline pt-2 inline-block cursor-pointer"
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