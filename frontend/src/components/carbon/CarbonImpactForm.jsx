import { useState } from "react";
import { createCarbonRecord } from "../../services/carbonService";

const CarbonImpactForm = ({ wasteBatch, facilityId, onSuccess }) => {
  const [processingMethod, setProcessingMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!processingMethod) {
      setError("Please select a valid processing method.");
      return;
    }

    try {
      setLoading(true);

      await createCarbonRecord({
        wasteBatchId: wasteBatch?._id,
        facilityId,
        processingMethod,
      });

      setSuccess("Carbon impact recorded successfully.");
      setProcessingMethod("");

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to record carbon impact."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAFBF9] border border-[#E1E6DE] rounded-2xl p-6 shadow-sm space-y-6 font-['Plus_Jakarta_Sans',sans-serif] text-[#162925]">
      {/* Header */}
      <div className="border-b border-[#E1E6DE] pb-4 space-y-0.5">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#6B7D76]">
          Impact Accounting
        </span>
        <h3 className="text-base font-black text-[#162925] tracking-tight">
          Record Carbon Impact
        </h3>
      </div>

      {/* Target Waste Batch Preview Card */}
      <div className="bg-[#F4F6F0] border border-[#E1E6DE] rounded-xl p-4 grid grid-cols-2 gap-4 text-xs">
        <div className="space-y-0.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7D76]">
            Target Waste
          </span>
          <p className="font-extrabold text-[#162925] truncate">
            {wasteBatch?.wasteType || "Unspecified"}
          </p>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7D76]">
            Batch Volume
          </span>
          <p className="font-black text-[#204E4A]">
            {wasteBatch?.quantity?.value != null
              ? `${wasteBatch.quantity.value} ${wasteBatch.quantity.unit || ""}`
              : "N/A"}
          </p>
        </div>
      </div>

      {/* Alert Banners */}
      {error && (
        <div className="bg-[#FDF2F2] border border-[#F8D7DA] text-[#A94442] rounded-xl p-3.5 text-xs font-bold flex items-center gap-2">
          <svg className="w-4 h-4 text-[#A94442] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-[#D8EEDF] border border-[#C2E3CD] text-[#1E5E38] rounded-xl p-3.5 text-xs font-extrabold flex items-center gap-2">
          <svg className="w-4 h-4 text-[#1E5E38] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
          <span>{success}</span>
        </div>
      )}

      {/* Form Controls */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#6B7D76]">
            Processing Method
          </label>
          <div className="relative">
            <select
              value={processingMethod}
              onChange={(e) => setProcessingMethod(e.target.value)}
              required
              className="w-full bg-white border border-[#E1E6DE] text-[#162925] font-bold text-xs rounded-xl p-3 pr-10 focus:outline-none focus:border-[#204E4A] focus:ring-2 focus:ring-[#204E4A]/20 transition-all appearance-none cursor-pointer"
            >
              <option value="" disabled>
                Select Method
              </option>
              <option value="BIOCHAR">Biochar Conversion</option>
              <option value="BIOGAS">Biogas Anaerobic Digestion</option>
              <option value="COMPOSTING">Organic Composting</option>
              <option value="RECYCLING">Material Recycling</option>
              <option value="WASTE_TO_ENERGY">Waste-to-Energy (WtE)</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-[#6B7D76]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-5 bg-[#143B36] hover:bg-[#0E2C28] disabled:opacity-50 text-[#FAFBF9] font-black text-xs uppercase tracking-wider rounded-xl shadow-sm hover:shadow transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
        >
          {loading && (
            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          <span>
            {loading ? "Calculating Offsets..." : "Calculate Carbon Impact"}
          </span>
        </button>
      </form>
    </div>
  );
};

export default CarbonImpactForm;