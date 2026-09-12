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

  // Helper badge color variants based on waste batch status
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "REGISTERED":
        return "bg-amber-100 text-amber-900 border-amber-300";
      case "MATCHED":
        return "bg-blue-100 text-blue-900 border-blue-300";
      case "COLLECTED":
      case "COMPLETED":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="bg-white border border-[#E8DDCB] rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between font-['Montserrat',sans-serif]">
      {/* Top Header & Status */}
      <div className="p-5 border-b border-[#E8DDCB]/60 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-[#422D0B] capitalize leading-snug">
            {waste.wasteType}
          </h3>
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold tracking-wider border uppercase shrink-0 ${getStatusBadgeStyle(
              waste.status
            )}`}
          >
            {waste.status}
          </span>
        </div>

        {/* Quantity Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFFBF5] border border-[#E8DDCB] rounded-lg text-xs font-semibold text-[#422D0B]">
          <svg className="w-3.5 h-3.5 text-[#FFA800]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span>
            {waste.quantity?.value} {waste.quantity?.unit}
          </span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="p-5 space-y-2.5 text-xs text-[#967A53] flex-1">
        <div className="flex justify-between items-center py-0.5">
          <span className="font-semibold text-[#422D0B]">Quality:</span>
          <span className="text-[#422D0B]">{waste.quality || "Not specified"}</span>
        </div>

        <div className="flex justify-between items-center py-0.5">
          <span className="font-semibold text-[#422D0B]">Location:</span>
          <span className="text-[#422D0B]">{waste.location?.city || "Not specified"}</span>
        </div>

        <div className="flex justify-between items-center py-0.5">
          <span className="font-semibold text-[#422D0B]">Available Date:</span>
          <span className="text-[#422D0B]">
            {waste.availabilityDate
              ? new Date(waste.availabilityDate).toLocaleDateString()
              : "N/A"}
          </span>
        </div>

        <div className="flex justify-between items-center py-0.5">
          <span className="font-semibold text-[#422D0B]">Pricing Terms:</span>
          <span className="text-[#422D0B] uppercase font-medium">{waste.pricingType}</span>
        </div>

        {waste.askingPrice !== undefined && (
          <div className="flex justify-between items-center py-1 border-t border-[#E8DDCB]/40 mt-2">
            <span className="font-bold text-[#422D0B]">Asking Price:</span>
            <span className="text-sm font-extrabold text-[#422D0B]">
              ₹{waste.askingPrice}
            </span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-[#FFFBF5] border-t border-[#E8DDCB]/60 flex items-center justify-between gap-3">
        <button
          onClick={() => navigate(`/generator/waste/${waste._id}`)}
          className="flex-1 py-2.5 px-4 bg-white hover:bg-[#FFA800] text-[#422D0B] border border-[#E8DDCB] hover:border-[#FFA800] font-bold text-xs rounded-xl shadow-sm transition-all text-center"
        >
          View Details
        </button>

        {["REGISTERED", "MATCHED"].includes(waste.status) && (
          <button
            onClick={handleCancel}
            className="py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs rounded-xl transition-all"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default WasteCard;