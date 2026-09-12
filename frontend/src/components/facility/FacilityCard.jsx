import { useEffect, useRef } from "react";
import gsap from "gsap";

const FacilityCard = ({ facility, onUpdate }) => {
  const cardRef = useRef(null);
  const badgeRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const card = cardRef.current;

      const onMouseEnter = () => {
        gsap.to(card, {
          y: -6,
          scale: 1.015,
          borderColor: "rgba(52, 211, 153, 0.50)",
          boxShadow: "0 0 25px rgba(16, 185, 129, 0.25)",
          duration: 0.4,
          ease: "power3.out",
        });
        gsap.to(badgeRef.current, { scale: 1.05, duration: 0.2 });
      };

      const onMouseLeave = () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          borderColor: "rgba(16, 185, 129, 0.15)",
          boxShadow: "0 4px 12px -2px rgba(2, 44, 34, 0.5)",
          duration: 0.4,
          ease: "power3.out",
        });
        gsap.to(badgeRef.current, { scale: 1, duration: 0.2 });
      };

      card.addEventListener("mouseenter", onMouseEnter);
      card.addEventListener("mouseleave", onMouseLeave);

      return () => {
        card.removeEventListener("mouseenter", onMouseEnter);
        card.removeEventListener("mouseleave", onMouseLeave);
      };
    }, cardRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={cardRef}
      className="bg-[#12221A] border border-[rgba(16,185,129,0.15)] rounded-2xl p-5 shadow-[0_4px_12px_-2px_rgba(2,44,34,0.5)] flex flex-col justify-between font-['Montserrat',sans-serif] text-[#ECFDF5]"
    >
      <div className="space-y-4">
        {/* Top Header */}
        <div className="flex justify-between items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#022C22] border border-[rgba(16,185,129,0.30)] flex items-center justify-center text-[#34D399] font-extrabold text-sm shrink-0 shadow-inner">
            {facility.facilityName ? facility.facilityName.charAt(0).toUpperCase() : "F"}
          </div>

          <span
            ref={badgeRef}
            className="px-2.5 py-1 bg-[#10B981]/10 text-[#34D399] border border-[#10B981]/30 rounded-full text-[10px] font-extrabold tracking-wider uppercase font-['Fira_Code',monospace]"
          >
            {facility.facilityType?.replace(/_/g, " ") || "GENERAL"}
          </span>
        </div>

        {/* Title & Location */}
        <div>
          <h3 className="text-base font-bold text-[#ECFDF5] tracking-tight line-clamp-1">
            {facility.facilityName || "Unnamed Processing Hub"}
          </h3>
          <p className="text-xs text-[#A7F3D0] font-medium flex items-center gap-1 mt-1">
            <svg className="w-3.5 h-3.5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <span>
              {facility.location?.city ? `${facility.location.city}, ${facility.location.state || ""}` : "Unspecified Hub"}
            </span>
          </p>
        </div>

        {/* Metrics Box */}
        <div className="grid grid-cols-2 gap-2 bg-[#0B1610]/80 p-3 rounded-xl border border-[rgba(16,185,129,0.15)] text-xs">
          <div>
            <span className="text-[10px] font-extrabold text-[#047857] block uppercase tracking-wider font-['Fira_Code',monospace]">
              Daily Capacity
            </span>
            <span className="font-extrabold text-[#ECFDF5] font-['Fira_Code',monospace]">
              {facility.processingCapacity?.value || "N/A"}{" "}
              <span className="text-[10px] text-[#A7F3D0]">
                {facility.processingCapacity?.unit?.replace(/_/g, " ") || ""}
              </span>
            </span>
          </div>

          <div>
            <span className="text-[10px] font-extrabold text-[#047857] block uppercase tracking-wider font-['Fira_Code',monospace]">
              Pricing Structure
            </span>
            <span className="font-extrabold text-[#D97706]">
              {facility.pricing?.replace(/_/g, " ") || "NEGOTIABLE"}
            </span>
          </div>
        </div>

        {/* Accepted Feedstock */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-extrabold text-[#047857] uppercase tracking-wider block font-['Fira_Code',monospace]">
            Accepted Feedstock
          </span>
          <div className="flex flex-wrap gap-1.5">
            {facility.acceptedWasteTypes && facility.acceptedWasteTypes.length > 0 ? (
              facility.acceptedWasteTypes.slice(0, 3).map((type, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-[#022C22] border border-[rgba(16,185,129,0.15)] text-[#A7F3D0] rounded-lg text-[10px] font-semibold"
                >
                  {type}
                </span>
              ))
            ) : (
              <span className="text-[11px] text-[#047857] italic">Unspecified</span>
            )}
            {facility.acceptedWasteTypes?.length > 3 && (
              <span className="px-1.5 py-0.5 bg-[#0B1610] text-[#10B981] rounded-lg text-[10px] font-bold border border-[#10B981]/20">
                +{facility.acceptedWasteTypes.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 mt-4 border-t border-[rgba(16,185,129,0.15)] flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#10B981]">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          Active Node
        </span>

        <button
          onClick={() => onUpdate && onUpdate(facility)}
          className="px-3 py-1.5 bg-[#0B1610] hover:bg-[#10B981]/10 border border-[rgba(16,185,129,0.30)] hover:border-[#34D399] text-[#ECFDF5] font-bold text-xs rounded-xl transition-all active:scale-95 cursor-pointer"
        >
          Manage Hub
        </button>
      </div>
    </div>
  );
};

export default FacilityCard;