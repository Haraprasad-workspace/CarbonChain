import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import useAuth from "../../hooks/useAuth";

const ShipmentCard = ({ shipment }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const cardRef = useRef(null);

  // GSAP entrance animation using CarbonChain animation config
  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }
  }, []);

  const isGenerator = user?.role === "WASTE_GENERATOR";

  const otherParty = isGenerator
    ? shipment.facility?.facilityName
    : shipment.generator?.organization || shipment.generator?.name;

  // Status Badge Styling mapped strictly to CarbonChain theme specification
  const getStatusBadge = (status) => {
    switch (status) {
      case "PICKED_UP":
      case "IN_TRANSIT":
        return {
          label: status.replace("_", " "),
          className: "bg-[#6366F1]/10 text-[#6366F1] border-[#6366F1]/30",
          dotColor: "bg-[#6366F1] animate-pulse",
        };

      case "DELIVERED":
      case "RECEIVED":
        return {
          label: "DELIVERED",
          className: "bg-[#10B981]/10 text-[#34D399] border-[#10B981]/30",
          dotColor: "bg-[#10B981]",
        };

      case "CANCELLED":
        return {
          label: "CANCELLED",
          className: "bg-rose-500/10 text-rose-400 border-rose-500/30",
          dotColor: "bg-rose-500",
        };

      case "ASSIGNED":
        return {
          label: "ASSIGNED",
          className: "bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/30",
          dotColor: "bg-[#3B82F6]",
        };

      case "PICKUP_SCHEDULED":
        return {
          label: "PICKUP SCHEDULED",
          className: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30",
          dotColor: "bg-[#F59E0B]",
        };

      case "CREATED":
      default:
        return {
          label: status?.replace("_", " ") || "CREATED",
          className: "bg-[#065F46]/20 text-[#A7F3D0] border-[rgba(16,185,129,0.15)]",
          dotColor: "bg-[#047857]",
        };
    }
  };

  const statusStyle = getStatusBadge(shipment.status);

  return (
    <div
      ref={cardRef}
      className="bg-[#0B1610] border border-[rgba(16,185,129,0.15)] hover:border-[rgba(52,211,153,0.50)] rounded-2xl p-5 sm:p-6 shadow-[0_4px_12px_-2px_rgba(2,44,34,0.5)] hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] transition-all duration-300 font-['Montserrat',sans-serif] text-[#ECFDF5] flex flex-col justify-between space-y-4 group relative overflow-hidden backdrop-blur-[16px]"
    >
      {/* Dark Forest Ambient Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/5 rounded-bl-full pointer-events-none transition-all group-hover:bg-[#34D399]/10 blur-2xl" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-[rgba(16,185,129,0.15)] pb-3.5 z-10">
        <div className="space-y-0.5 min-w-0">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#065F46]">
            {isGenerator ? "Facility Destination" : "Generator Origin"}
          </span>

          <h3 className="text-base font-bold text-[#ECFDF5] tracking-tight group-hover:text-[#34D399] transition-colors truncate">
            {otherParty || "Shipment Details"}
          </h3>
        </div>

        <div
          className={`px-2.5 py-1 border rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 ${statusStyle.className}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${statusStyle.dotColor}`}
          />
          <span>{statusStyle.label}</span>
        </div>
      </div>

      {/* Primary Details */}
      <div className="grid grid-cols-2 gap-3 text-xs z-10">
        <div className="bg-[#12221A] border border-[rgba(16,185,129,0.15)] rounded-xl p-2.5 space-y-0.5">
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#065F46]">
            Waste Material
          </span>

          <p className="font-bold text-[#ECFDF5] truncate">
            {shipment.wasteBatch?.wasteType || "Not available"}
          </p>
        </div>

        <div className="bg-[#12221A] border border-[rgba(16,185,129,0.15)] rounded-xl p-2.5 space-y-0.5">
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#065F46]">
            Batch Volume
          </span>

          <p className="font-bold text-[#ECFDF5] truncate">
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
        <div className="border-t border-[rgba(16,185,129,0.15)] pt-3 space-y-2 text-xs z-10">
          {/* Route */}
          {shipment.route && (
            <div className="flex items-center justify-between text-[#A7F3D0] font-medium">
              <span className="flex items-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5 text-[#10B981]"
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

              <span className="flex items-center gap-1.5">
                <svg
                  className="w-3.5 h-3.5 text-[#10B981]"
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
            <div className="flex items-center justify-between gap-2 text-[11px] text-[#ECFDF5] font-semibold bg-[#12221A] border border-[rgba(16,185,129,0.15)] px-2.5 py-1.5 rounded-lg">
              {shipment.vehicleNumber && (
                <span>Vehicle: {shipment.vehicleNumber}</span>
              )}

              {shipment.driverName && (
                <span className="text-[#A7F3D0] truncate">
                  Driver: {shipment.driverName}
                </span>
              )}
            </div>
          )}

          {/* Pickup Date */}
          {shipment.pickupDate && (
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#065F46] font-extrabold uppercase tracking-wide">
                Pickup Date
              </span>

              <span className="font-bold text-[#ECFDF5]">
                {new Date(shipment.pickupDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Action Button using Primary Brand Emerald + Gold Hover Accent */}
      <button
        type="button"
        onClick={() => navigate(`/shipments/${shipment._id}`)}
        className="w-full mt-2 py-2.5 px-4 bg-[#052E16] hover:bg-[#D97706] text-[#ECFDF5] hover:text-[#050B07] font-bold text-xs rounded-xl border border-[rgba(16,185,129,0.30)] hover:border-[#F59E0B] shadow-xs hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 cursor-pointer z-10"
      >
        <span>View Shipment</span>

        <svg
          className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform"
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