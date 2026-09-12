import ShipmentStatus from "./ShipmentStatus";

const ShipmentDetails = ({ shipment }) => {
  if (!shipment) {
    return (
      <div className="bg-[#0B1610] border border-[rgba(16,185,129,0.15)] rounded-2xl p-10 text-center space-y-3 font-['Montserrat',sans-serif] shadow-[0_4px_12px_-2px_rgba(2,44,34,0.5)] backdrop-blur-[16px]">
        <div className="w-12 h-12 bg-[#12221A] border border-[rgba(16,185,129,0.30)] text-[#10B981] rounded-2xl flex items-center justify-center mx-auto text-lg font-bold">
          ?
        </div>
        <p className="text-xs font-bold text-[#065F46] uppercase tracking-wider">
          Shipment Information Unavailable
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-['Montserrat',sans-serif] text-[#ECFDF5]">
      {/* Header Bar */}
      <div className="bg-[#0B1610] border border-[rgba(16,185,129,0.15)] rounded-2xl p-6 shadow-[0_4px_12px_-2px_rgba(2,44,34,0.5)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-[16px]">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#065F46]">
            Logistics Record
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#ECFDF5] tracking-tight">
            Shipment #{shipment._id?.slice(-8) || "N/A"}
          </h2>
        </div>

        {/* Timestamps Pill Group */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
          {shipment.pickupDate && (
            <div className="bg-[#12221A] border border-[rgba(16,185,129,0.15)] px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-[#A7F3D0]">
              <span className="text-[#065F46] uppercase font-bold text-[10px]">Pickup:</span>
              <span>
                {new Date(shipment.pickupDate).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
          )}
          {shipment.deliveredDate && (
            <div className="bg-[#10B981]/10 border border-[#10B981]/30 px-3 py-1.5 rounded-xl text-[#34D399] flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <span className="text-[#10B981] uppercase font-bold text-[10px]">Delivered:</span>
              <span className="font-bold">
                {new Date(shipment.deliveredDate).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Tracking Timeline */}
        <div className="lg:col-span-1">
          <ShipmentStatus status={shipment.status} />
        </div>

        {/* Right Column: Detailed Logistics Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Waste Batch Summary */}
          <div className="bg-[#0B1610] border border-[rgba(16,185,129,0.15)] rounded-2xl p-6 shadow-[0_4px_12px_-2px_rgba(2,44,34,0.5)] space-y-4 backdrop-blur-[16px]">
            <div className="border-b border-[rgba(16,185,129,0.15)] pb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#065F46]">
                Cargo Details
              </span>
              <h3 className="text-sm font-bold text-[#ECFDF5]">
                Waste Batch Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#12221A] border border-[rgba(16,185,129,0.15)] p-3.5 rounded-xl space-y-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#065F46]">
                  Waste Type
                </span>
                <p className="text-sm font-bold text-[#ECFDF5]">
                  {shipment.wasteBatch?.wasteType || "Unspecified"}
                </p>
              </div>

              <div className="bg-[#12221A] border border-[rgba(16,185,129,0.15)] p-3.5 rounded-xl space-y-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#065F46]">
                  Total Quantity
                </span>
                <p className="text-sm font-extrabold text-[#34D399]">
                  {shipment.wasteBatch?.quantity?.value != null
                    ? `${shipment.wasteBatch.quantity.value} ${
                        shipment.wasteBatch.quantity.unit || ""
                      }`
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Pickup & Delivery Location Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Pickup Location */}
            <div className="bg-[#0B1610] border border-[rgba(16,185,129,0.15)] rounded-2xl p-6 shadow-[0_4px_12px_-2px_rgba(2,44,34,0.5)] space-y-3 backdrop-blur-[16px]">
              <div className="flex items-center gap-2 border-b border-[rgba(16,185,129,0.15)] pb-3">
                <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#ECFDF5]">
                  Pickup Address
                </h3>
              </div>

              <div className="space-y-1 text-xs">
                <p className="font-bold text-[#ECFDF5]">
                  {shipment.pickupLocation?.address || "Address not provided"}
                </p>
                <p className="text-[#A7F3D0] font-medium">
                  {shipment.pickupLocation?.city || "N/A"}
                </p>
              </div>
            </div>

            {/* Delivery Location */}
            <div className="bg-[#0B1610] border border-[rgba(16,185,129,0.15)] rounded-2xl p-6 shadow-[0_4px_12px_-2px_rgba(2,44,34,0.5)] space-y-3 backdrop-blur-[16px]">
              <div className="flex items-center gap-2 border-b border-[rgba(16,185,129,0.15)] pb-3">
                <span className="w-2 h-2 rounded-full bg-[#34D399] shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#ECFDF5]">
                  Delivery Facility
                </h3>
              </div>

              <div className="space-y-1 text-xs">
                <p className="font-bold text-[#34D399]">
                  {shipment.facility?.facilityName || "Facility not named"}
                </p>
                <p className="text-[#ECFDF5] font-medium">
                  {shipment.deliveryLocation?.address || "Address not provided"}
                </p>
                <p className="text-[#A7F3D0] font-medium">
                  {shipment.deliveryLocation?.city || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Route Metrics (If Available) */}
          {shipment.route && (
            <div className="bg-[#0B1610] border border-[rgba(16,185,129,0.15)] rounded-2xl p-6 shadow-[0_4px_12px_-2px_rgba(2,44,34,0.5)] space-y-4 backdrop-blur-[16px]">
              <div className="border-b border-[rgba(16,185,129,0.15)] pb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#065F46]">
                  Transit Analysis
                </span>
                <h3 className="text-sm font-bold text-[#ECFDF5]">
                  Route Information
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-3 bg-[#12221A] border border-[rgba(16,185,129,0.15)] p-3 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-[#052E16] text-[#34D399] flex items-center justify-center shrink-0 border border-[rgba(16,185,129,0.30)]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-[#065F46]">Distance</span>
                    <p className="font-bold text-[#ECFDF5]">{shipment.route.distance} km</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#12221A] border border-[rgba(16,185,129,0.15)] p-3 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-[#052E16] text-[#34D399] flex items-center justify-center shrink-0 border border-[rgba(16,185,129,0.30)]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-[#065F46]">Est. Travel Time</span>
                    <p className="font-bold text-[#ECFDF5]">{shipment.route.estimatedTime} mins</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Logistics Provider & Transport Details */}
          {(shipment.logisticsProvider || shipment.vehicleNumber || shipment.driverName) && (
            <div className="bg-[#0B1610] border border-[rgba(16,185,129,0.15)] rounded-2xl p-6 shadow-[0_4px_12px_-2px_rgba(2,44,34,0.5)] space-y-4 backdrop-blur-[16px]">
              <div className="border-b border-[rgba(16,185,129,0.15)] pb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#065F46]">
                  Carrier Logistics
                </span>
                <h3 className="text-sm font-bold text-[#ECFDF5]">
                  Provider & Transport Details
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {shipment.logisticsProvider && (
                  <div className="space-y-1 sm:col-span-2 bg-[#12221A] border border-[rgba(16,185,129,0.15)] p-3.5 rounded-xl">
                    <span className="text-[10px] font-extrabold uppercase text-[#065F46]">
                      Logistics Partner
                    </span>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-[#ECFDF5]">{shipment.logisticsProvider.name}</p>
                      {shipment.logisticsProvider.phone && (
                        <a
                          href={`tel:${shipment.logisticsProvider.phone}`}
                          className="text-[#D97706] hover:text-[#F59E0B] font-bold transition-colors"
                        >
                          📞 {shipment.logisticsProvider.phone}
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {shipment.vehicleNumber && (
                  <div className="space-y-0.5 bg-[#0B1610] border border-[rgba(16,185,129,0.15)] p-3 rounded-xl">
                    <span className="text-[10px] font-extrabold uppercase text-[#065F46]">
                      Vehicle No.
                    </span>
                    <p className="font-bold text-[#ECFDF5]">{shipment.vehicleNumber}</p>
                  </div>
                )}

                {shipment.driverName && (
                  <div className="space-y-0.5 bg-[#0B1610] border border-[rgba(16,185,129,0.15)] p-3 rounded-xl">
                    <span className="text-[10px] font-extrabold uppercase text-[#065F46]">
                      Assigned Driver
                    </span>
                    <p className="font-bold text-[#ECFDF5]">{shipment.driverName}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetails;