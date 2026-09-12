import ShipmentStatus from "./ShipmentStatus";

const ShipmentDetails = ({ shipment }) => {
  if (!shipment) {
    return (
      <div className="bg-white border border-[#E6EDE8] rounded-2xl p-10 text-center space-y-3 font-['Plus_Jakarta_Sans',sans-serif] shadow-[0px_1px_3px_rgba(0,0,0,0.03)]">
        <div className="w-12 h-12 bg-[#F4F6F0] border border-[#E6EDE8] text-[#143B36] rounded-2xl flex items-center justify-center mx-auto text-lg font-bold">
          ?
        </div>
        <p className="text-xs font-bold text-[#8EA097] uppercase tracking-wider">
          Shipment Information Unavailable
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif] text-[#1E332B]">
      {/* Header Bar */}
      <div className="bg-white border border-[#E6EDE8] rounded-2xl p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#63786E]">
            Logistics Record
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E332B] tracking-tight">
            Shipment #{shipment._id?.slice(-8) || "N/A"}
          </h2>
        </div>

        {/* Timestamps Pill Group */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
          {shipment.pickupDate && (
            <div className="bg-[#F4F6F0] border border-[#DFE6E1] px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <span className="text-[#63786E]">Pickup:</span>
              <span className="text-[#1E332B]">
                {new Date(shipment.pickupDate).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
          )}
          {shipment.deliveredDate && (
            <div className="bg-[#D8EEDF] border border-[#D8EEDF] px-3 py-1.5 rounded-xl text-[#1E5E38] flex items-center gap-1.5">
              <span className="text-[#1E5E38]">Delivered:</span>
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
          <div className="bg-white border border-[#E6EDE8] rounded-2xl p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.03)] space-y-4">
            <div className="border-b border-[#E8EFEA] pb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#63786E]">
                Cargo Details
              </span>
              <h3 className="text-sm font-bold text-[#1E332B]">
                Waste Batch Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#F4F6F0] border border-[#DFE6E1] p-3.5 rounded-xl space-y-0.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8EA097]">
                  Waste Type
                </span>
                <p className="text-sm font-bold text-[#1E332B]">
                  {shipment.wasteBatch?.wasteType || "Unspecified"}
                </p>
              </div>

              <div className="bg-[#F4F6F0] border border-[#DFE6E1] p-3.5 rounded-xl space-y-0.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8EA097]">
                  Total Quantity
                </span>
                <p className="text-sm font-extrabold text-[#143B36]">
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
            <div className="bg-white border border-[#E6EDE8] rounded-2xl p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.03)] space-y-3">
              <div className="flex items-center gap-2 border-b border-[#E8EFEA] pb-3">
                <span className="w-2 h-2 rounded-full bg-[#73A892]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E332B]">
                  Pickup Address
                </h3>
              </div>

              <div className="space-y-1 text-xs">
                <p className="font-bold text-[#1E332B]">
                  {shipment.pickupLocation?.address || "Address not provided"}
                </p>
                <p className="text-[#63786E] font-medium">
                  {shipment.pickupLocation?.city || "N/A"}
                </p>
              </div>
            </div>

            {/* Delivery Location */}
            <div className="bg-white border border-[#E6EDE8] rounded-2xl p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.03)] space-y-3">
              <div className="flex items-center gap-2 border-b border-[#E8EFEA] pb-3">
                <span className="w-2 h-2 rounded-full bg-[#2D6B4E]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E332B]">
                  Delivery Facility
                </h3>
              </div>

              <div className="space-y-1 text-xs">
                <p className="font-bold text-[#1E332B]">
                  {shipment.facility?.facilityName || "Facility not named"}
                </p>
                <p className="text-[#1E332B] font-medium">
                  {shipment.deliveryLocation?.address || "Address not provided"}
                </p>
                <p className="text-[#63786E] font-medium">
                  {shipment.deliveryLocation?.city || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Route Metrics (If Available) */}
          {shipment.route && (
            <div className="bg-white border border-[#E6EDE8] rounded-2xl p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.03)] space-y-4">
              <div className="border-b border-[#E8EFEA] pb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#63786E]">
                  Transit Analysis
                </span>
                <h3 className="text-sm font-bold text-[#1E332B]">
                  Route Information
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-3 bg-[#F4F6F0] border border-[#DFE6E1] p-3 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-[#DCE9DF] text-[#143B36] flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase text-[#8EA097]">Distance</span>
                    <p className="font-bold text-[#1E332B]">{shipment.route.distance} km</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-[#F4F6F0] border border-[#DFE6E1] p-3 rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-[#DCE9DF] text-[#143B36] flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase text-[#8EA097]">Est. Travel Time</span>
                    <p className="font-bold text-[#1E332B]">{shipment.route.estimatedTime} mins</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Logistics Provider & Transport Details */}
          {(shipment.logisticsProvider || shipment.vehicleNumber || shipment.driverName) && (
            <div className="bg-white border border-[#E6EDE8] rounded-2xl p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.03)] space-y-4">
              <div className="border-b border-[#E8EFEA] pb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#63786E]">
                  Carrier Logistics
                </span>
                <h3 className="text-sm font-bold text-[#1E332B]">
                  Provider & Transport Details
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {shipment.logisticsProvider && (
                  <div className="space-y-1 sm:col-span-2 bg-[#F4F6F0] border border-[#DFE6E1] p-3.5 rounded-xl">
                    <span className="text-[10px] font-semibold uppercase text-[#8EA097]">
                      Logistics Partner
                    </span>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-[#1E332B]">{shipment.logisticsProvider.name}</p>
                      {shipment.logisticsProvider.phone && (
                        <a
                          href={`tel:${shipment.logisticsProvider.phone}`}
                          className="text-[#143B36] hover:text-[#0D2925] font-bold transition-colors"
                        >
                          📞 {shipment.logisticsProvider.phone}
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {shipment.vehicleNumber && (
                  <div className="space-y-0.5 bg-white border border-[#E6EDE8] p-3 rounded-xl">
                    <span className="text-[10px] font-semibold uppercase text-[#8EA097]">
                      Vehicle No.
                    </span>
                    <p className="font-bold text-[#1E332B]">{shipment.vehicleNumber}</p>
                  </div>
                )}

                {shipment.driverName && (
                  <div className="space-y-0.5 bg-white border border-[#E6EDE8] p-3 rounded-xl">
                    <span className="text-[10px] font-semibold uppercase text-[#8EA097]">
                      Assigned Driver
                    </span>
                    <p className="font-bold text-[#1E332B]">{shipment.driverName}</p>
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