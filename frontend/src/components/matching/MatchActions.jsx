import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { acceptMatch, rejectMatch } from "../../services/facilityService";

const MatchActions = ({ match, onUpdate }) => {
  const containerRef = useRef(null);
  const acceptBtnRef = useRef(null);
  const rejectBtnRef = useRef(null);
  const [loadingAction, setLoadingAction] = useState(null); // 'accept' | 'reject' | null

  // GSAP Smooth Entrance Animation
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
      );
    }
  }, [match?.status]);

  // Button Hover Effects configured to Dark Forest Theme
  const handleMouseEnter = (btnRef, hoverColor, borderColor) => {
    if (btnRef.current && !loadingAction) {
      gsap.to(btnRef.current, {
        scale: 1.02,
        backgroundColor: hoverColor,
        borderColor: borderColor || "transparent",
        duration: 0.2,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = (btnRef, defaultColor, borderColor) => {
    if (btnRef.current && !loadingAction) {
      gsap.to(btnRef.current, {
        scale: 1,
        backgroundColor: defaultColor,
        borderColor: borderColor || "transparent",
        duration: 0.2,
        ease: "power2.out",
      });
    }
  };

  // GSAP Animated Accept Action
  const handleAccept = async () => {
    try {
      setLoadingAction("accept");

      // Press down effect
      await gsap.to(acceptBtnRef.current, { scale: 0.95, duration: 0.1 });

      await acceptMatch(match._id);
      onUpdate();
    } catch (error) {
      gsap.to(acceptBtnRef.current, { scale: 1, duration: 0.2 });
      alert(
        error.response?.data?.message ||
          "Failed to accept facility match. Please try again."
      );
    } finally {
      setLoadingAction(null);
    }
  };

  // GSAP Animated Reject Action
  const handleReject = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to decline this facility match?"
    );
    if (!confirmed) return;

    try {
      setLoadingAction("reject");

      // Shake animation on decline
      await gsap.to(rejectBtnRef.current, {
        x: -5,
        repeat: 3,
        yoyo: true,
        duration: 0.05,
      });

      await rejectMatch(match._id);
      onUpdate();
    } catch (error) {
      gsap.to(rejectBtnRef.current, { x: 0, duration: 0.2 });
      alert(
        error.response?.data?.message ||
          "Failed to reject match. Please try again."
      );
    } finally {
      setLoadingAction(null);
    }
  };

  // Non-Interactive Status View
  if (match.status !== "SUGGESTED") {
    const isAccepted = match.status === "ACCEPTED";
    const isRejected = match.status === "REJECTED";

    return (
      <div
        ref={containerRef}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-xl border border-[rgba(16,185,129,0.15)] bg-[#0B1610] font-['Montserrat',sans-serif] text-xs gap-2"
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-extrabold text-[#047857] uppercase tracking-wider font-['Fira_Code',monospace]">
            Match Decision:
          </span>
          {match.score && (
            <span className="text-[10px] text-[#A7F3D0] font-['Fira_Code',monospace]">
              ({match.score}% Compatibility)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border font-['Fira_Code',monospace] ${
              isAccepted
                ? "bg-[#022C22] text-[#34D399] border-[#10B981]/40 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                : isRejected
                ? "bg-red-950/40 text-red-400 border-red-500/40"
                : "bg-[#12221A] text-[#F59E0B] border-[#D97706]/40"
            }`}
          >
            {match.status}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="space-y-2.5 font-['Montserrat',sans-serif] bg-[#12221A] p-3.5 rounded-2xl border border-[rgba(16,185,129,0.15)]"
    >
      {/* Match Telemetry Info */}
      <div className="flex items-center justify-between text-[10px] font-['Fira_Code',monospace] px-1">
        <span className="text-[#047857] uppercase tracking-wider font-bold">
          Ecosystem Match Suggestion
        </span>
        <span className="text-[#34D399] font-bold">
          {match.compatibilityScore || "94.2"}% Optimal Routing
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5">
        {/* Accept Button */}
        <button
          ref={acceptBtnRef}
          type="button"
          onClick={handleAccept}
          onMouseEnter={() =>
            handleMouseEnter(acceptBtnRef, "#F59E0B", "transparent")
          }
          onMouseLeave={() =>
            handleMouseLeave(acceptBtnRef, "#D97706", "transparent")
          }
          disabled={loadingAction !== null}
          className="w-full sm:flex-1 py-2.5 px-4 bg-[#D97706] text-[#ECFDF5] font-extrabold text-xs rounded-xl shadow-[0_4px_12px_-2px_rgba(2,44,34,0.5)] transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {loadingAction === "accept" ? (
            <div className="w-4 h-4 border-2 border-[#ECFDF5] border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <svg
                className="w-4 h-4 text-[#ECFDF5]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Accept Match</span>
            </>
          )}
        </button>

        {/* Reject Button */}
        <button
          ref={rejectBtnRef}
          type="button"
          onClick={handleReject}
          onMouseEnter={() =>
            handleMouseEnter(
              rejectBtnRef,
              "rgba(239, 68, 68, 0.15)",
              "rgba(239, 68, 68, 0.5)"
            )
          }
          onMouseLeave={() =>
            handleMouseLeave(
              rejectBtnRef,
              "#0B1610",
              "rgba(16, 185, 129, 0.15)"
            )
          }
          disabled={loadingAction !== null}
          className="w-full sm:w-auto py-2.5 px-4 bg-[#0B1610] text-red-400 border border-[rgba(16,185,129,0.15)] font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {loadingAction === "reject" ? (
            <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <svg
                className="w-3.5 h-3.5 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span>Reject Match</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MatchActions;