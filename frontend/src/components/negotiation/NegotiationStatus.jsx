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
      badgeBg: "bg-[#DCE9DF] text-[#1E3B30] border-[#C2E3CD]",
      dotBg: "bg-[#204E4A] animate-pulse",
      iconPath:
        "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    ACCEPTED: {
      label: "Deal Accepted",
      description: "The negotiation has been successfully finalized and locked.",
      badgeBg: "bg-[#D8EEDF] text-[#1E5E38] border-[#C2E3CD]",
      dotBg: "bg-[#2E7D32]",
      iconPath: "M5 13l4 4L19 7",
    },
    REJECTED: {
      label: "Negotiation Rejected",
      description: "The counterparty or initiator has rejected the proposed terms.",
      badgeBg: "bg-[#FDF2F2] text-[#A94442] border-[#F8D7DA]",
      dotBg: "bg-[#A94442]",
      iconPath: "M6 18L18 6M6 6l12 12",
    },
    CANCELLED: {
      label: "Negotiation Cancelled",
      description: "This deal thread was withdrawn prior to completion.",
      badgeBg: "bg-[#F4F6F0] text-[#6B7D76] border-[#E1E6DE]",
      dotBg: "bg-[#94A39D]",
      iconPath:
        "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636",
    },
    EXPIRED: {
      label: "Negotiation Expired",
      description: "The validity window for this negotiation thread has elapsed.",
      badgeBg: "bg-[#FDEED9] text-[#875218] border-[#F5DCBE]",
      dotBg: "bg-[#D4A373]",
      iconPath:
        "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
  };

  const currentConfig = statusConfig[status] || {
    label: status,
    description: "Status updated.",
    badgeBg: "bg-[#F4F6F0] text-[#162925] border-[#E1E6DE]",
    dotBg: "bg-[#6B7D76]",
    iconPath: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  };

  return (
    <div
      ref={cardRef}
      className="bg-[#FAFBF9] border border-[#E1E6DE] hover:border-[#73A892] rounded-2xl p-6 sm:p-8 shadow-sm font-['Plus_Jakarta_Sans',sans-serif] text-[#162925] space-y-4 transition-all duration-300 relative overflow-hidden"
    >
      {/* Header & Status Badge */}
      <div className="flex items-center justify-between gap-3 border-b border-[#E1E6DE] pb-4">
        <div className="space-y-0.5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#6B7D76]">
            Current State
          </span>
          <h3 className="text-lg font-black text-[#162925] tracking-tight">
            Negotiation Status
          </h3>
        </div>

        {/* Dynamic Status Pill */}
        <div
          className={`px-3 py-1.5 border rounded-full text-xs font-extrabold flex items-center gap-2 shadow-sm ${currentConfig.badgeBg}`}
        >
          <span className={`w-2 h-2 rounded-full ${currentConfig.dotBg}`} />
          <span>{currentConfig.label}</span>
        </div>
      </div>

      {/* Main Status Message / Agreed Price Banner */}
      {status === "ACCEPTED" ? (
        <div className="bg-[#F4F6F0] border border-[#C2E3CD] rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7D76]">
              Agreed Settlement
            </span>
            <p className="text-xs font-bold text-[#162925]">
              Deal successfully finalized
            </p>
          </div>
          <div className="text-right">
            <span className="text-lg sm:text-xl font-black text-[#204E4A]">
              ₹{agreedPrice?.toLocaleString() ?? "0"}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 bg-[#F4F6F0] border border-[#E1E6DE] rounded-xl p-3.5 text-xs text-[#6B7D76] font-semibold">
          <svg
            className="w-4 h-4 text-[#162925] shrink-0 mt-0.5"
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