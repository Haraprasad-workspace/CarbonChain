import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { submitOffer } from "../../services/negotiationService";

gsap.registerPlugin(ScrollTrigger);

const OfferForm = ({ negotiationId, onUpdate }) => {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Animation Refs
  const cardRef = useRef(null);
  const headerRef = useRef(null);
  const formRef = useRef(null);
  const alertRef = useRef(null);
  const staticDetailsRef = useRef(null);

  // GSAP Entrance & ScrollTrigger Animation
  useEffect(() => {
    if (cardRef.current) {
      const ctx = gsap.context(() => {
        // Scroll-driven card reveal
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Header Reveal
        if (headerRef.current) {
          gsap.fromTo(
            headerRef.current,
            { opacity: 0, x: -15 },
            { opacity: 1, x: 0, duration: 0.5, ease: "power2.out", delay: 0.15 }
          );
        }

        // Form Fields Stagger
        if (formRef.current?.children) {
          gsap.fromTo(
            formRef.current.children,
            { opacity: 0, y: 15 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.08,
              ease: "power2.out",
              delay: 0.25,
            }
          );
        }

        // Static Info Cards Animation
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
              delay: 0.4,
            }
          );
        }
      }, cardRef);

      return () => ctx.revert();
    }
  }, []);

  // Animate Error/Success Alerts on State Change
  useEffect(() => {
    if ((error || success) && alertRef.current) {
      gsap.fromTo(
        alertRef.current,
        { opacity: 0, y: -8, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "back.out(1.5)" }
      );
    }
  }, [error, success]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!amount || Number(amount) < 0) {
      setError("Please enter a valid, non-negative offer amount.");
      return;
    }

    try {
      setLoading(true);

      await submitOffer(negotiationId, {
        amount: Number(amount),
        message,
      });

      setSuccess("Your offer has been submitted successfully.");
      setAmount("");
      setMessage("");

      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit offer. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={cardRef}
      className="bg-[#0B1A12] border border-[#1B382B] hover:border-[#10B981]/50 rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 font-['Montserrat',sans-serif] text-[#E2F1E7] relative overflow-hidden space-y-6"
    >
      {/* Decorative Dark Forest Green Glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-[#10B981]/10 rounded-bl-full pointer-events-none blur-2xl" />

      {/* Header */}
      <div
        ref={headerRef}
        className="space-y-1 border-b border-[#1B382B] pb-4"
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#6E9B82]">
            Submit Counter / New Deal
          </span>
        </div>
        <h3 className="text-xl font-black text-[#E2F1E7] tracking-tight">
          Make an Offer
        </h3>
      </div>

      {/* Alert Notifications */}
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

      {success && (
        <div
          ref={alertRef}
          className="p-3.5 bg-[#10B981]/15 border border-[#10B981]/30 rounded-xl text-xs font-bold text-[#34D399] flex items-center gap-2.5 shadow-sm"
        >
          <svg
            className="w-4 h-4 text-[#34D399] shrink-0"
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
          <span>{success}</span>
        </div>
      )}

      {/* Offer Form */}
      <form onSubmit={handleSubmit} className="space-y-5" ref={formRef}>
        {/* Amount Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#6E9B82]">
            Offer Amount <span className="text-[#10B981]">*</span>
          </label>
          <div className="relative rounded-xl overflow-hidden shadow-inner">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6E9B82] font-black text-sm">
              ₹
            </div>
            <input
              type="number"
              placeholder="0.00"
              min="0"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full pl-8 pr-4 py-3 bg-[#132A1D] border border-[#1B382B] focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 rounded-xl text-sm font-extrabold text-[#E2F1E7] placeholder-[#6E9B82]/50 outline-none transition-all"
            />
          </div>
        </div>

        {/* Message Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#6E9B82]">
            Message or Terms{" "}
            <span className="text-[10px] lowercase font-normal">
              (optional)
            </span>
          </label>
          <textarea
            placeholder="Add relevant transport details, validity notes, or processing preferences..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="3"
            className="w-full p-3.5 bg-[#132A1D] border border-[#1B382B] focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 rounded-xl text-xs font-semibold text-[#E2F1E7] placeholder-[#6E9B82]/50 outline-none transition-all resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 bg-[#10B981] hover:bg-[#059669] disabled:bg-[#132A1D] disabled:text-[#6E9B82] text-[#0B1A12] font-black text-xs rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:active:scale-100 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-[#0B1A12] border-t-transparent rounded-full animate-spin" />
              <span>Submitting Offer...</span>
            </>
          ) : (
            <>
              <span>Submit Offer</span>
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
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </>
          )}
        </button>
      </form>

      {/* Static Info Parameters */}
      <div className="pt-2 border-t border-[#1B382B] space-y-2">
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#6E9B82]">
          Offer Rules & Policies
        </p>

        <div
          ref={staticDetailsRef}
          className="grid grid-cols-2 gap-2 text-xs"
        >
          <div className="bg-[#132A1D]/60 border border-[#1B382B] p-2.5 rounded-xl flex flex-col justify-between">
            <span className="text-[10px] font-bold text-[#6E9B82] uppercase">
              Min Counter Increment
            </span>
            <span className="font-extrabold text-[#E2F1E7]">₹1.00</span>
          </div>

          <div className="bg-[#132A1D]/60 border border-[#1B382B] p-2.5 rounded-xl flex flex-col justify-between">
            <span className="text-[10px] font-bold text-[#6E9B82] uppercase">
              Offer Expiry
            </span>
            <span className="font-extrabold text-[#E2F1E7]">48 Hours</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferForm;