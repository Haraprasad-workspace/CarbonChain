import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useAuth from "../../hooks/useAuth";

gsap.registerPlugin(ScrollTrigger);

const NegotiationCard = ({ negotiation }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const cardRef = useRef(null);
  const metricsGridRef = useRef(null);
  const offerBadgeRef = useRef(null);

  const isGenerator = user?.role === "WASTE_GENERATOR";

  const facility = negotiation?.facility;
  const waste = negotiation?.wasteBatch;

  // Dark Forest Green Theme Status Badge Styling
  const getStatusBadge = (status) => {
    switch (status) {
      case "ACCEPTED":
        return {
          bg: "bg-[#10B981]/15",
          text: "text-[#10B981]",
          border: "border-[#10B981]/30",
          dot: "bg-[#10B981]",
        };
      case "REJECTED":
      case "CANCELLED":
        return {
          bg: "bg-[#EF4444]/15",
          text: "text-[#F87171]",
          border: "border-[#EF4444]/30",
          dot: "bg-[#EF4444]",
        };
      case "COUNTERED":
        return {
          bg: "bg-[#F59E0B]/15",
          text: "text-[#FBBF24]",
          border: "border-[#F59E0B]/30",
          dot: "bg-[#F59E0B]",
        };
      case "PENDING":
      default:
        return {
          bg: "bg-[#34D399]/15",
          text: "text-[#34D399]",
          border: "border-[#34D399]/30",
          dot: "bg-[#34D399]",
        };
    }
  };

  const statusStyle = getStatusBadge(negotiation?.status);

  // GSAP Scroll Trigger Entrance Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Card Entrance Reveal
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Staggered Inner Metrics Grid Reveal
      if (metricsGridRef.current?.children) {
        gsap.fromTo(
          metricsGridRef.current.children,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "power2.out",
            delay: 0.2,
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Agreed Price Highlight Pulse
      if (offerBadgeRef.current) {
        gsap.fromTo(
          offerBadgeRef.current,
          { scale: 0.95, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: "back.out(1.7)",
            delay: 0.3,
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    }, cardRef);

    return () => ctx.revert();
  }, [negotiation]);

  return (
    <div
      ref={cardRef}
      className="bg-[#0B1A12] border border-[#1B382B] hover:border-[#10B981]/50 rounded-2xl p-5 sm:p-6 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group flex flex-col justify-between space-y-5 font-['Montserrat',sans-serif] text-[#E2F1E7]"
    >
      {/* Dark Ambient Green Glow Accent */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#10B981]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Subtle Top Border Glow on Hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#10B981] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1B382B] pb-4">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#6E9B82]">
            {isGenerator ? "Facility Partner" : "Waste Generator"}
          </span>
          <h3 className="text-lg font-black text-[#E2F1E7] tracking-tight group-hover:text-[#10B981] transition-colors">
            {isGenerator
              ? facility?.facilityName || "Facility Partner"
              : negotiation?.generator?.organization ||
                negotiation?.generator?.name ||
                "Generator Partner"}
          </h3>
        </div>

        {/* Dynamic Status Badge */}
        <div
          className={`self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
        >
          <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
          <span>{negotiation?.status || "PENDING"}</span>
        </div>
      </div>

      {/* Key Metric Grid Section */}
      <div
        ref={metricsGridRef}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#132A1D]/70 border border-[#1B382B] rounded-xl p-3.5"
      >
        {/* Waste Type */}
        <div className="space-y-0.5">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E9B82]">
            Waste Type
          </p>
          <p className="text-xs font-black text-[#E2F1E7] truncate">
            {waste?.wasteType || "N/A"}
          </p>
        </div>

        {/* Quantity */}
        <div className="space-y-0.5">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E9B82]">
            Quantity
          </p>
          <p className="text-xs font-black text-[#E2F1E7]">
            {waste?.quantity?.value != null
              ? `${waste.quantity.value} ${waste.quantity.unit || ""}`
              : "N/A"}
          </p>
        </div>

        {/* Current Offer */}
        <div className="space-y-0.5">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E9B82]">
            Current Offer
          </p>
          <p className="text-xs font-black text-[#10B981]">
            ₹{negotiation?.currentOffer?.toLocaleString() ?? "0"}
          </p>
        </div>

        {/* Offers Count Log */}
        <div className="space-y-0.5">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#6E9B82]">
            Offers Log
          </p>
          <p className="text-xs font-black text-[#E2F1E7]">
            {negotiation?.offers?.length || 0}{" "}
            {negotiation?.offers?.length === 1 ? "Offer" : "Offers"}
          </p>
        </div>
      </div>

      {/* Agreed Price Highlight (If Present) */}
      {negotiation?.agreedPrice !== undefined &&
        negotiation?.agreedPrice !== null && (
          <div
            ref={offerBadgeRef}
            className="flex items-center justify-between bg-[#10B981]/15 border border-[#10B981]/30 rounded-xl p-3 px-4 shadow-sm"
          >
            <span className="text-xs font-extrabold text-[#10B981] uppercase tracking-wider">
              Final Agreed Price
            </span>
            <span className="text-sm font-black text-[#10B981]">
              ₹{negotiation.agreedPrice.toLocaleString()}
            </span>
          </div>
        )}

      {/* Action Footer */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={() => navigate(`/negotiations/${negotiation?._id}`)}
          className="w-full sm:w-auto px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-[#0B1A12] font-black text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
        >
          <span>Open Negotiation</span>
          <svg
            className="w-4 h-4 text-[#0B1A12] group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NegotiationCard;