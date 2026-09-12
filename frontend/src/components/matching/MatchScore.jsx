import { useEffect, useRef } from "react";
import gsap from "gsap";

const MatchScore = ({ score = 0 }) => {
  const containerRef = useRef(null);
  const progressBarRef = useRef(null);
  const numberRef = useRef(null);

  // Score Configuration Helpers
  const getScoreConfig = (val) => {
    if (val >= 80) {
      return {
        label: "Excellent Match",
        color: "bg-emerald-500",
        bgLight: "bg-emerald-50",
        border: "border-emerald-200",
        textColor: "text-emerald-900",
        badgeBg: "bg-emerald-100 text-emerald-800",
      };
    }
    if (val >= 60) {
      return {
        label: "Good Match",
        color: "bg-[#FFA800]",
        bgLight: "bg-[#FFFBF5]",
        border: "border-[#E8DDCB]",
        textColor: "text-[#422D0B]",
        badgeBg: "bg-[#FFC24A]/30 text-[#422D0B]",
      };
    }
    if (val >= 40) {
      return {
        label: "Moderate Match",
        color: "bg-amber-500",
        bgLight: "bg-amber-50",
        border: "border-amber-200",
        textColor: "text-amber-900",
        badgeBg: "bg-amber-100 text-amber-800",
      };
    }
    return {
      label: "Low Match",
      color: "bg-orange-500",
      bgLight: "bg-orange-50",
      border: "border-orange-200",
      textColor: "text-orange-900",
      badgeBg: "bg-orange-100 text-orange-800",
    };
  };

  const config = getScoreConfig(score);

  // GSAP Fill Bar & Counter Animation
  useEffect(() => {
    const clampedScore = Math.min(Math.max(score, 0), 100);

    const ctx = gsap.context(() => {
      // Progress Bar Anim
      if (progressBarRef.current) {
        gsap.fromTo(
          progressBarRef.current,
          { width: "0%" },
          {
            width: `${clampedScore}%`,
            duration: 1.2,
            ease: "power2.out",
          }
        );
      }

      // Animated Number Counter
      const counter = { val: 0 };
      if (numberRef.current) {
        gsap.to(counter, {
          val: clampedScore,
          duration: 1.2,
          ease: "power2.out",
          onUpdate: () => {
            if (numberRef.current) {
              numberRef.current.innerText = Math.round(counter.val);
            }
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [score]);

  return (
    <div
      ref={containerRef}
      className={`p-4 rounded-2xl border ${config.border} ${config.bgLight} font-['Montserrat',sans-serif] shadow-xs space-y-3 transition-colors`}
    >
      {/* Top Bar: Header & Score Counter */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#967A53]">
            Compatibility Index
          </span>
          <h4 className="text-xs font-extrabold text-[#422D0B]">
            Match Score
          </h4>
        </div>

        {/* Big Score Display */}
        <div className="flex items-baseline gap-0.5">
          <span
            ref={numberRef}
            className={`text-2xl font-black ${config.textColor}`}
          >
            0
          </span>
          <span className="text-xs font-bold text-[#967A53]">/100</span>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="space-y-1.5">
        <div className="w-full bg-[#E8DDCB]/50 h-2.5 rounded-full overflow-hidden p-0.5 border border-[#E8DDCB]/60">
          <div
            ref={progressBarRef}
            className={`h-full rounded-full transition-all ${config.color}`}
            style={{ width: "0%" }}
          />
        </div>

        {/* Score Quality Label Pill */}
        <div className="flex items-center justify-between text-[11px] pt-0.5">
          <span className={`px-2 py-0.5 rounded-md font-extrabold ${config.badgeBg}`}>
            {config.label}
          </span>
          <span className="font-bold text-[#967A53]">
            {score}% Fit
          </span>
        </div>
      </div>
    </div>
  );
};

export default MatchScore;