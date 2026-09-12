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
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [match?.status]);

  // Button Hover Effects
  const handleMouseEnter = (btnRef, hoverColor) => {
    if (btnRef.current && !loadingAction) {
      gsap.to(btnRef.current, {
        scale: 1.02,
        backgroundColor: hoverColor,
        duration: 0.2,
        ease: "power1.out",
      });
    }
  };

  const handleMouseLeave = (btnRef, defaultColor) => {
    if (btnRef.current && !loadingAction) {
      gsap.to(btnRef.current, {
        scale: 1,
        backgroundColor: defaultColor,
        duration: 0.2,
        ease: "power1.out",
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
          "Failed to accept match. Please try again."
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
        x: -4,
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
        className="flex items-center justify-between p-3 rounded-xl border border-[#E8DDCB] bg-[#FFFBF5] font-['Montserrat',sans-serif] text-xs"
      >
        <span className="font-bold text-[#967A53]">Match Decision:</span>
        <div className="flex items-center gap-1.5">
          <span
            className={`px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider border ${
              isAccepted
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : isRejected
                ? "bg-red-50 text-red-800 border-red-200"
                : "bg-amber-50 text-amber-800 border-amber-200"
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
      className="flex flex-col sm:flex-row items-center gap-2.5 font-['Montserrat',sans-serif]"
    >
      {/* Accept Button */}
      <button
        ref={acceptBtnRef}
        type="button"
        onClick={handleAccept}
        onMouseEnter={() => handleMouseEnter(acceptBtnRef, "#FFC24A")}
        onMouseLeave={() => handleMouseLeave(acceptBtnRef, "#FFA800")}
        disabled={loadingAction !== null}
        className="w-full sm:flex-1 py-2.5 px-4 bg-[#FFA800] text-[#422D0B] font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
      >
        {loadingAction === "accept" ? (
          <div className="w-4 h-4 border-2 border-[#422D0B] border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <svg
              className="w-4 h-4 text-[#422D0B]"
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
        onMouseEnter={() => handleMouseEnter(rejectBtnRef, "#FEF2F2")}
        onMouseLeave={() => handleMouseLeave(rejectBtnRef, "#FFFFFF")}
        disabled={loadingAction !== null}
        className="w-full sm:w-auto py-2.5 px-4 bg-white text-red-600 border border-[#E8DDCB] hover:border-red-200 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50 cursor-pointer"
      >
        {loadingAction === "reject" ? (
          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <svg
              className="w-3.5 h-3.5 text-red-600"
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
  );
};

export default MatchActions;