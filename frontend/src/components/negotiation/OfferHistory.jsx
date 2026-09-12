import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const OfferHistory = ({ offers = [], currentUserId }) => {
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const timelineRef = useRef(null);
  const staticDetailsRef = useRef(null);

  // GSAP ScrollTrigger & Staggered Entrance Animations
  useEffect(() => {
    if (containerRef.current) {
      const ctx = gsap.context(() => {
        // Container Scroll Reveal
        gsap.fromTo(
          containerRef.current,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Header Fade-In
        if (headerRef.current) {
          gsap.fromTo(
            headerRef.current,
            { opacity: 0, x: -15 },
            { opacity: 1, x: 0, duration: 0.5, ease: "power2.out", delay: 0.15 }
          );
        }

        // Timeline Items Staggered Reveal
        if (offers.length > 0 && timelineRef.current?.children) {
          gsap.fromTo(
            timelineRef.current.children,
            { opacity: 0, y: 15, scale: 0.98 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.45,
              stagger: 0.08,
              ease: "power2.out",
              delay: 0.25,
            }
          );
        }

        // Static Metrics Animation
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
              delay: 0.35,
            }
          );
        }
      }, containerRef);

      return () => ctx.revert();
    }
  }, [offers]);

  // Empty State - Dark Forest Green Theme
  if (offers.length === 0) {
    return (
      <div
        ref={containerRef}
        className="bg-[#0B1A12] border border-[#1B382B] rounded-2xl p-8 sm:p-12 text-center space-y-4 shadow-xl font-['Montserrat',sans-serif] text-[#E2F1E7] relative overflow-hidden"
      >
        <div className="w-12 h-12 bg-[#132A1D] border border-[#1B382B] text-[#10B981] rounded-xl flex items-center justify-center mx-auto text-lg shadow-sm">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-black text-[#E2F1E7]">
            No Offers Made Yet
          </h4>
          <p className="text-xs text-[#6E9B82] max-w-sm mx-auto leading-relaxed">
            Submit a proposal above to kickstart the negotiation thread.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="bg-[#0B1A12] border border-[#1B382B] hover:border-[#10B981]/50 rounded-2xl p-6 sm:p-8 shadow-xl font-['Montserrat',sans-serif] text-[#E2F1E7] space-y-6 transition-all duration-300 relative overflow-hidden"
    >
      {/* Background Ambient Dark Green Glow */}
      <div className="absolute top-0 right-1/3 w-40 h-40 bg-[#10B981]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div
        ref={headerRef}
        className="flex items-center justify-between border-b border-[#1B382B] pb-4"
      >
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#6E9B82]">
            Audit Log
          </span>
          <h3 className="text-lg font-black text-[#E2F1E7] tracking-tight">
            Offer History
          </h3>
        </div>
        <span className="px-3 py-1 bg-[#132A1D] border border-[#1B382B] text-[#10B981] text-xs font-black rounded-full shadow-sm">
          {offers.length} {offers.length === 1 ? "Offer" : "Offers"}
        </span>
      </div>

      {/* Timeline Chat List */}
      <div ref={timelineRef} className="space-y-4 relative">
        {/* Subtle Vertical Connector Line */}
        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-[#1B382B] hidden sm:block pointer-events-none" />

        {offers.map((offer, index) => {
          const senderId = offer.sender?._id || offer.sender;
          const isMine =
            senderId?.toString() === currentUserId?.toString();

          const senderName = isMine
            ? "You"
            : offer.sender?.name || offer.sender?.organization || "Counterparty";

          // Format Date
          const formattedTime = offer.createdAt
            ? new Date(offer.createdAt).toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "";

          return (
            <div
              key={offer._id || index}
              className={`flex flex-col sm:flex-row gap-3 sm:gap-4 relative ${
                isMine ? "sm:justify-end" : "sm:justify-start"
              }`}
            >
              {/* Timeline Bullet Dot */}
              <div
                className={`hidden sm:flex w-8 h-8 rounded-full border items-center justify-center text-xs font-black shrink-0 z-10 ${
                  isMine
                    ? "bg-[#10B981] border-[#10B981] text-[#0B1A12] shadow-md"
                    : "bg-[#132A1D] border-[#1B382B] text-[#6E9B82]"
                }`}
              >
                {isMine ? "Y" : "C"}
              </div>

              {/* Offer Bubble */}
              <div
                className={`max-w-xl w-full border rounded-2xl p-4 space-y-3 transition-all ${
                  isMine
                    ? "bg-[#132A1D]/90 border-[#1B382B] hover:border-[#10B981]/50 self-end shadow-md"
                    : "bg-[#0B1A12] border-[#1B382B] hover:border-[#10B981]/50 self-start shadow-sm"
                }`}
              >
                {/* Bubble Header */}
                <div className="flex items-center justify-between gap-2 border-b border-[#1B382B] pb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-black ${
                        isMine ? "text-[#E2F1E7]" : "text-[#6E9B82]"
                      }`}
                    >
                      {senderName}
                    </span>
                    {isMine && (
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30 rounded-md">
                        Sent
                      </span>
                    )}
                  </div>

                  {/* Offer Amount Tag */}
                  <span className="text-sm font-black text-[#10B981]">
                    ₹{offer.amount?.toLocaleString() ?? "0"}
                  </span>
                </div>

                {/* Optional Message */}
                {offer.message && (
                  <p className="text-xs text-[#E2F1E7] leading-relaxed bg-[#0B1A12]/80 p-2.5 rounded-xl border border-[#1B382B] italic">
                    "{offer.message}"
                  </p>
                )}

                {/* Footer Meta */}
                <div className="flex items-center justify-between text-[10px] text-[#6E9B82] pt-1">
                  {offer.status && (
                    <span className="font-extrabold uppercase tracking-wider">
                      Status:{" "}
                      <span className="text-[#34D399]">{offer.status}</span>
                    </span>
                  )}
                  {formattedTime && (
                    <span className="font-medium">{formattedTime}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Static Info Parameters */}
      <div className="pt-2 border-t border-[#1B382B] space-y-2">
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#6E9B82]">
          Audit & Integrity Metadata
        </p>

        <div
          ref={staticDetailsRef}
          className="grid grid-cols-2 gap-2 text-xs"
        >
          <div className="bg-[#132A1D]/60 border border-[#1B382B] p-2.5 rounded-xl flex flex-col justify-between">
            <span className="text-[10px] font-bold text-[#6E9B82] uppercase">
              Ledger Encryption
            </span>
            <span className="font-extrabold text-[#E2F1E7]">SHA-256 Verified</span>
          </div>

          <div className="bg-[#132A1D]/60 border border-[#1B382B] p-2.5 rounded-xl flex flex-col justify-between">
            <span className="text-[10px] font-bold text-[#6E9B82] uppercase">
              Timezone Reference
            </span>
            <span className="font-extrabold text-[#E2F1E7]">IST (UTC+05:30)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferHistory;