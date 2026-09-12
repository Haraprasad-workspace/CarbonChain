import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MatchScore = ({ score = 85 }) => {
  const containerRef = useRef(null);
  const progressBarRef = useRef(null);
  const numberRef = useRef(null);
  const staticInfosRef = useRef(null);

  // Dark Forest Green Theme Configuration Palette
  const getScoreConfig = (val) => {
    if (val >= 80) {
      return {
        label: "Optimal Compatibility",
        color: "bg-[#10B981]", // Emerald Highlight
        bgCard: "bg-[#0B1A12]", // Deep Evergreen Base
        border: "border-[#1B382B]",
        textColor: "text-[#E2F1E7]", // Light Mint Text
        subTextColor: "text-[#6E9B82]", // Muted Forest Green Text
        badgeBg: "bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30",
      };
    }
    if (val >= 60) {
      return {
        label: "Good Fit",
        color: "bg-[#34D399]", // Bright Sage
        bgCard: "bg-[#0B1A12]",
        border: "border-[#1B382B]",
        textColor: "text-[#E2F1E7]",
        subTextColor: "text-[#6E9B82]",
        badgeBg: "bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/30",
      };
    }
    if (val >= 40) {
      return {
        label: "Moderate Fit",
        color: "bg-[#F59E0B]", // Warm Amber
        bgCard: "bg-[#0B1A12]",
        border: "border-[#1B382B]",
        textColor: "text-[#E2F1E7]",
        subTextColor: "text-[#6E9B82]",
        badgeBg: "bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30",
      };
    }
    return {
      label: "Low Compatibility",
      color: "bg-[#EF4444]", // Coral Red
      bgCard: "bg-[#0B1A12]",
      border: "border-[#1B382B]",
      textColor: "text-[#E2F1E7]",
      subTextColor: "text-[#6E9B82]",
      badgeBg: "bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30",
    };
  };

  const config = getScoreConfig(score);

  // Static Details for Facility Compatibility Breakdown
  const staticMetrics = [
    { label: "Waste Type Alignment", value: "Optimal (100%)" },
    { label: "Capacity Availability", value: "High (85%)" },
    { label: "Proximity & Transit Efficiency", value: "14.2 km (78%)" },
  ];

  // GSAP ScrollTrigger Animations
  useEffect(() => {
    const clampedScore = Math.min(Math.max(score, 0), 100);

    const ctx = gsap.context(() => {
      // Container Entrance Animation
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Progress Fill Animation
      if (progressBarRef.current) {
        gsap.fromTo(
          progressBarRef.current,
          { width: "0%" },
          {
            width: `${clampedScore}%`,
            duration: 1.4,
            ease: "power3.out",
            delay: 0.2,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Animated Number Counter
      const counter = { val: 0 };
      if (numberRef.current) {
        gsap.to(counter, {
          val: clampedScore,
          duration: 1.4,
          ease: "power3.out",
          delay: 0.2,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          onUpdate: () => {
            if (numberRef.current) {
              numberRef.current.innerText = Math.round(counter.val);
            }
          },
        });
      }

      // Staggered Static Infos Entrance
      if (staticInfosRef.current?.children) {
        gsap.fromTo(
          staticInfosRef.current.children,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.4,
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [score]);

  return (
    <div
      ref={containerRef}
      className={`p-6 rounded-2xl border ${config.border} ${config.bgCard} font-['Montserrat',sans-serif] shadow-xl space-y-5 text-[#E2F1E7] relative overflow-hidden`}
    >
      {/* Decorative Dark Forest Ambient Glow */}
      <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#10B981]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-[#1B382B] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className={`text-[10px] font-extrabold uppercase tracking-widest ${config.subTextColor}`}>
              Sustainability Index
            </span>
          </div>
          <h4 className="text-sm font-black text-[#E2F1E7] tracking-wide">
            Facility Match Score
          </h4>
        </div>

        {/* Score Counter Display */}
        <div className="flex items-baseline gap-1 bg-[#132A1D] px-3.5 py-1.5 rounded-xl border border-[#1B382B]">
          <span
            ref={numberRef}
            className={`text-2xl font-black ${config.textColor}`}
          >
            0
          </span>
          <span className={`text-xs font-bold ${config.subTextColor}`}>/100</span>
        </div>
      </div>

      {/* Animated Progress Bar */}
      <div className="space-y-2">
        <div className="w-full bg-[#132A1D] h-3 rounded-full overflow-hidden p-0.5 border border-[#1B382B]">
          <div
            ref={progressBarRef}
            className={`h-full rounded-full ${config.color} transition-all`}
            style={{ width: "0%" }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] pt-1">
          <span className={`px-2.5 py-0.5 rounded-md font-black text-[10px] uppercase tracking-wider ${config.badgeBg}`}>
            {config.label}
          </span>
          <span className={`font-bold ${config.subTextColor}`}>
            {score}% Compatibility
          </span>
        </div>
      </div>

      {/* Static Info Metrics */}
      <div className="pt-2 border-t border-[#1B382B] space-y-2.5">
        <p className={`text-[10px] font-extrabold uppercase tracking-widest ${config.subTextColor}`}>
          Match Parameters
        </p>
        <div ref={staticInfosRef} className="space-y-2 text-xs">
          {staticMetrics.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 bg-[#132A1D]/70 border border-[#1B382B] rounded-xl"
            >
              <span className={`font-medium ${config.subTextColor}`}>
                {item.label}
              </span>
              <span className="font-extrabold text-[#E2F1E7]">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchScore;