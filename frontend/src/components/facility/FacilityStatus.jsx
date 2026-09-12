import { useEffect, useRef } from "react";
import gsap from "gsap";

const FacilityStatus = ({
  operationalStatus = "ACTIVE",
  verificationStatus = "VERIFIED",
  lastAuditDate = "2026-03-10",
  complianceScore = "98.4%",
  onActionClick
}) => {
  const containerRef = useRef(null);
  const badgeSectionRef = useRef(null);
  const calloutRef = useRef(null);
  const metricsRef = useRef(null);

  const operationalLabels = {
    ACTIVE: "Active Node",
    FULL: "At Maximum Capacity",
    TEMPORARILY_CLOSED: "Maintenance Offline",
    INACTIVE: "Decommissioned"
  };

  const verificationLabels = {
    PENDING: "Audit Pending",
    VERIFIED: "Verified Node",
    REJECTED: "Audit Rejected"
  };

  // Status Styling Configuration for Dark Forest Palette
  const getOperationalStyle = (status) => {
    switch (status) {
      case "ACTIVE":
        return {
          bg: "bg-[#022C22]/80",
          border: "border-[#10B981]/40",
          text: "text-[#34D399]",
          dot: "bg-[#10B981]",
          glow: "rgba(16, 185, 129, 0.2)"
        };
      case "FULL":
        return {
          bg: "bg-[#12221A]",
          border: "border-[#D97706]/40",
          text: "text-[#F59E0B]",
          dot: "bg-[#F59E0B]",
          glow: "rgba(245, 158, 11, 0.2)"
        };
      case "TEMPORARILY_CLOSED":
      case "INACTIVE":
        return {
          bg: "bg-[#12221A]",
          border: "border-red-500/40",
          text: "text-red-400",
          dot: "bg-red-500",
          glow: "rgba(239, 68, 68, 0.2)"
        };
      default:
        return {
          bg: "bg-[#0B1610]",
          border: "border-[rgba(16,185,129,0.15)]",
          text: "text-[#A7F3D0]",
          dot: "bg-[#047857]",
          glow: "transparent"
        };
    }
  };

  const getVerificationStyle = (status) => {
    switch (status) {
      case "VERIFIED":
        return {
          bg: "bg-[#022C22]/80",
          border: "border-[#10B981]/40",
          text: "text-[#34D399]",
          icon: "✓",
          badgeBg: "bg-[#10B981]/10"
        };
      case "PENDING":
        return {
          bg: "bg-[#12221A]",
          border: "border-[#D97706]/40",
          text: "text-[#F59E0B]",
          icon: "⏳",
          badgeBg: "bg-[#D97706]/10"
        };
      case "REJECTED":
        return {
          bg: "bg-red-950/30",
          border: "border-red-500/40",
          text: "text-red-400",
          icon: "✕",
          badgeBg: "bg-red-500/10"
        };
      default:
        return {
          bg: "bg-[#0B1610]",
          border: "border-[rgba(16,185,129,0.15)]",
          text: "text-[#A7F3D0]",
          icon: "•",
          badgeBg: "bg-[#0B1610]"
        };
    }
  };

  // GSAP Reveal Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        badgeSectionRef.current?.children,
        { opacity: 0, scale: 0.95, y: 12 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
        }
      );

      if (metricsRef.current) {
        gsap.fromTo(
          metricsRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.6, delay: 0.15, ease: "power3.out" }
        );
      }

      if (calloutRef.current) {
        gsap.fromTo(
          calloutRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.6, delay: 0.25, ease: "power3.out" }
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
      className="bg-[#12221A] border border-[rgba(16,185,129,0.15)] rounded-2xl p-5 shadow-[0_4px_12px_-2px_rgba(2,44,34,0.5)] font-['Montserrat',sans-serif] text-[#ECFDF5] space-y-4 backdrop-blur-md"
    >
      {/* Title Header */}
      <div className="flex items-center justify-between border-b border-[rgba(16,185,129,0.15)] pb-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#A7F3D0] flex items-center gap-2 font-['Fira_Code',monospace]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]" />
          </span>
          Hub Operational Protocol
        </h3>
        <span className="text-[10px] font-bold text-[#047857] font-['Fira_Code',monospace]">
          ID: CC-NODE-{Math.floor(1000 + Math.random() * 9000)}
        </span>
      </div>

      {/* Badges Grid */}
      <div ref={badgeSectionRef} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Operational Status Card */}
        <div
          className={`p-3.5 rounded-xl border ${opStyle.bg} ${opStyle.border} flex items-center justify-between transition-all shadow-inner`}
        >
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-[#047857] block uppercase tracking-wider font-['Fira_Code',monospace]">
              Operational State
            </span>
            <span className={`text-xs font-black ${opStyle.text}`}>
              {operationalLabels[operationalStatus] || operationalStatus || "Unknown"}
            </span>
          </div>
          <span className="relative flex h-3 w-3">
            {operationalStatus === "ACTIVE" && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-75" />
            )}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${opStyle.dot}`} />
          </span>
        </div>

        {/* Verification Status Card */}
        <div
          className={`p-3.5 rounded-xl border ${verStyle.bg} ${verStyle.border} flex items-center justify-between transition-all shadow-inner`}
        >
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-[#047857] block uppercase tracking-wider font-['Fira_Code',monospace]">
              Verification Audit
            </span>
            <span className={`text-xs font-black ${verStyle.text}`}>
              {verificationLabels[verificationStatus] || verificationStatus || "Unknown"}
            </span>
          </div>
          <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg border ${verStyle.border} ${verStyle.text} ${verStyle.badgeBg} font-['Fira_Code',monospace]`}>
            {verStyle.icon}
          </span>
        </div>
      </div>

      {/* Telemetry Secondary Info Banner */}
      <div
        ref={metricsRef}
        className="grid grid-cols-2 gap-2 bg-[#0B1610] p-3 rounded-xl border border-[rgba(16,185,129,0.15)] text-xs font-['Fira_Code',monospace]"
      >
        <div>
          <span className="text-[9px] font-bold text-[#047857] block uppercase tracking-wider">
            Last Audit Cycle
          </span>
          <span className="font-bold text-[#A7F3D0] text-[11px]">{lastAuditDate}</span>
        </div>
        <div>
          <span className="text-[9px] font-bold text-[#047857] block uppercase tracking-wider">
            Ecosystem Score
          </span>
          <span className="font-bold text-[#34D399] text-[11px]">{complianceScore}</span>
        </div>
      </div>

      {/* Dynamic Descriptive Banners */}
      {operationalStatus === "ACTIVE" && verificationStatus === "VERIFIED" && (
        <div
          ref={calloutRef}
          className="p-3 bg-[#022C22]/60 border border-[#10B981]/30 rounded-xl text-xs text-[#ECFDF5] font-medium flex items-center justify-between gap-2.5"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-md bg-[#10B981]/20 border border-[#10B981]/40 text-[#34D399] flex items-center justify-center font-black text-xs shrink-0">
              ✓
            </div>
            <p className="text-[11px]">
              Facility is verified and accepting bio-material routing.
            </p>
          </div>
          {onActionClick && (
            <button
              onClick={onActionClick}
              className="text-[10px] font-bold text-[#D97706] hover:text-[#F59E0B] underline font-['Fira_Code',monospace] shrink-0"
            >
              View Route Plan
            </button>
          )}
        </div>
      )}

      {operationalStatus === "FULL" && (
        <div
          ref={calloutRef}
          className="p-3 bg-[#12221A] border border-[#D97706]/40 rounded-xl text-xs text-[#ECFDF5] font-medium flex items-center gap-2.5"
        >
          <div className="w-5 h-5 rounded-md bg-[#D97706]/20 border border-[#D97706]/40 text-[#F59E0B] flex items-center justify-center font-black text-xs shrink-0 font-['Fira_Code',monospace]">
            !
          </div>
          <p className="text-[11px]">
            Capacity threshold met. Intake queues are held until next dispatch cycle.
          </p>
        </div>
      )}

      {operationalStatus === "TEMPORARILY_CLOSED" && (
        <div
          ref={calloutRef}
          className="p-3 bg-red-950/20 border border-red-500/30 rounded-xl text-xs text-[#ECFDF5] font-medium flex items-center gap-2.5"
        >
          <div className="w-5 h-5 rounded-md bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center font-black text-xs shrink-0 font-['Fira_Code',monospace]">
            !
          </div>
          <p className="text-[11px]">
            Offline for scheduled operational maintenance.
          </p>
        </div>
      )}

      {verificationStatus === "PENDING" && (
        <div
          ref={calloutRef}
          className="p-3 bg-[#0B1610] border border-[#D97706]/30 rounded-xl text-xs text-[#ECFDF5] font-medium flex items-center gap-2.5"
        >
          <div className="w-5 h-5 rounded-md bg-[#D97706]/20 text-[#F59E0B] flex items-center justify-center font-black text-xs shrink-0 font-['Fira_Code',monospace]">
            ⏳
          </div>
          <p className="text-[11px]">
            Verification under compliance review. Secondary verification pending.
          </p>
        </div>
      )}

      {verificationStatus === "REJECTED" && (
        <div
          ref={calloutRef}
          className="p-3 bg-red-950/30 border border-red-500/40 rounded-xl text-xs text-red-200 font-medium flex items-center justify-between gap-2.5"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-md bg-red-500/20 text-red-400 flex items-center justify-center font-black text-xs shrink-0 font-['Fira_Code',monospace]">
              ✕
            </div>
            <p className="text-[11px]">
              Audit failed. Compliance requirements not met.
            </p>
          </div>
          {onActionClick && (
            <button
              onClick={onActionClick}
              className="text-[10px] font-bold text-red-400 hover:text-red-300 underline font-['Fira_Code',monospace] shrink-0"
            >
              Re-submit
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FacilityStatus;