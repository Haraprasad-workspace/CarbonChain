import { useState } from "react";
import { verifyGST } from "../../services/verificationService";

const GSTVerification = ({ onVerified }) => {
  const [gstin, setGstin] = useState("");
  const [status, setStatus] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

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
    <div className="w-full bg-[#FFFBF5] border border-[#E8DDCB] rounded-2xl shadow-md p-6 font-['Montserrat',sans-serif]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-[#FFA800]/20 flex items-center justify-center text-[#422D0B]">
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
          <h3 className="text-base font-bold text-[#422D0B]">GST Registration Verification</h3>
          <p className="text-xs text-[#967A53]">
            Verify tax details to enable official entity transactions
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#422D0B] uppercase tracking-wider mb-2">
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
              className="w-full px-4 py-3 text-sm font-mono tracking-wider uppercase bg-white text-[#422D0B] placeholder-[#967A53]/50 border border-[#E8DDCB] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFA800] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Status / Alert Message */}
        {status && (
          <div
            className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2 ${
              isError
                ? "bg-red-50 border border-red-200 text-red-700"
                : "bg-emerald-50 border border-emerald-200 text-emerald-800"
            }`}
          >
            {isError ? (
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
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

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-[#FFA800] hover:bg-[#FFC24A] text-[#422D0B] font-bold text-sm rounded-xl shadow transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-[#422D0B] border-t-transparent rounded-full animate-spin" />
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