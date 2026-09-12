import { useEffect, useRef } from "react";
import gsap from "gsap";

const FacilityStatus = ({
  operationalStatus,
  verificationStatus
}) => {
  const containerRef = useRef(null);
  const badgeSectionRef = useRef(null);
  const calloutRef = useRef(null);

  const operationalLabels = {
    ACTIVE: "Active",
    FULL: "At Full Capacity",
    TEMPORARILY_CLOSED: "Temporarily Closed",
    INACTIVE: "Inactive"
  };

  const verificationLabels = {
    PENDING: "Verification Pending",
    VERIFIED: "Verified",
    REJECTED: "Verification Rejected"
  };

  // Status Styling Configuration
  const getOperationalStyle = (status) => {
    switch (status) {
      case "ACTIVE":
        return {
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          text: "text-emerald-900",
          dot: "bg-emerald-500",
        };
      case "FULL":
        return {
          bg: "bg-amber-50",
          border: "border-amber-200",
          text: "text-amber-900",
          dot: "bg-amber-500",
        };
      case "TEMPORARILY_CLOSED":
      case "INACTIVE":
        return {
          bg: "bg-orange-50",
          border: "border-orange-200",
          text: "text-orange-900",
          dot: "bg-orange-500",
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-800",
          dot: "bg-gray-400",
        };
    }
  };

  const getVerificationStyle = (status) => {
    switch (status) {
      case "VERIFIED":
        return {
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          text: "text-emerald-800",
          icon: "✓",
        };
      case "PENDING":
        return {
          bg: "bg-[#FFFBF5]",
          border: "border-[#E8DDCB]",
          text: "text-[#967A53]",
          icon: "⏳",
        };
      case "REJECTED":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-800",
          icon: "✕",
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-700",
          icon: "•",
        };
    }
  };

  // GSAP Reveal Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        badgeSectionRef.current?.children,
        { opacity: 0, scale: 0.9, y: 10 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.1,
          ease: "back.out(1.5)",
        }
      );

      if (calloutRef.current) {
        gsap.fromTo(
          calloutRef.current,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, delay: 0.2, ease: "power2.out" }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [operationalStatus, verificationStatus]);

  const opStyle = getOperationalStyle(operationalStatus);
  const verStyle = getVerificationStyle(verificationStatus);

  return (
    <div
      ref={containerRef}
      className="bg-white border border-[#E8DDCB] rounded-2xl p-5 shadow-sm font-['Montserrat',sans-serif] text-[#422D0B] space-y-4"
    >
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-[#E8DDCB]/60 pb-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#967A53] flex items-center gap-2">
          <svg
            className="w-4 h-4 text-[#FFA800]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Facility Operational Status
        </h3>
      </div>

      {/* Badges Grid */}
      <div ref={badgeSectionRef} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Operational Status Card */}
        <div
          className={`p-3.5 rounded-xl border ${opStyle.bg} ${opStyle.border} flex items-center justify-between transition-all`}
        >
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-[#967A53] block uppercase tracking-wider">
              Operational Status
            </span>
            <span className={`text-xs font-extrabold ${opStyle.text}`}>
              {operationalLabels[operationalStatus] ||
                operationalStatus ||
                "Unknown"}
            </span>
          </div>
          <span className="relative flex h-3 w-3">
            {operationalStatus === "ACTIVE" && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${opStyle.dot}`}
            />
          </span>
        </div>

        {/* Verification Status Card */}
        <div
          className={`p-3.5 rounded-xl border ${verStyle.bg} ${verStyle.border} flex items-center justify-between transition-all`}
        >
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-[#967A53] block uppercase tracking-wider">
              Verification Status
            </span>
            <span className={`text-xs font-extrabold ${verStyle.text}`}>
              {verificationLabels[verificationStatus] ||
                verificationStatus ||
                "Unknown"}
            </span>
          </div>
          <span className={`text-xs font-extrabold px-2 py-0.5 rounded-md border ${verStyle.border} ${verStyle.text}`}>
            {verStyle.icon}
          </span>
        </div>
      </div>

      {/* Dynamic Descriptive Banner */}
      {operationalStatus === "ACTIVE" && verificationStatus === "VERIFIED" && (
        <div
          ref={calloutRef}
          className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-semibold flex items-center gap-2.5"
        >
          <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xs shrink-0">
            ✓
          </div>
          <p>Facility is active and fully verified to process biomass materials.</p>
        </div>
      )}

      {operationalStatus === "FULL" && (
        <div
          ref={calloutRef}
          className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-semibold flex items-center gap-2.5"
        >
          <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-black text-xs shrink-0">
            !
          </div>
          <p>Facility has reached its maximum current processing capacity.</p>
        </div>
      )}

      {operationalStatus === "TEMPORARILY_CLOSED" && (
        <div
          ref={calloutRef}
          className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-xs text-orange-900 font-semibold flex items-center gap-2.5"
        >
          <div className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-black text-xs shrink-0">
            !
          </div>
          <p>Facility is temporarily unavailable for new waste intake.</p>
        </div>
      )}

      {verificationStatus === "PENDING" && (
        <div
          ref={calloutRef}
          className="p-3 bg-[#FFFBF5] border border-[#E8DDCB] rounded-xl text-xs text-[#422D0B] font-medium flex items-center gap-2.5"
        >
          <div className="w-5 h-5 rounded-full bg-[#FFA800]/20 text-[#422D0B] flex items-center justify-center font-black text-xs shrink-0">
            ⏳
          </div>
          <p>Facility verification is currently under review by compliance managers.</p>
        </div>
      )}

      {verificationStatus === "REJECTED" && (
        <div
          ref={calloutRef}
          className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 font-semibold flex items-center gap-2.5"
        >
          <div className="w-5 h-5 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-black text-xs shrink-0">
            ✕
          </div>
          <p>Facility verification was rejected. Please review documentation and re-submit.</p>
        </div>
      )}
    </div>
  );
};

export default FacilityStatus;