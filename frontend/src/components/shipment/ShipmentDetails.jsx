import ShipmentStatus from "./ShipmentStatus";

const ShipmentDetails = ({ shipment }) => {
  if (!shipment) {
    return (
      <div className="bg-white border border-[#E8DDCB] rounded-2xl p-10 text-center space-y-3 font-['Montserrat',sans-serif]">
        <div className="w-12 h-12 bg-[#FFFBF5] border border-[#E8DDCB] text-[#FFA800] rounded-2xl flex items-center justify-center mx-auto text-lg font-black">
          ?
        </div>
        <p className="text-xs font-extrabold text-[#967A53] uppercase tracking-wider">
          Shipment Information Unavailable
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-['Montserrat',sans-serif] text-[#422D0B]">
      {/* Header Bar */}
      <div className="bg-white border border-[#E8DDCB] rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#967A53]">
            Logistics Record
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#422D0B] tracking-tight">
            Shipment #{shipment._id?.slice(-8) || "N/A"}
          </h2>
        </div>

        {/* Timestamps Pill Group */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
          {shipment.pickupDate && (
            <div className="bg-[#FFFBF5] border border-[#E8DDCB] px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <span className="text-[#967A53]">Pickup:</span>
              <span className="text-[#422D0B]">
                {new Date(shipment.pickupDate).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
          )}
          {shipment.deliveredDate && (
            <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-emerald-900 flex items-center gap-1.5">
              <span className="text-emerald-700">Delivered:</span>
              <span className="font-extrabold">
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
          <div className="bg-white border border-[#E8DDCB] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="border-b border-[#E8DDCB] pb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#967A53]">
                Cargo Cargo Details
              </span>
              <h3 className="text-sm font-black text-[#422D0B]">
                Waste Batch Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#FFFBF5] border border-[#E8DDCB]/60 p-3.5 rounded-xl space-y-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#967A53]">
                  Waste Type
                </span>
                <p className="text-sm font-black text-[#422D0B]">
                  {shipment.wasteBatch?.wasteType || "Unspecified"}
                </p>
              </div>

              <div className="bg-[#FFFBF5] border border-[#E8DDCB]/60 p-3.5 rounded-xl space-y-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#967A53]">
                  Total Quantity
                </span>
                <p className="text-sm font-black text-[#FFA800]">
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
            <div className="bg-white border border-[#E8DDCB] rounded-2xl p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 border-b border-[#E8DDCB] pb-3">
                <span className="w-2 h-2 rounded-full bg-[#FFA800]" />
                <h3 className="text-xs font-black uppercase tracking-wider text-[#422D0B]">
                  Pickup Address
                </h3>
              </div>

              <div className="space-y-1 text-xs">
                <p className="font-extrabold text-[#422D0B]">
                  {shipment.pickupLocation?.address || "Address not provided"}
                </p>
                <p className="text-[#967A53] font-medium">
                  {shipment.pickupLocation?.city || "N/A"}
                </p>
              </div>
            </div>

            {/* Delivery Location */}
            <div className="bg-white border border-[#E8DDCB] rounded-2xl p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 border-b border-[#E8DDCB] pb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <h3 className="text-xs font-black uppercase tracking-wider text-[#422D0B]">
                  Delivery Facility
                </h3>
              </div>

              <div className="space-y-1 text-xs">
                <p className="font-extrabold text-[#422D0B]">
                  {shipment.facility?.facilityName || "Facility not named"}
                </p>
                <p className="text-[#422D0B] font-medium">
                  {shipment.deliveryLocation?.address || "Address not provided"}
                </p>
                <p className="text-[#967A53] font-medium">
                  {shipment.deliveryLocation?.city || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Route Metrics (If Available) */}
          {shipment.route && (
            <div className="bg-white border border-[#E8DDCB] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="border-b border-[#E8DDCB] pb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#967A53]">
                  Transit Analysis
                </span>
                <h3 className="text-sm font-black text-[#422D0B]">
                  Route Information
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-3 bg-[#FFFBF5] border border-[#E8DDCB]/60 p-3 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-[#FFA800]/15 text-[#FFA800] flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-[#967A53]">Distance</span>
                    <p className="font-black text-[#422D0B]">{shipment.route.distance} km</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#FFFBF5] border border-[#E8DDCB]/60 p-3 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-[#FFA800]/15 text-[#FFA800] flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-[#967A53]">Est. Travel Time</span>
                    <p className="font-black text-[#422D0B]">{shipment.route.estimatedTime} mins</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Logistics Provider & Transport Details */}
          {(shipment.logisticsProvider || shipment.vehicleNumber || shipment.driverName) && (
            <div className="bg-white border border-[#E8DDCB] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="border-b border-[#E8DDCB] pb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#967A53]">
                  Carrier Logistics
                </span>
                <h3 className="text-sm font-black text-[#422D0B]">
                  Provider & Transport Details
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {shipment.logisticsProvider && (
                  <div className="space-y-1 sm:col-span-2 bg-[#FFFBF5] border border-[#E8DDCB]/60 p-3.5 rounded-xl">
                    <span className="text-[10px] font-extrabold uppercase text-[#967A53]">
                      Logistics Partner
                    </span>
                    <div className="flex items-center justify-between">
                      <p className="font-black text-[#422D0B]">{shipment.logisticsProvider.name}</p>
                      {shipment.logisticsProvider.phone && (
                        <a
                          href={`tel:${shipment.logisticsProvider.phone}`}
                          className="text-[#FFA800] hover:text-[#FFC24A] font-extrabold transition-colors"
                        >
                          📞 {shipment.logisticsProvider.phone}
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {shipment.vehicleNumber && (
                  <div className="space-y-0.5 bg-white border border-[#E8DDCB] p-3 rounded-xl">
                    <span className="text-[10px] font-extrabold uppercase text-[#967A53]">
                      Vehicle No.
                    </span>
                    <p className="font-black text-[#422D0B]">{shipment.vehicleNumber}</p>
                  </div>
                )}

                {shipment.driverName && (
                  <div className="space-y-0.5 bg-white border border-[#E8DDCB] p-3 rounded-xl">
                    <span className="text-[10px] font-extrabold uppercase text-[#967A53]">
                      Assigned Driver
                    </span>
                    <p className="font-black text-[#422D0B]">{shipment.driverName}</p>
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