import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { submitOffer } from "../../services/negotiationService";

const OfferForm = ({ negotiationId, onUpdate }) => {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Animation Refs
  const cardRef = useRef(null);
  const alertRef = useRef(null);

  // GSAP Entrance Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    }, cardRef);

    return () => ctx.revert();
  }, []);

  // Animate Error/Success Alerts on Change
  useEffect(() => {
    if ((error || success) && alertRef.current) {
      gsap.fromTo(
        alertRef.current,
        { opacity: 0, y: -8, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(1.5)" }
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
      className="bg-white border border-[#E8DDCB] hover:border-[#FFA800]/50 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-sm transition-all duration-300 font-['Montserrat',sans-serif] text-[#422D0B] relative overflow-hidden"
    >
      {/* Decorative Warm Accent Blur */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFA800]/5 rounded-bl-full pointer-events-none" />

      {/* Header */}
      <div className="space-y-1 mb-6 border-b border-[#E8DDCB] pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FFA800] animate-pulse" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#967A53]">
            Submit Counter / New Deal
          </span>
        </div>
        <h3 className="text-xl font-black text-[#422D0B] tracking-tight">
          Make an Offer
        </h3>
      </div>

      {/* Alert Notifications */}
      {error && (
        <div
          ref={alertRef}
          className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-800 flex items-center gap-2.5"
        >
          <svg
            className="w-4 h-4 text-rose-600 shrink-0"
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
          className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2.5"
        >
          <svg
            className="w-4 h-4 text-emerald-600 shrink-0"
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
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Amount Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#967A53]">
            Offer Amount <span className="text-[#FFA800]">*</span>
          </label>
          <div className="relative rounded-xl overflow-hidden shadow-2xs">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#967A53] font-black text-sm">
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
              className="w-full pl-8 pr-4 py-3 bg-[#FFFBF5] border border-[#E8DDCB] focus:border-[#FFA800] focus:bg-white rounded-xl text-sm font-extrabold text-[#422D0B] placeholder-[#967A53]/50 outline-none transition-all"
            />
          </div>
        </div>

        {/* Message Input */}
        <div className="space-y-1.5">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#967A53]">
            Message or Terms <span className="text-[10px] lowercase font-normal">(optional)</span>
          </label>
          <textarea
            placeholder="Add relevant transport details, validity notes, or processing preferences..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="3"
            className="w-full p-3.5 bg-[#FFFBF5] border border-[#E8DDCB] focus:border-[#FFA800] focus:bg-white rounded-xl text-xs font-semibold text-[#422D0B] placeholder-[#967A53]/50 outline-none transition-all resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-6 bg-[#FFA800] hover:bg-[#FFC24A] disabled:bg-[#E8DDCB] disabled:text-[#967A53] text-[#422D0B] font-extrabold text-xs rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:active:scale-100 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-[#422D0B] border-t-transparent rounded-full animate-spin" />
              <span>Submitting Offer...</span>
            </>
          ) : (
            <>
              <span>Submit Offer</span>
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
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default OfferForm;