import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const NegotiationStatus = ({ status, agreedPrice }) => {
  const cardRef = useRef(null);
  const statusContentRef = useRef(null);
  const staticDetailsRef = useRef(null);

  // GSAP ScrollTrigger & Transition Motion
  useEffect(() => {
    if (cardRef.current) {
      const ctx = gsap.context(() => {
        // Scroll-driven entrance card reveal
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Status Banner Fade & Scale on State Change
        if (statusContentRef.current) {
          gsap.fromTo(
            statusContentRef.current,
            { opacity: 0, scale: 0.97, y: 8 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.4,
              ease: "back.out(1.5)",
              delay: 0.15,
            }
          );
        }

        // Static Info Cards Staggered Animation
        if (staticDetailsRef.current?.children) {
          gsap.fromTo(
            staticDetailsRef.current.children,
            { opacity: 0, y: 10 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.08,
              ease: "power2.out",
              delay: 0.25,
            }
          );
        }
      }, cardRef);

      return () => ctx.revert();
    }
  }, [status, agreedPrice]);

  // Dark Forest Green Theme Status Configurations
  const statusConfig = {
    ACTIVE: {
      label: "Negotiation Active",
      description:
        "Negotiation is currently in progress. Counter-proposals or pending offers are awaiting review.",
      badgeBg: "bg-[#34D399]/15 text-[#34D399] border-[#34D399]/30",
      dotBg: "bg-[#34D399] animate-pulse",
      iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    ACCEPTED: {
      label: "Deal Accepted",
      description:
        "The negotiation terms have been successfully agreed upon and locked.",
      badgeBg: "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30",
      dotBg: "bg-[#10B981]",
      iconPath: "M5 13l4 4L19 7",
    },
    REJECTED: {
      label: "Negotiation Rejected",
      description:
        "The proposed terms were declined by one of the participating parties.",
      badgeBg: "bg-[#EF4444]/15 text-[#F87171] border-[#EF4444]/30",
      dotBg: "bg-[#EF4444]",
      iconPath: "M6 18L18 6M6 6l12 12",
    },
    CANCELLED: {
      label: "Negotiation Cancelled",
      description:
        "This negotiation thread was withdrawn prior to reaching a consensus.",
      badgeBg: "bg-[#132A1D] text-[#6E9B82] border-[#1B382B]",
      dotBg: "bg-[#6E9B82]",
      iconPath:
        "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636",
    },
    EXPIRED: {
      label: "Negotiation Expired",
      description:
        "The validity period for responding to this offer has elapsed.",
      badgeBg: "bg-[#F59E0B]/15 text-[#FBBF24] border-[#F59E0B]/30",
      dotBg: "bg-[#F59E0B]",
      iconPath: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
  };

  const currentConfig = statusConfig[status] || {
    label: status || "UNKNOWN",
    description: "Status updated.",
    badgeBg: "bg-[#132A1D] text-[#E2F1E7] border-[#1B382B]",
    dotBg: "bg-[#6E9B82]",
    iconPath: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  };

  return (
    <div
      ref={cardRef}
      className="bg-[#0B1A12] border border-[#1B382B] hover:border-[#10B981]/50 rounded-2xl p-6 sm:p-8 shadow-xl font-['Montserrat',sans-serif] text-[#E2F1E7] space-y-5 transition-all duration-300 relative overflow-hidden"
    >
      {/* Background Ambient Dark Green Glow */}
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#10B981]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Section */}
      <div className="flex items-center justify-between gap-3 border-b border-[#1B382B] pb-4">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#6E9B82]">
            Current State
          </span>
          <h3 className="text-lg font-black text-[#E2F1E7] tracking-tight">
            Negotiation Status
          </h3>
        </div>

        {/* Dynamic Status Badge */}
        <div
          className={`px-3 py-1.5 border rounded-full text-xs font-black flex items-center gap-2 shadow-sm ${currentConfig.badgeBg}`}
        >
          <span className={`w-2 h-2 rounded-full ${currentConfig.dotBg}`} />
          <span>{currentConfig.label}</span>
        </div>
      </div>

      {/* Dynamic Status Banner */}
      <div ref={statusContentRef}>
        {status === "ACCEPTED" ? (
          <div className="bg-[#10B981]/15 border border-[#10B981]/30 rounded-xl p-4 flex items-center justify-between gap-4 shadow-sm">
            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#10B981]">
                Agreed Settlement
              </span>
              <p className="text-xs font-bold text-[#E2F1E7]">
                Deal successfully finalized & locked
              </p>
            </div>
            <div className="text-right">
              <span className="text-xl sm:text-2xl font-black text-[#10B981]">
                ₹{agreedPrice?.toLocaleString() ?? "0"}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 bg-[#132A1D]/80 border border-[#1B382B] rounded-xl p-3.5 text-xs text-[#6E9B82] font-semibold">
            <svg
              className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5"
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
            <p className="leading-relaxed">{currentConfig.description}</p>
          </div>
        )}
      </div>

      {/* Static Info Grid */}
      <div className="pt-2 border-t border-[#1B382B] space-y-2">
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#6E9B82]">
          Protocol Parameters
        </p>

        <div ref={staticDetailsRef} className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-[#132A1D]/60 border border-[#1B382B] p-2.5 rounded-xl flex flex-col justify-between">
            <span className="text-[10px] font-bold text-[#6E9B82] uppercase">
              Thread Lock
            </span>
            <span className="font-extrabold text-[#E2F1E7]">
              {status === "ACCEPTED" || status === "REJECTED" ? "Enabled" : "Disabled"}
            </span>
          </div>

          <div className="bg-[#132A1D]/60 border border-[#1B382B] p-2.5 rounded-xl flex flex-col justify-between">
            <span className="text-[10px] font-bold text-[#6E9B82] uppercase">
              Settlement Currency
            </span>
            <span className="font-extrabold text-[#E2F1E7]">INR (₹)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NegotiationStatus;