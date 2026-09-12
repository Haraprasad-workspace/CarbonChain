import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const NegotiationCard = ({ negotiation }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isGenerator = user?.role === "WASTE_GENERATOR";

  const facility = negotiation?.facility;
  const waste = negotiation?.wasteBatch;

  // Dynamic Status Badge Styling
  const getStatusBadge = (status) => {
    switch (status) {
      case "ACCEPTED":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-800",
          border: "border-emerald-200",
          dot: "bg-emerald-500",
        };
      case "REJECTED":
      case "CANCELLED":
        return {
          bg: "bg-rose-50",
          text: "text-rose-800",
          border: "border-rose-200",
          dot: "bg-rose-500",
        };
      case "COUNTERED":
        return {
          bg: "bg-amber-50",
          text: "text-amber-900",
          border: "border-amber-200",
          dot: "bg-amber-500",
        };
      case "PENDING":
      default:
        return {
          bg: "bg-[#FFFBF5]",
          text: "text-[#422D0B]",
          border: "border-[#E8DDCB]",
          dot: "bg-[#FFA800]",
        };
    }
  };

  const statusStyle = getStatusBadge(negotiation?.status);

  return (
    <div className="bg-white border border-[#E8DDCB] hover:border-[#FFA800] rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden group flex flex-col justify-between space-y-5">
      {/* Subtle Top Accent Bar on Hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#FFA800] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8DDCB] pb-4">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#967A53]">
            {isGenerator ? "Facility Partner" : "Waste Generator"}
          </span>
          <h3 className="text-lg font-black text-[#422D0B] tracking-tight group-hover:text-[#FFA800] transition-colors">
            {isGenerator
              ? facility?.facilityName || "Facility Partner"
              : negotiation?.generator?.organization ||
                negotiation?.generator?.name ||
                "Generator Partner"}
          </h3>
        </div>

        {/* Status Badge */}
        <div
          className={`self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
        >
          <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
          <span>{negotiation?.status || "PENDING"}</span>
        </div>
      </div>

      {/* Key Metric Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#FFFBF5] border border-[#E8DDCB] rounded-xl p-3.5">
        {/* Waste Type */}
        <div className="space-y-0.5">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#967A53]">
            Waste Type
          </p>
          <p className="text-xs font-black text-[#422D0B] truncate">
            {waste?.wasteType || "N/A"}
          </p>
        </div>

        {/* Quantity */}
        <div className="space-y-0.5">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#967A53]">
            Quantity
          </p>
          <p className="text-xs font-black text-[#422D0B]">
            {waste?.quantity?.value != null
              ? `${waste.quantity.value} ${waste.quantity.unit || ""}`
              : "N/A"}
          </p>
        </div>

        {/* Current Offer */}
        <div className="space-y-0.5">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#967A53]">
            Current Offer
          </p>
          <p className="text-xs font-black text-[#FFA800]">
            ₹{negotiation?.currentOffer?.toLocaleString() ?? "0"}
          </p>
        </div>

        {/* Total Offers Count */}
        <div className="space-y-0.5">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#967A53]">
            Offers Log
          </p>
          <p className="text-xs font-black text-[#422D0B]">
            {negotiation?.offers?.length || 0}{" "}
            {negotiation?.offers?.length === 1 ? "Offer" : "Offers"}
          </p>
        </div>
      </div>

      {/* Agreed Price Highlight (If Present) */}
      {negotiation?.agreedPrice !== undefined &&
        negotiation?.agreedPrice !== null && (
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-3 px-4">
            <span className="text-xs font-extrabold text-emerald-900 uppercase tracking-wider">
              Final Agreed Price
            </span>
            <span className="text-sm font-black text-emerald-700">
              ₹{negotiation.agreedPrice.toLocaleString()}
            </span>
          </div>
        )}

      {/* Action Footer */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={() => navigate(`/negotiations/${negotiation?._id}`)}
          className="w-full sm:w-auto px-5 py-2.5 bg-[#FFA800] hover:bg-[#FFC24A] text-[#422D0B] font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
        >
          <span>Open Negotiation</span>
          <svg
            className="w-4 h-4 text-[#422D0B] group-hover:translate-x-1 transition-transform"
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
        </button>
      </div>
    </div>
  );
};

export default NegotiationCard;