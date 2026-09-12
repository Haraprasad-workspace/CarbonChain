import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { acceptMatch, rejectMatch } from "../../services/facilityService";

const MatchCard = ({ match, onUpdate }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const scoreBadgeRef = useRef(null);
  const [loadingAction, setLoadingAction] = useState(null); // 'accept' | 'reject' | null

  const facility = match?.facility;

  // GSAP Entrance & Score Pulse Effect
  useEffect(() => {
    if (scoreBadgeRef.current) {
      gsap.fromTo(
        scoreBadgeRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)", delay: 0.1 }
      );
    }
  }, []);

  // Card Hover Animations
  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      y: -6,
      boxShadow: "0 12px 28px -10px rgba(66, 45, 11, 0.12)",
      borderColor: "#FFA800",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
      borderColor: "#E8DDCB",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  // GSAP Animated Accept
  const handleAccept = async () => {
    try {
      setLoadingAction("accept");

      await acceptMatch(match._id);

      // Success scale-out animation
      await gsap.to(cardRef.current, {
        scale: 0.95,
        opacity: 0.5,
        duration: 0.3,
        ease: "power2.inOut",
      });

      onUpdate();
    } catch (error) {
      gsap.to(cardRef.current, { scale: 1, opacity: 1, duration: 0.2 });
      alert(
        error.response?.data?.message ||
          "Failed to accept match. Please try again."
      );
    } font-sans {
      setLoadingAction(null);
    }
  };

  // GSAP Animated Reject
  const handleReject = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to decline this facility match recommendation?"
    );
    if (!confirmed) return;

    try {
      setLoadingAction("reject");

      // Reject slide-out animation
      await gsap.to(cardRef.current, {
        x: -20,
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
      });

      await rejectMatch(match._id);
      onUpdate();
    } catch (error) {
      gsap.to(cardRef.current, { x: 0, opacity: 1, duration: 0.2 });
      alert(
        error.response?.data?.message ||
          "Failed to reject match. Please try again."
      );
    } finally {
      setLoadingAction(null);
    }
  };

  // Match Status Badge Helper
  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case "ACCEPTED":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "REJECTED":
        return "bg-red-50 text-red-800 border-red-200";
      case "SUGGESTED":
      case "PENDING":
        return "bg-amber-50 text-amber-900 border-amber-200";
      default:
        return "bg-[#FFFBF5] text-[#967A53] border-[#E8DDCB]";
    }
  };

  // Match Score Color Coding
  const getScoreColor = (score) => {
    if (score >= 80) return "bg-emerald-50 text-emerald-900 border-emerald-300";
    if (score >= 60) return "bg-amber-50 text-amber-900 border-amber-300";
    return "bg-orange-50 text-orange-900 border-orange-300";
  };

  if (!facility) {
    return (
      <div className="bg-white border border-[#E8DDCB] rounded-2xl p-6 font-['Montserrat',sans-serif] text-center space-y-2">
        <p className="text-xs font-bold text-[#967A53]">
          Facility details unavailable for this match.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="bg-white border border-[#E8DDCB] rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-5 transition-colors font-['Montserrat',sans-serif] text-[#422D0B] relative overflow-hidden"
    >
      {/* Decorative Accent Background Glow */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-[#FFA800]/5 rounded-bl-full pointer-events-none" />

      {/* Header & Match Score Badge */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#967A53]">
              {facility.facilityType || "PROCESSING FACILITY"}
            </span>
            <h3 className="text-base font-extrabold text-[#422D0B] leading-snug line-clamp-2">
              {facility.facilityName}
            </h3>
          </div>

          {/* Match Score Badge */}
          <div
            ref={scoreBadgeRef}
            className={`px-3 py-1.5 rounded-xl border flex flex-col items-center justify-center shrink-0 shadow-xs ${getScoreColor(
              match.matchScore
            )}`}
          >
            <span className="text-[9px] font-extrabold uppercase tracking-wider opacity-75">
              Match
            </span>
            <span className="text-xs font-black leading-none">
              {match.matchScore}%
            </span>
          </div>
        </div>

        {/* Status Tag */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[11px] font-bold text-[#967A53]">Status:</span>
          <span
            className={`px-2.5 py-0.5 border text-[10px] font-extrabold rounded-md uppercase tracking-wider ${getStatusBadge(
              match.status
            )}`}
          >
            {match.status}
          </span>
        </div>
      </div>

      {/* Match Specifications Grid */}
      <div className="space-y-2.5 pt-3 border-t border-[#E8DDCB]/60 text-xs">
        {/* Distance */}
        <div className="flex items-center justify-between">
          <span className="text-[#967A53] font-medium flex items-center gap-1.5">
            <svg
              className="w-3.5 h-3.5 text-[#FFA800]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
            </svg>
            Proximity:
          </span>
          <span className="font-extrabold text-[#422D0B]">
            {match.distance !== undefined ? `${match.distance} km` : "N/A"}
          </span>
        </div>

        {/* Capacity */}
        <div className="flex items-center justify-between">
          <span className="text-[#967A53] font-medium flex items-center gap-1.5">
            <svg
              className="w-3.5 h-3.5 text-[#FFA800]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            Capacity:
          </span>
          <span className="font-bold text-[#422D0B]">
            {facility.processingCapacity?.value
              ? `${facility.processingCapacity.value} ${
                  facility.processingCapacity?.unit === "TON_PER_DAY"
                    ? "Tons/Day"
                    : facility.processingCapacity?.unit === "KG_PER_DAY"
                    ? "KG/Day"
                    : facility.processingCapacity?.unit
                }`
              : "N/A"}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center justify-between">
          <span className="text-[#967A53] font-medium flex items-center gap-1.5">
            <svg
              className="w-3.5 h-3.5 text-[#FFA800]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H9"
              />
            </svg>
            Location:
          </span>
          <span className="font-bold text-[#422D0B] truncate max-w-[140px] text-right">
            {facility.location?.city
              ? `${facility.location.city}${
                  facility.location.state ? `, ${facility.location.state}` : ""
                }`
              : "Not specified"}
          </span>
        </div>

        {/* Pricing */}
        <div className="flex items-center justify-between">
          <span className="text-[#967A53] font-medium flex items-center gap-1.5">
            <svg
              className="w-3.5 h-3.5 text-[#FFA800]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Pricing:
          </span>
          <div className="text-right">
            <span className="font-bold text-[#422D0B] uppercase">
              {facility.pricing ? facility.pricing.replace("_", " ") : "N/A"}
            </span>
            {facility.pricePerUnit !== undefined && (
              <span className="block text-[11px] font-extrabold text-[#FFA800]">
                ₹{facility.pricePerUnit} / unit
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-3 border-t border-[#E8DDCB]/60">
        <button
          type="button"
          onClick={() => navigate(`/facility/${facility._id}`)}
          className="w-full py-2.5 px-4 bg-[#FFFBF5] border border-[#E8DDCB] hover:border-[#FFA800] text-[#422D0B] font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
        >
          <span>View Facility Details</span>
          <svg className="w-3.5 h-3.5 text-[#FFA800]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>

        {match.status === "SUGGESTED" && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAccept}
              disabled={loadingAction !== null}
              className="flex-1 py-2.5 px-3 bg-[#FFA800] hover:bg-[#FFC24A] text-[#422D0B] font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              {loadingAction === "accept" ? (
                <div className="w-4 h-4 border-2 border-[#422D0B] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Accept Match</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReject}
              disabled={loadingAction !== null}
              className="py-2.5 px-3 bg-white hover:bg-red-50 text-red-600 border border-[#E8DDCB] hover:border-red-200 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1 active:scale-95 disabled:opacity-50"
            >
              {loadingAction === "reject" ? (
                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Reject</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchCard;