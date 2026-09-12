import { useEffect, useRef } from "react";
import gsap from "gsap";

const OfferHistory = ({ offers = [], currentUserId }) => {
  const containerRef = useRef(null);
  const timelineRef = useRef(null);

  // Staggered entrance animation for offer cards
  useEffect(() => {
    if (offers.length > 0 && timelineRef.current?.children) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          timelineRef.current.children,
          { opacity: 0, y: 15, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.4,
            stagger: 0.08,
            ease: "power2.out",
          }
        );
      }, containerRef);

      return () => ctx.revert();
    }
  }, [offers]);

  // Empty State
  if (offers.length === 0) {
    return (
      <div className="bg-white border border-[#E8DDCB] rounded-2xl p-8 text-center space-y-3 font-['Montserrat',sans-serif]">
        <div className="w-12 h-12 bg-[#FFFBF5] border border-[#E8DDCB] text-[#FFA800] rounded-xl flex items-center justify-center mx-auto text-lg shadow-2xs">
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
          <h4 className="text-sm font-extrabold text-[#422D0B]">
            No Offers Made Yet
          </h4>
          <p className="text-xs text-[#967A53]">
            Submit a proposal above to kickstart the negotiation thread.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="bg-white border border-[#E8DDCB] rounded-2xl p-6 sm:p-8 shadow-xs font-['Montserrat',sans-serif] text-[#422D0B] space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E8DDCB] pb-4">
        <div className="space-y-0.5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#967A53]">
            Audit Log
          </span>
          <h3 className="text-lg font-black text-[#422D0B] tracking-tight">
            Offer History
          </h3>
        </div>
        <span className="px-2.5 py-1 bg-[#FFFBF5] border border-[#E8DDCB] text-[#422D0B] text-xs font-extrabold rounded-full">
          {offers.length} {offers.length === 1 ? "Offer" : "Offers"}
        </span>
      </div>

      {/* Timeline Chat List */}
      <div ref={timelineRef} className="space-y-4 relative">
        {/* Subtle Vertical Connector Line */}
        <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-[#E8DDCB] hidden sm:block pointer-events-none" />

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
                    ? "bg-[#FFA800] border-[#FFC24A] text-[#422D0B]"
                    : "bg-[#FFFBF5] border-[#E8DDCB] text-[#967A53]"
                }`}
              >
                {isMine ? "Y" : "O"}
              </div>

              {/* Offer Bubble */}
              <div
                className={`max-w-xl w-full border rounded-2xl p-4 space-y-3 transition-all ${
                  isMine
                    ? "bg-[#FFFBF5] border-[#E8DDCB] hover:border-[#FFA800]/60 self-end"
                    : "bg-white border-[#E8DDCB] hover:border-[#FFA800]/60 self-start"
                }`}
              >
                {/* Bubble Header */}
                <div className="flex items-center justify-between gap-2 border-b border-[#E8DDCB]/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-black ${
                        isMine ? "text-[#422D0B]" : "text-[#967A53]"
                      }`}
                    >
                      {senderName}
                    </span>
                    {isMine && (
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 bg-[#FFA800]/20 text-[#422D0B] rounded-md">
                        Sent
                      </span>
                    )}
                  </div>

                  {/* Offer Amount Tag */}
                  <span className="text-sm font-black text-[#FFA800]">
                    ₹{offer.amount?.toLocaleString() ?? "0"}
                  </span>
                </div>

                {/* Optional Message */}
                {offer.message && (
                  <p className="text-xs text-[#422D0B] leading-relaxed bg-white/70 p-2.5 rounded-xl border border-[#E8DDCB]/40 italic">
                    "{offer.message}"
                  </p>
                )}

                {/* Footer Meta */}
                <div className="flex items-center justify-between text-[10px] text-[#967A53] pt-1">
                  {offer.status && (
                    <span className="font-extrabold uppercase tracking-wider">
                      Status:{" "}
                      <span className="text-[#422D0B]">{offer.status}</span>
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
    </div>
  );
};

export default OfferHistory;