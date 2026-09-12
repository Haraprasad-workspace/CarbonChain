import { useState } from "react";
import { verifyAadhaar } from "../../services/verificationService";

const AadhaarVerification = ({ onVerified }) => {
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [status, setStatus] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Format value to 4-digit groups (e.g., 1234 5678 9012)
  const formatAadhaar = (val) => {
    const raw = val.replace(/\D/g, "").slice(0, 12);
    return raw.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const handleChange = (e) => {
    const formatted = formatAadhaar(e.target.value);
    setAadhaarNumber(formatted);
    if (status) setStatus("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rawDigits = aadhaarNumber.replace(/\s/g, "");

    console.log("[AadhaarVerification Debug] Submitting verification check...");

    if (!/^\d{12}$/.test(rawDigits)) {
      console.warn("[AadhaarVerification Debug] Validation failed: Invalid digit count.");
      setIsError(true);
      setStatus("Please enter a valid 12-digit identification number.");
      return;
    }

    try {
      setLoading(true);
      setStatus("");
      setIsError(false);

      const data = await verifyAadhaar(rawDigits);
      console.log("[AadhaarVerification Debug] Verification response received:", data?.message);

      setStatus(data.message || "Identity verified successfully.");
      onVerified?.();
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Verification failed. Please check the details and try again.";
      console.error("[AadhaarVerification Debug Error]", error);
      setIsError(true);
      setStatus(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#FAFBF9] border border-[#E1E6DE] rounded-2xl shadow-sm p-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-[#D2E7D6] flex items-center justify-center text-[#204E4A]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-base font-bold text-[#162925]">Identity Verification</h3>
          <p className="text-xs text-[#6B7D76]">
            Verify government identity to unlock direct trading access
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#162925] uppercase tracking-wider mb-2">
            Aadhaar Number
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              maxLength="14"
              placeholder="1234 5678 9012"
              value={aadhaarNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 text-sm font-mono tracking-widest bg-white text-[#162925] placeholder-[#94A39D] border border-[#E1E6DE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#204E4A] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Status Alert Message */}
        {status && (
          <div
            className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2 ${
              isError
                ? "bg-[#FDF2F2] border border-[#F8D7DA] text-[#A94442]"
                : "bg-[#D8EEDF] border border-[#C2E3CD] text-[#1E5E38]"
            }`}
          >
            {isError ? (
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            <span>{status}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-[#143B36] hover:bg-[#0E2C28] text-[#FAFBF9] font-bold text-sm rounded-xl shadow-none hover:shadow transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Verifying Identity...</span>
            </>
          ) : (
            <span>Verify Identification</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default AadhaarVerification;