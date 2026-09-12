import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const ShipmentCard = ({ shipment }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isGenerator = user?.role === "WASTE_GENERATOR";

  const otherParty = isGenerator
    ? shipment.facility?.facilityName
    : shipment.generator?.organization || shipment.generator?.name;

  const getStatusBadge = (status) => {
    switch (status) {
      case "PICKED_UP":
      case "IN_TRANSIT":
        return {
          label: status.replace("_", " "),
          className: "bg-[#FDEED9] text-[#875218] border-[#FDEED9]",
          dotColor: "bg-[#875218] animate-pulse",
        };

      case "DELIVERED":
        return {
          label: "DELIVERED",
          className: "bg-[#D8EEDF] text-[#1E5E38] border-[#D8EEDF]",
          dotColor: "bg-[#2D6B4E]",
        };

      case "CANCELLED":
        return {
          label: "CANCELLED",
          className: "bg-rose-50 text-rose-800 border-rose-200",
          dotColor: "bg-rose-500",
        };

      case "ASSIGNED":
        return {
          label: "ASSIGNED",
          className: "bg-blue-50 text-blue-800 border-blue-200",
          dotColor: "bg-blue-500",
        };

      case "PICKUP_SCHEDULED":
        return {
          label: "PICKUP SCHEDULED",
          className: "bg-purple-50 text-purple-800 border-purple-200",
          dotColor: "bg-purple-500",
        };

      case "CREATED":
      default:
        return {
          label: status?.replace("_", " ") || "CREATED",
          className: "bg-[#E8ECE9] text-[#4F6358] border-[#DFE6E1]",
          dotColor: "bg-[#8EA097]",
        };
    }
  };

  const statusStyle = getStatusBadge(shipment.status);

  return (
    <div className="bg-white border border-[#E6EDE8] hover:border-[#73A892] rounded-2xl p-5 sm:p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0px_4px_12px_rgba(22,41,37,0.03)] transition-all duration-300 font-['Plus_Jakarta_Sans',sans-serif] text-[#1E332B] flex flex-col justify-between space-y-4 group">

      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-[#E8EFEA] pb-3">
        <div className="space-y-0.5 min-w-0">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#63786E]">
            {isGenerator ? "Facility Destination" : "Generator Origin"}
          </span>

          <h3 className="text-base font-bold text-[#1E332B] tracking-tight group-hover:text-[#143B36] transition-colors truncate">
            {otherParty || "Shipment Details"}
          </h3>
        </div>

        <div
          className={`px-2.5 py-1 border rounded-full text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5 shrink-0 ${statusStyle.className}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${statusStyle.dotColor}`}
          />
          <span>{statusStyle.label}</span>
        </div>
      </div>

      {/* Primary Details */}
      <div className="grid grid-cols-2 gap-3 text-xs">

        <div className="bg-[#F4F6F0] border border-[#E6EDE8] rounded-xl p-2.5 space-y-0.5">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-[#8EA097]">
            Waste Material
          </span>

          <p className="font-bold text-[#1E332B] truncate">
            {shipment.wasteBatch?.wasteType || "Not available"}
          </p>
        </div>

        <div className="bg-[#F4F6F0] border border-[#E6EDE8] rounded-xl p-2.5 space-y-0.5">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-[#8EA097]">
            Batch Volume
          </span>

          <p className="font-bold text-[#1E332B] truncate">
            {shipment.wasteBatch?.quantity?.value != null
              ? `${shipment.wasteBatch.quantity.value} ${
                  shipment.wasteBatch.quantity.unit || ""
                }`
              : "N/A"}
          </p>
        </div>
      </div>

      {/* Logistics Information */}
      {(shipment.route ||
        shipment.vehicleNumber ||
        shipment.driverName ||
        shipment.pickupDate) && (
        <div className="border-t border-[#E8EFEA] pt-3 space-y-2 text-xs">

          {/* Route */}
          {shipment.route && (
            <div className="flex items-center justify-between text-[#63786E] font-medium">
              <span className="flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5 text-[#2D6357]"
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

                {shipment.route.distance ?? "—"} km
              </span>

              <span className="flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5 text-[#2D6357]"
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

                ~{shipment.route.estimatedTime ?? "—"} mins
              </span>
            </div>
          )}

          {/* Vehicle / Driver */}
          {(shipment.vehicleNumber || shipment.driverName) && (
            <div className="flex items-center justify-between gap-2 text-[11px] text-[#1E332B] font-semibold bg-[#F4F6F0] border border-[#E6EDE8] px-2.5 py-1.5 rounded-lg">
              {shipment.vehicleNumber && (
                <span>Vehicle: {shipment.vehicleNumber}</span>
              )}

              {shipment.driverName && (
                <span className="text-[#63786E] truncate">
                  Driver: {shipment.driverName}
                </span>
              )}
            </div>
          )}

          {/* Pickup Date */}
          {shipment.pickupDate && (
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#8EA097] font-semibold uppercase tracking-wide">
                Pickup
              </span>

              <span className="font-bold text-[#1E332B]">
                {new Date(shipment.pickupDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Action */}
      <button
        type="button"
        onClick={() => navigate(`/shipments/${shipment._id}`)}
        className="w-full mt-2 py-2.5 px-4 bg-[#143B36] hover:bg-[#0D2925] text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
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