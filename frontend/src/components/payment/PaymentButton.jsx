import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  createPayment,
  verifyPayment,
} from "../../services/paymentService";

gsap.registerPlugin(ScrollTrigger);

const PaymentButton = ({ negotiation, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Animation Refs
  const containerRef = useRef(null);
  const alertRef = useRef(null);
  const staticDetailsRef = useRef(null);

  // GSAP ScrollTrigger Entrance Animation
  useEffect(() => {
    if (containerRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          containerRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );

        if (staticDetailsRef.current?.children) {
          gsap.fromTo(
            staticDetailsRef.current.children,
            { opacity: 0, y: 8 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.08,
              ease: "power2.out",
              delay: 0.2,
            }
          );
        }
      }, containerRef);

      return () => ctx.revert();
    }
  }, [negotiation?.status]);

  // Animate Error Alert on State Change
  useEffect(() => {
    if (error && alertRef.current) {
      gsap.fromTo(
        alertRef.current,
        { opacity: 0, y: -8, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "back.out(1.5)" }
      );
    }
  }, [error]);

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError("");

      // Create payment
      const response = await createPayment(negotiation._id);

      const payment = response?.payment;

      if (!payment) {
        throw new Error("Payment could not be created.");
      }

      // DEMO PAYMENT GATEWAY
      const verificationResponse = await verifyPayment(payment._id);

      if (verificationResponse?.payment?.status === "SUCCESS") {
        if (onSuccess) {
          onSuccess(verificationResponse.payment);
        }
      } else {
        throw new Error("Payment verification failed.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Payment failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const amount =
    negotiation?.agreedPrice ??
    negotiation?.currentOffer ??
    0;

  if (negotiation?.status !== "ACCEPTED") {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="mt-5 bg-[#0B1A12] border border-[#1B382B] hover:border-[#10B981]/50 rounded-2xl p-5 shadow-xl font-['Montserrat',sans-serif] text-[#E2F1E7] space-y-4 transition-all duration-300 relative overflow-hidden"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/10 rounded-bl-full pointer-events-none blur-2xl" />

      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-[#1B382B] pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#6E9B82]">
            Final Settlement
          </span>
        </div>
        <span className="text-xs font-black text-[#10B981] bg-[#10B981]/15 px-2.5 py-0.5 border border-[#10B981]/30 rounded-md">
          Ready for Payment
        </span>
      </div>

      {/* Error Notification */}
      {error && (
        <div
          ref={alertRef}
          className="p-3.5 bg-[#EF4444]/15 border border-[#EF4444]/30 rounded-xl text-xs font-bold text-[#F87171] flex items-center gap-2.5 shadow-sm"
        >
          <svg
            className="w-4 h-4 text-[#F87171] shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Payment Action */}
      <div className="space-y-2">
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full py-3.5 px-5 bg-[#10B981] hover:bg-[#059669] disabled:bg-[#132A1D] disabled:text-[#6E9B82] text-[#0B1A12] font-black text-xs rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:active:scale-100 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-[#0B1A12] border-t-transparent rounded-full animate-spin" />
              <span>Processing Payment...</span>
            </>
          ) : (
            <>
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
              <span>Pay ₹{Number(amount).toLocaleString("en-IN")}</span>
            </>
          )}
        </button>

        <p className="text-[11px] font-semibold text-[#6E9B82] text-center pt-1">
          Secure payment • CarbonChain Demo Gateway
        </p>
      </div>

      {/* Static Info Parameters */}
      <div className="pt-2 border-t border-[#1B382B] space-y-2">
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#6E9B82]">
          Transaction Security Protocols
        </p>

        <div
          ref={staticDetailsRef}
          className="grid grid-cols-2 gap-2 text-xs"
        >
          <div className="bg-[#132A1D]/60 border border-[#1B382B] p-2.5 rounded-xl flex flex-col justify-between">
            <span className="text-[10px] font-bold text-[#6E9B82] uppercase">
              Escrow Protection
            </span>
            <span className="font-extrabold text-[#34D399]">100% Encrypted</span>
          </div>

          <div className="bg-[#132A1D]/60 border border-[#1B382B] p-2.5 rounded-xl flex flex-col justify-between">
            <span className="text-[10px] font-bold text-[#6E9B82] uppercase">
              Settlement Engine
            </span>
            <span className="font-extrabold text-[#E2F1E7]">Instant Real-Time</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentButton;