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
          bg: "bg-[#D8EEDF]",
          text: "text-[#1E5E38]",
          border: "border-[#C2E3CD]",
          dot: "bg-[#2E7D32]",
        };
      case "REJECTED":
      case "CANCELLED":
        return {
          bg: "bg-[#FDF2F2]",
          text: "text-[#A94442]",
          border: "border-[#F8D7DA]",
          dot: "bg-[#A94442]",
        };
      case "COUNTERED":
        return {
          bg: "bg-[#FDEED9]",
          text: "text-[#875218]",
          border: "border-[#F5DCBE]",
          dot: "bg-[#D4A373]",
        };
      case "PENDING":
      default:
        return {
          bg: "bg-[#F4F6F0]",
          text: "text-[#162925]",
          border: "border-[#E1E6DE]",
          dot: "bg-[#204E4A]",
        };
    }
  };

  const statusStyle = getStatusBadge(negotiation?.status);

  return (
    <div className="bg-[#FAFBF9] border border-[#E1E6DE] hover:border-[#73A892] rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group flex flex-col justify-between space-y-5 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Subtle Top Accent Bar on Hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#204E4A] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E1E6DE] pb-4">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#6B7D76]">
            {isGenerator ? "Facility Partner" : "Waste Generator"}
          </span>
          <h3 className="text-lg font-black text-[#162925] tracking-tight group-hover:text-[#204E4A] transition-colors">
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-[#F4F6F0] border border-[#E1E6DE] rounded-xl p-3.5">
        {/* Waste Type */}
        <div className="space-y-0.5">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7D76]">
            Waste Type
          </p>
          <p className="text-xs font-black text-[#162925] truncate">
            {waste?.wasteType || "N/A"}
          </p>
        </div>

        {/* Quantity */}
        <div className="space-y-0.5">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7D76]">
            Quantity
          </p>
          <p className="text-xs font-black text-[#162925]">
            {waste?.quantity?.value != null
              ? `${waste.quantity.value} ${waste.quantity.unit || ""}`
              : "N/A"}
          </p>
        </div>

        {/* Current Offer */}
        <div className="space-y-0.5">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7D76]">
            Current Offer
          </p>
          <p className="text-xs font-black text-[#204E4A]">
            ₹{negotiation?.currentOffer?.toLocaleString() ?? "0"}
          </p>
        </div>

        {/* Total Offers Count */}
        <div className="space-y-0.5">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7D76]">
            Offers Log
          </p>
          <p className="text-xs font-black text-[#162925]">
            {negotiation?.offers?.length || 0}{" "}
            {negotiation?.offers?.length === 1 ? "Offer" : "Offers"}
          </p>
        </div>
      </div>

      {/* Agreed Price Highlight (If Present) */}
      {negotiation?.agreedPrice !== undefined &&
        negotiation?.agreedPrice !== null && (
          <div className="flex items-center justify-between bg-[#D8EEDF] border border-[#C2E3CD] rounded-xl p-3 px-4">
            <span className="text-xs font-extrabold text-[#1E5E38] uppercase tracking-wider">
              Final Agreed Price
            </span>
            <span className="text-sm font-black text-[#1E5E38]">
              ₹{negotiation.agreedPrice.toLocaleString()}
            </span>
          </div>
        )}

      {/* Action Footer */}
      <div className="pt-2 flex justify-end">
        <button
          type="button"
          onClick={() => navigate(`/negotiations/${negotiation?._id}`)}
          className="w-full sm:w-auto px-5 py-2.5 bg-[#143B36] hover:bg-[#0E2C28] text-[#FAFBF9] font-extrabold text-xs rounded-xl shadow-none hover:shadow transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
        >
          <span>Open Negotiation</span>
          <svg
            className="w-4 h-4 text-[#FAFBF9] group-hover:translate-x-1 transition-transform"
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