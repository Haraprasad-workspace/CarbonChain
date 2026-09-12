import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PaymentCard = ({ payment, showActions = false, onPay }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const detailsRef = useRef(null);

  // GSAP ScrollTrigger Entrance Animation
  useEffect(() => {
    if (cardRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );

        if (detailsRef.current?.children) {
          gsap.fromTo(
            detailsRef.current.children,
            { opacity: 0, x: -10 },
            {
              opacity: 1,
              x: 0,
              duration: 0.4,
              stagger: 0.05,
              ease: "power2.out",
              delay: 0.15,
            }
          );
        }
      }, cardRef);

      return () => ctx.revert();
    }
  }, [payment]);

  // Status Badge Dark Theme Styles
  const statusStyles = {
    PENDING: "bg-[#F59E0B]/15 text-[#FBBF24] border-[#F59E0B]/30",
    PROCESSING: "bg-[#3B82F6]/15 text-[#60A5FA] border-[#3B82F6]/30",
    SUCCESS: "bg-[#10B981]/15 text-[#34D399] border-[#10B981]/30",
    FAILED: "bg-[#EF4444]/15 text-[#F87171] border-[#EF4444]/30",
    CANCELLED: "bg-[#6E9B82]/15 text-[#6E9B82] border-[#6E9B82]/30",
    REFUNDED: "bg-[#8B5CF6]/15 text-[#A78BFA] border-[#8B5CF6]/30",
  };

  const statusClass =
    statusStyles[payment?.status] ||
    "bg-[#6E9B82]/15 text-[#6E9B82] border-[#6E9B82]/30";

  return (
    <div
      ref={cardRef}
      className="bg-[#0B1A12] border border-[#1B382B] hover:border-[#10B981]/50 rounded-2xl p-6 shadow-xl font-['Montserrat',sans-serif] text-[#E2F1E7] space-y-5 transition-all duration-300 relative overflow-hidden"
    >
      {/* Background Ambient Glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#10B981]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-[#1B382B] pb-4">
        <div>
          <p className="text-[10px] font-extrabold text-[#6E9B82] uppercase tracking-widest">
            Payment Transaction
          </p>
          <h3 className="text-xl font-black text-[#E2F1E7] mt-1 tracking-tight">
            ₹{Number(payment?.amount || 0).toLocaleString("en-IN")}
          </h3>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border tracking-wider shadow-sm ${statusClass}`}
        >
          {payment?.status || "UNKNOWN"}
        </span>
      </div>

      {/* Details List */}
      <div ref={detailsRef} className="space-y-2.5 text-xs">
        <div className="flex justify-between items-center gap-4 py-1 border-b border-[#1B382B]/50">
          <span className="text-[#6E9B82] font-semibold">Waste Type</span>
          <span className="font-extrabold text-[#E2F1E7]">
            {payment?.wasteBatch?.wasteType || "N/A"}
          </span>
        </div>

        <div className="flex justify-between items-center gap-4 py-1 border-b border-[#1B382B]/50">
          <span className="text-[#6E9B82] font-semibold">Quantity</span>
          <span className="font-extrabold text-[#E2F1E7]">
            {payment?.wasteBatch?.quantity?.value || 0}{" "}
            {payment?.wasteBatch?.quantity?.unit || ""}
          </span>
        </div>

        <div className="flex justify-between items-center gap-4 py-1 border-b border-[#1B382B]/50">
          <span className="text-[#6E9B82] font-semibold">Payment Method</span>
          <span className="font-extrabold text-[#E2F1E7]">
            {payment?.paymentMethod || "N/A"}
          </span>
        </div>

        <div className="flex justify-between items-center gap-4 py-1 border-b border-[#1B382B]/50">
          <span className="text-[#6E9B82] font-semibold">Created Date</span>
          <span className="font-extrabold text-[#E2F1E7]">
            {payment?.createdAt
              ? new Date(payment.createdAt).toLocaleDateString("en-IN")
              : "N/A"}
          </span>
        </div>

        {payment?.paidAt && (
          <div className="flex justify-between items-center gap-4 py-1 border-b border-[#1B382B]/50">
            <span className="text-[#6E9B82] font-semibold">Paid On</span>
            <span className="font-extrabold text-[#34D399]">
              {new Date(payment.paidAt).toLocaleDateString("en-IN")}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && payment?.status === "PENDING" && (
        <div className="pt-2">
          <button
            onClick={() => {
              if (onPay) {
                onPay(payment);
              } else {
                navigate(`/payments/${payment._id}`);
              }
            }}
            className="w-full py-3 px-5 bg-[#10B981] hover:bg-[#059669] text-[#0B1A12] font-black text-xs rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
          >
            <svg
              className="w-4 h-4 text-[#0B1A12]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span>
              Pay ₹{Number(payment?.amount || 0).toLocaleString("en-IN")}
            </span>
          </button>
        </div>
      )}

      {/* Static Info Parameters */}
      <div className="pt-3 border-t border-[#1B382B] space-y-2">
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#6E9B82]">
          Verification Metadata
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-[#132A1D]/60 border border-[#1B382B] p-2.5 rounded-xl flex flex-col justify-between">
            <span className="text-[10px] font-bold text-[#6E9B82] uppercase">
              Escrow State
            </span>
            <span className="font-extrabold text-[#34D399]">Verified</span>
          </div>

          <div className="bg-[#132A1D]/60 border border-[#1B382B] p-2.5 rounded-xl flex flex-col justify-between">
            <span className="text-[10px] font-bold text-[#6E9B82] uppercase">
              Consensus Protocol
            </span>
            <span className="font-extrabold text-[#E2F1E7]">CarbonChain Node</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;