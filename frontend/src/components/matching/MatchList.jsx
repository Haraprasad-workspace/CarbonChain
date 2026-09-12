import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import MatchCard from "./MatchCard";

const MatchList = ({ wasteId }) => {
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [finding, setFinding] = useState(false);
  const [error, setError] = useState("");

  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef(null);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/matching/waste/${wasteId}/all`);

      setMatches(response.data.matches || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load facility matches."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (wasteId) {
      fetchMatches();
    }
  }, [wasteId]);

  const handleFindMatches = async () => {
    try {
      setFinding(true);
      setError("");

      const response = await api.get(`/matching/waste/${wasteId}`);

      setMatches(response.data.matches || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to find suitable facilities."
      );
    } finally {
      setFinding(false);
    }
  };

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

        if (cardsRef.current?.children?.length) {
          gsap.fromTo(
            cardsRef.current.children,
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
  }, [loading, error, matches]);

  if (loading) {
    return (
      <div className="min-h-[350px] flex flex-col items-center justify-center font-['Montserrat',sans-serif]">
        <div className="w-10 h-10 border-4 border-[#E8DDCB] border-t-[#FFA800] rounded-full animate-spin mb-4" />

        <p className="text-xs font-extrabold uppercase tracking-widest text-[#967A53]">
          Finding Suitable Facilities...
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="space-y-6 font-['Montserrat',sans-serif] text-[#422D0B]"
    >
      {/* Header */}
      <div
        ref={headerRef}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDCB] pb-4"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FFA800]" />

            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#967A53]">
              Smart Matching
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black mt-1 text-[#422D0B]">
            Recommended Facilities
          </h2>

          <p className="text-xs text-[#967A53] mt-1">
            Facilities matched based on waste type, distance and capacity.
          </p>
        </div>

        <button
          type="button"
          onClick={handleFindMatches}
          disabled={finding}
          className="px-4 py-2.5 bg-[#FFA800] hover:bg-[#FFC24A] disabled:opacity-60 text-[#422D0B] rounded-xl text-xs font-extrabold transition-all active:scale-95 cursor-pointer shadow-xs"
        >
          {finding ? "Finding..." : "Find Best Matches"}
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50/80 border border-red-200 rounded-2xl p-4">
          <p className="text-xs font-bold text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchMatches}
            className="mt-2 text-xs font-extrabold text-red-800 underline cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {matches.length === 0 ? (
        <div className="bg-[#FFFBF5] border border-[#E8DDCB] rounded-2xl p-10 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white border border-[#E8DDCB] flex items-center justify-center text-[#FFA800] shadow-xs">
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
                d="M9 20l-5-5 5-5m6-6l5 5-5 5M14 4l-4 16"
              />
            </svg>
          </div>

          <h3 className="text-base font-extrabold text-[#422D0B]">
            No Matches Found
          </h3>

          <p className="text-xs text-[#967A53] mt-2">
            No suitable facility matches are currently available.
          </p>

          <button
            type="button"
            onClick={handleFindMatches}
            disabled={finding}
            className="mt-5 px-4 py-2.5 bg-[#FFA800] hover:bg-[#FFC24A] text-[#422D0B] rounded-xl text-xs font-extrabold shadow-xs transition-all cursor-pointer"
          >
            {finding ? "Searching..." : "Search Again"}
          </button>
        </div>
      ) : (
        <>
          {/* Results Summary Bar */}
          <div className="flex items-center justify-between">
            <p className="text-xs font-extrabold text-[#967A53] uppercase tracking-wider">
              {matches.length}{" "}
              {matches.length === 1 ? "facility" : "facilities"} found
            </p>

            <button
              type="button"
              onClick={() => navigate(`/generator/waste/${wasteId}`)}
              className="text-xs font-extrabold text-[#FFA800] hover:text-[#FFC24A] hover:underline cursor-pointer"
            >
              Back to Waste
            </button>
          </div>

          {/* Match Cards List */}
          <div
            ref={cardsRef}
            className="grid grid-cols-1 gap-4"
          >
            {matches.map((match) => (
              <MatchCard
                key={match._id}
                match={match}
                onUpdate={fetchMatches}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MatchList;