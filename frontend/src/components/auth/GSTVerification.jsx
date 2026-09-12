import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { verifyGST } from "../../services/verificationService";

const GSTVerification = ({ onVerified }) => {
  const [gstin, setGstin] = useState("");
  const [status, setStatus] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  // GSAP Animation Refs
  const cardRef = useRef(null);
  const alertRef = useRef(null);

  // Entrance Motion
  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  // Alert State Motion
  useEffect(() => {
    if (status && alertRef.current) {
      gsap.fromTo(
        alertRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)" }
      );
    }
  }, [status]);

  const handleChange = (e) => {
    setGstin(e.target.value.toUpperCase());
    if (status) setStatus("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const value = gstin.trim().toUpperCase();

    console.log("[GSTVerification Debug] Initiating GSTIN verification for:", value);

    // GSTIN Regex: 2 digits (state code), 10 char PAN, 1 entity code, 1 'Z' default, 1 checksum char
    if (!/^[0-9]{2}[A-Z0-9]{13}$/.test(value)) {
      console.warn("[GSTVerification Debug] Validation failed: Invalid GSTIN structure.");
      setIsError(true);
      setStatus("Enter a valid 15-character GSTIN (e.g. 24AAAAA0000A1Z5)");
      return;
    }

    try {
      setLoading(true);
      setStatus("");
      setIsError(false);

      const data = await verifyGST(value);
      console.log("[GSTVerification Debug] Verification successful response:", data?.message);

      setStatus(data.message || "GSTIN verified successfully.");
      onVerified?.();
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "GST verification failed. Please check the GSTIN and try again.";
      console.error("[GSTVerification Debug Error]", error);
      setIsError(true);
      setStatus(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={cardRef}
      className="w-full bg-[#0B1610]/80 backdrop-blur-xl border border-[rgba(16,185,129,0.2)] rounded-2xl p-6 text-[#ECFDF5] shadow-[0_20px_25px_-5px_rgba(2,44,34,0.7)] font-sans relative overflow-hidden"
    >
      {/* Background Radial Glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-3.5 mb-6 relative z-10">
        <div className="w-11 h-11 rounded-xl bg-[#022C22] border border-[rgba(16,185,129,0.3)] flex items-center justify-center text-[#34D399] shadow-[0_0_15px_rgba(16,185,129,0.15)]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0V7m4 4v10"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-base font-bold text-[#ECFDF5] tracking-tight">
            GST Registration Verification
          </h3>
          <p className="text-xs text-[#A7F3D0]/70">
            Verify tax details to enable official entity transactions
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
        <div>
          <label className="block text-xs font-semibold text-[#A7F3D0] uppercase tracking-wider mb-2">
            GSTIN (Goods and Services Tax Identification Number)
          </label>
          <div className="relative">
            <input
              type="text"
              maxLength="15"
              placeholder="24AAAAA0000A1Z5"
              value={gstin}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 text-sm font-mono tracking-wider uppercase bg-[#12221A] text-[#ECFDF5] placeholder-[#065F46] border border-[rgba(16,185,129,0.25)] rounded-xl focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Status / Alert Message */}
        {status && (
          <div
            ref={alertRef}
            className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2.5 backdrop-blur-md transition-all ${
              isError
                ? "bg-red-950/40 border border-red-500/40 text-red-300"
                : "bg-[#052E16]/80 border border-[rgba(52,211,153,0.4)] text-[#34D399]"
            }`}
          >
            {isError ? (
              <svg className="w-4 h-4 shrink-0 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4 shrink-0 text-[#34D399]" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <span>{status}</span>
          </div>
        )}

        {/* Submit Action */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#34D399] hover:to-[#10B981] text-[#050B07] font-bold text-sm rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-[#050B07] border-t-transparent rounded-full animate-spin" />
              <span>Verifying GSTIN...</span>
            </>
          ) : (
            <span>Verify GST Details</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default GSTVerification;