import { useEffect, useRef } from "react";
import gsap from "gsap";

const NegotiationStatus = ({ status, agreedPrice }) => {
  const cardRef = useRef(null);

  // GSAP Entrance Animation on Status Change
  useEffect(() => {
    if (cardRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, y: 10, scale: 0.99 },
          { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power2.out" }
        );
      }, cardRef);

      return () => ctx.revert();
    }
  }, [status, agreedPrice]);

  // Status Style Configurations
  const statusConfig = {
    ACTIVE: {
      label: "Negotiation Active",
      description: "Negotiation is currently in progress. Pending offers or counter-proposals.",
      badgeBg: "bg-[#FFA800]/15 text-[#422D0B] border-[#FFA800]/40",
      dotBg: "bg-[#FFA800] animate-pulse",
      iconPath:
        "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    ACCEPTED: {
      label: "Deal Accepted",
      description: "The negotiation has been successfully finalized and locked.",
      badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-300",
      dotBg: "bg-emerald-500",
      iconPath: "M5 13l4 4L19 7",
    },
    REJECTED: {
      label: "Negotiation Rejected",
      description: "The counterparty or initiator has rejected the proposed terms.",
      badgeBg: "bg-rose-50 text-rose-800 border-rose-300",
      dotBg: "bg-rose-500",
      iconPath: "M6 18L18 6M6 6l12 12",
    },
    CANCELLED: {
      label: "Negotiation Cancelled",
      description: "This deal thread was withdrawn prior to completion.",
      badgeBg: "bg-stone-100 text-stone-700 border-stone-300",
      dotBg: "bg-stone-400",
      iconPath:
        "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636",
    },
    EXPIRED: {
      label: "Negotiation Expired",
      description: "The validity window for this negotiation thread has elapsed.",
      badgeBg: "bg-amber-50 text-amber-800 border-amber-300",
      dotBg: "bg-amber-500",
      iconPath:
        "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
  };

  const currentConfig = statusConfig[status] || {
    label: status,
    description: "Status updated.",
    badgeBg: "bg-gray-100 text-gray-800 border-gray-300",
    dotBg: "bg-gray-400",
    iconPath: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  };

  return (
    <div
      ref={cardRef}
      className="bg-white border border-[#E8DDCB] hover:border-[#FFA800]/50 rounded-2xl p-6 sm:p-8 shadow-xs font-['Montserrat',sans-serif] text-[#422D0B] space-y-4 transition-all duration-300 relative overflow-hidden"
    >
      {/* Header & Status Badge */}
      <div className="flex items-center justify-between gap-3 border-b border-[#E8DDCB] pb-4">
        <div className="space-y-0.5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#967A53]">
            Current State
          </span>
          <h3 className="text-lg font-black text-[#422D0B] tracking-tight">
            Negotiation Status
          </h3>
        </div>

        {/* Dynamic Status Pill */}
        <div
          className={`px-3 py-1.5 border rounded-full text-xs font-extrabold flex items-center gap-2 shadow-2xs ${currentConfig.badgeBg}`}
        >
          <span className={`w-2 h-2 rounded-full ${currentConfig.dotBg}`} />
          <span>{currentConfig.label}</span>
        </div>
      </div>

      {/* Main Status Message / Agreed Price Banner */}
      {status === "ACCEPTED" ? (
        <div className="bg-[#FFFBF5] border border-[#FFA800]/40 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#967A53]">
              Agreed Settlement
            </span>
            <p className="text-xs font-bold text-[#422D0B]">
              Deal successfully finalized
            </p>
          </div>
          <div className="text-right">
            <span className="text-lg sm:text-xl font-black text-[#FFA800]">
              ₹{agreedPrice?.toLocaleString() ?? "0"}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 bg-[#FFFBF5] border border-[#E8DDCB]/60 rounded-xl p-3.5 text-xs text-[#967A53] font-semibold">
          <svg
            className="w-4 h-4 text-[#422D0B] shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={currentConfig.iconPath}
            />
          </svg>
          <p>{currentConfig.description}</p>
        </div>
      )}
    </div>
  );
};

export default NegotiationStatus;