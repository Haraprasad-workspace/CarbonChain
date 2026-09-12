import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const ShipmentCard = ({ shipment }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isGenerator = user?.role === "WASTE_GENERATOR";

  const otherParty = isGenerator
    ? shipment.facility?.facilityName
    : shipment.generator?.organization || shipment.generator?.name;

  // Status Styling Configuration
  const getStatusBadge = (status) => {
    switch (status) {
      case "PICKED_UP":
      case "IN_TRANSIT":
        return {
          label: status.replace("_", " "),
          className: "bg-[#FFA800]/15 text-[#422D0B] border-[#FFA800]/40",
          dotColor: "bg-[#FFA800] animate-pulse",
        };
      case "DELIVERED":
      case "COMPLETED":
        return {
          label: status.replace("_", " "),
          className: "bg-emerald-50 text-emerald-800 border-emerald-300",
          dotColor: "bg-emerald-500",
        };
      case "CANCELLED":
        return {
          label: status.replace("_", " "),
          className: "bg-rose-50 text-rose-800 border-rose-300",
          dotColor: "bg-rose-500",
        };
      default:
        return {
          label: status?.replace("_", " ") || "SCHEDULED",
          className: "bg-[#FFFBF5] text-[#422D0B] border-[#E8DDCB]",
          dotColor: "bg-[#967A53]",
        };
    }
  };

  const statusStyle = getStatusBadge(shipment.status);

  return (
    <div className="bg-white border border-[#E8DDCB] hover:border-[#FFA800]/60 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300 font-['Montserrat',sans-serif] text-[#422D0B] flex flex-col justify-between space-y-4 group">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-[#E8DDCB] pb-3">
        <div className="space-y-0.5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#967A53]">
            {isGenerator ? "Facility Destination" : "Generator Origin"}
          </span>
          <h3 className="text-base font-black text-[#422D0B] tracking-tight group-hover:text-[#FFA800] transition-colors">
            {otherParty || "Shipment Details"}
          </h3>
        </div>

        {/* Status Badge */}
        <div
          className={`px-2.5 py-1 border rounded-full text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 shrink-0 ${statusStyle.className}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dotColor}`} />
          <span>{statusStyle.label}</span>
        </div>
      </div>

      {/* Primary Details Grid */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        {/* Waste Batch Info */}
        <div className="bg-[#FFFBF5] border border-[#E8DDCB]/60 rounded-xl p-2.5 space-y-0.5">
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#967A53]">
            Waste Material
          </span>
          <p className="font-extrabold text-[#422D0B] truncate">
            {shipment.wasteBatch?.wasteType || "Not available"}
          </p>
        </div>

        {/* Quantity Info */}
        <div className="bg-[#FFFBF5] border border-[#E8DDCB]/60 rounded-xl p-2.5 space-y-0.5">
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#967A53]">
            Batch Volume
          </span>
          <p className="font-extrabold text-[#422D0B] truncate">
            {shipment.wasteBatch?.quantity?.value != null
              ? `${shipment.wasteBatch.quantity.value} ${shipment.wasteBatch.quantity.unit || ""}`
              : "N/A"}
          </p>
        </div>
      </div>

      {/* Transit Logistics Meta (Optional) */}
      {(shipment.route || shipment.vehicleNumber || shipment.driverName) && (
        <div className="border-t border-[#E8DDCB]/60 pt-3 space-y-2 text-xs">
          {/* Route Metrics */}
          {shipment.route && (
            <div className="flex items-center justify-between text-[#967A53] font-semibold">
              <span className="flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5 text-[#FFA800]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {shipment.route.distance} km
              </span>
              <span className="flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5 text-[#FFA800]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                ~{shipment.route.estimatedTime} mins
              </span>
            </div>
          )}

          {/* Vehicle & Driver Info */}
          {(shipment.vehicleNumber || shipment.driverName) && (
            <div className="flex items-center justify-between text-[11px] text-[#422D0B] font-bold bg-white border border-[#E8DDCB]/40 px-2.5 py-1.5 rounded-lg">
              {shipment.vehicleNumber && (
                <span>Vehicle: {shipment.vehicleNumber}</span>
              )}
              {shipment.driverName && (
                <span className="text-[#967A53]">Driver: {shipment.driverName}</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Action Footer */}
      <button
        type="button"
        onClick={() => navigate(`/shipments/${shipment._id}`)}
        className="w-full mt-2 py-2.5 px-4 bg-[#FFA800] hover:bg-[#FFC24A] text-[#422D0B] font-extrabold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
      >
        <span>View Shipment</span>
        <svg
          className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
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
  );
};

export default ShipmentCard;