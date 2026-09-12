import { useNavigate } from "react-router-dom";
import { cancelWasteBatch } from "../../services/wasteService";

const WasteCard = ({ waste, onUpdate }) => {
  const navigate = useNavigate();

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this waste batch?"
    );

    if (!confirmed) return;

    try {
      await cancelWasteBatch(waste._id);
      onUpdate();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to cancel waste batch."
      );
    }
  };

  // Helper badge color variants based on waste batch status (CarbonChain theme)
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "REGISTERED":
        return "bg-[#FFA800]/10 text-[#FFA800] border-[#FFA800]/30 shadow-[0_0_10px_rgba(255,168,0,0.15)]";
      case "MATCHED":
        return "bg-sky-500/10 text-sky-300 border-sky-500/30 shadow-[0_0_10px_rgba(14,165,233,0.15)]";
      case "COLLECTED":
      case "COMPLETED":
        return "bg-[#10B981]/10 text-[#34D399] border-[#10B981]/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]";
      case "CANCELLED":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.15)]";
      default:
        return "bg-[#12221A] text-[#A7F3D0]/70 border-[rgba(16,185,129,0.15)]";
    }
  };

  return (
    <div className="bg-[#0B1610] border border-[rgba(16,185,129,0.15)] rounded-2xl shadow-[0_4px_16px_-2px_rgba(2,44,34,0.5)] hover:border-[#10B981]/40 transition-all duration-200 overflow-hidden flex flex-col justify-between font-['Montserrat',sans-serif] text-[#ECFDF5] backdrop-blur-[16px]">
      {/* Top Header & Status */}
      <div className="p-5 border-b border-[rgba(16,185,129,0.15)] space-y-3 bg-[#12221A]/40">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-[#ECFDF5] capitalize leading-snug tracking-tight">
            {waste.wasteType}
          </h3>
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider border uppercase shrink-0 ${getStatusBadgeStyle(
              waste.status
            )}`}
          >
            {waste.status}
          </span>
        </div>

        {/* Quantity Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#12221A] border border-[rgba(16,185,129,0.2)] rounded-xl text-xs font-bold text-[#34D399] shadow-xs">
          <svg className="w-3.5 h-3.5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span>
            {waste.quantity?.value} {waste.quantity?.unit}
          </span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="p-5 space-y-3 text-xs text-[#A7F3D0]/80 flex-1 font-medium">
        <div className="flex justify-between items-center py-0.5">
          <span className="font-extrabold text-[#065F46] uppercase tracking-wider text-[10px]">Quality:</span>
          <span className="text-[#ECFDF5] font-bold">{waste.quality || "Not specified"}</span>
        </div>

        <div className="flex justify-between items-center py-0.5">
          <span className="font-extrabold text-[#065F46] uppercase tracking-wider text-[10px]">Location:</span>
          <span className="text-[#ECFDF5] font-bold">{waste.location?.city || "Not specified"}</span>
        </div>

        <div className="flex justify-between items-center py-0.5">
          <span className="font-extrabold text-[#065F46] uppercase tracking-wider text-[10px]">Available Date:</span>
          <span className="text-[#ECFDF5] font-bold">
            {waste.availabilityDate
              ? new Date(waste.availabilityDate).toLocaleDateString()
              : "N/A"}
          </span>
        </div>

        <div className="flex justify-between items-center py-0.5">
          <span className="font-extrabold text-[#065F46] uppercase tracking-wider text-[10px]">Pricing Terms:</span>
          <span className="text-[#34D399] uppercase font-bold tracking-wider">{waste.pricingType}</span>
        </div>

        {waste.askingPrice !== undefined && (
          <div className="flex justify-between items-center py-2.5 border-t border-[rgba(16,185,129,0.15)] mt-3">
            <span className="font-extrabold text-[#065F46] uppercase tracking-wider text-[10px]">Asking Price:</span>
            <span className="text-base font-black text-[#34D399]">
              ₹{waste.askingPrice}
            </span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-[#12221A]/60 border-t border-[rgba(16,185,129,0.15)] flex items-center justify-between gap-3">
        <button
          onClick={() => navigate(`/generator/waste/${waste._id}`)}
          className="flex-1 py-2.5 px-4 bg-[#12221A] hover:bg-[#10B981] text-[#ECFDF5] hover:text-[#050B07] border border-[rgba(16,185,129,0.3)] hover:border-[#10B981] font-extrabold text-xs rounded-xl shadow-xs transition-all duration-200 text-center cursor-pointer"
        >
          View Details
        </button>

        {["REGISTERED", "MATCHED"].includes(waste.status) && (
          <button
            onClick={handleCancel}
            className="py-2.5 px-4 bg-rose-500/10 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30 font-extrabold text-xs rounded-xl transition-all duration-200 cursor-pointer shadow-xs"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default WasteCard;