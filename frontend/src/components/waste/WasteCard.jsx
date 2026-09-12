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
        return "bg-[#FDEED9] text-[#875218] border-[#FDEED9]";
      case "MATCHED":
        return "bg-[#DBEBF7] text-[#2B6CB0] border-[#DBEBF7]";
      case "COLLECTED":
      case "COMPLETED":
        return "bg-[#D8EEDF] text-[#1E5E38] border-[#D8EEDF]";
      case "CANCELLED":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-[#E8ECE9] text-[#4F6358] border-[#E8ECE9]";
    }
  };

  return (
    <div className="bg-white border border-[#E6EDE8] rounded-2xl shadow-[0px_1px_3px_rgba(0,0,0,0.03)] hover:border-[#73A892] transition-all duration-200 overflow-hidden flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Header & Status */}
      <div className="p-5 border-b border-[#E8EFEA] space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-[#1E332B] capitalize leading-snug">
            {waste.wasteType}
          </h3>
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider border uppercase shrink-0 ${getStatusBadgeStyle(
              waste.status
            )}`}
          >
            {waste.status}
          </span>
        </div>

        {/* Quantity Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F4F6F0] border border-[#E6EDE8] rounded-lg text-xs font-semibold text-[#1E332B]">
          <svg className="w-3.5 h-3.5 text-[#143B36]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span>
            {waste.quantity?.value} {waste.quantity?.unit}
          </span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="p-5 space-y-2.5 text-xs text-[#63786E] flex-1">
        <div className="flex justify-between items-center py-0.5">
          <span className="font-semibold text-[#1E332B]">Quality:</span>
          <span className="text-[#1E332B]">{waste.quality || "Not specified"}</span>
        </div>

        <div className="flex justify-between items-center py-0.5">
          <span className="font-semibold text-[#1E332B]">Location:</span>
          <span className="text-[#1E332B]">{waste.location?.city || "Not specified"}</span>
        </div>

        <div className="flex justify-between items-center py-0.5">
          <span className="font-semibold text-[#1E332B]">Available Date:</span>
          <span className="text-[#1E332B]">
            {waste.availabilityDate
              ? new Date(waste.availabilityDate).toLocaleDateString()
              : "N/A"}
          </span>
        </div>

        <div className="flex justify-between items-center py-0.5">
          <span className="font-semibold text-[#1E332B]">Pricing Terms:</span>
          <span className="text-[#1E332B] uppercase font-medium">{waste.pricingType}</span>
        </div>

        {waste.askingPrice !== undefined && (
          <div className="flex justify-between items-center py-1 border-t border-[#E8EFEA] mt-2">
            <span className="font-bold text-[#1E332B]">Asking Price:</span>
            <span className="text-sm font-extrabold text-[#143B36]">
              ₹{waste.askingPrice}
            </span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="p-4 bg-[#F4F6F0] border-t border-[#E8EFEA] flex items-center justify-between gap-3">
        <button
          onClick={() => navigate(`/generator/waste/${waste._id}`)}
          className="flex-1 py-2.5 px-4 bg-white hover:bg-[#E4EFE9] text-[#1E3B30] border border-[#DFE6E1] hover:border-[#73A892] font-semibold text-xs rounded-xl shadow-[0px_1px_3px_rgba(0,0,0,0.03)] transition-all text-center cursor-pointer"
        >
          View Details
        </button>

        {["REGISTERED", "MATCHED"].includes(waste.status) && (
          <button
            onClick={handleCancel}
            className="py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-semibold text-xs rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default WasteCard;