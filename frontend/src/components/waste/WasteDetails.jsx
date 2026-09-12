const WasteDetails = ({ waste }) => {
  if (!waste) {
    return (
      <div className="w-full p-8 bg-white border border-[#E8DDCB] rounded-2xl text-center font-['Montserrat',sans-serif]">
        <div className="w-12 h-12 rounded-2xl bg-[#FFA800]/15 flex items-center justify-center mx-auto text-[#422D0B] mb-3">
          <svg className="w-6 h-6 text-[#FFA800]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-[#422D0B]">Waste Batch Not Found</h3>
        <p className="text-xs text-[#967A53] mt-1">
          The requested batch record could not be loaded or may have been removed.
        </p>
      </div>
    );
  }

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
    <div className="w-full bg-white border border-[#E8DDCB] rounded-2xl shadow-sm p-6 sm:p-8 space-y-6 font-['Montserrat',sans-serif] text-[#422D0B] selection:bg-[#FFA800] selection:text-white">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDCB] pb-5">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#967A53]">
            Batch Identifier: #{waste._id ? waste._id.slice(-6) : "N/A"}
          </span>
          <h2 className="text-2xl font-extrabold text-[#422D0B] capitalize tracking-tight mt-0.5">
            {waste.wasteType}
          </h2>
        </div>
        
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusBadgeStyle(
              waste.status
            )}`}
          >
            {waste.status}
          </span>
        </div>
      </div>

      {/* Grid: Overview & Financials */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Specifications Card */}
        <div className="bg-[#FFFBF5] border border-[#E8DDCB] rounded-xl p-5 space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#967A53] border-b border-[#E8DDCB]/60 pb-2">
            Specifications & Pricing
          </h3>
          
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1">
              <span className="text-[#967A53] font-semibold">Quantity Volume:</span>
              <span className="font-bold text-[#422D0B]">
                {waste.quantity?.value} {waste.quantity?.unit}
              </span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-[#967A53] font-semibold">Quality Grade:</span>
              <span className="font-semibold text-[#422D0B]">
                {waste.quality || "Not specified"}
              </span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-[#967A53] font-semibold">Pricing Model:</span>
              <span className="font-semibold text-[#422D0B] uppercase">
                {waste.pricingType}
              </span>
            </div>

            {waste.askingPrice !== undefined && (
              <div className="flex justify-between py-1 text-sm border-t border-[#E8DDCB]/60 pt-2">
                <span className="font-bold text-[#422D0B]">Asking Price:</span>
                <span className="font-extrabold text-[#422D0B]">
                  ₹{waste.askingPrice}
                </span>
              </div>
            )}

            <div className="flex justify-between py-1 border-t border-[#E8DDCB]/60 pt-2">
              <span className="text-[#967A53] font-semibold">Availability Date:</span>
              <span className="font-semibold text-[#422D0B]">
                {waste.availabilityDate
                  ? new Date(waste.availabilityDate).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Dispatch Location Card */}
        <div className="bg-[#FFFBF5] border border-[#E8DDCB] rounded-xl p-5 space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#967A53] border-b border-[#E8DDCB]/60 pb-2">
            Origin Location Details
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1">
              <span className="text-[#967A53] font-semibold">Address:</span>
              <span className="font-semibold text-[#422D0B] text-right max-w-[60%]">
                {waste.location?.address || "Not specified"}
              </span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-[#967A53] font-semibold">City:</span>
              <span className="font-semibold text-[#422D0B]">
                {waste.location?.city || "Not specified"}
              </span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-[#967A53] font-semibold">State & Pincode:</span>
              <span className="font-semibold text-[#422D0B]">
                {waste.location?.state || "N/A"}{" "}
                {waste.location?.pincode ? `(${waste.location.pincode})` : ""}
              </span>
            </div>

            {(waste.location?.latitude || waste.location?.longitude) && (
              <div className="flex justify-between py-1 border-t border-[#E8DDCB]/60 pt-2 font-mono text-[11px]">
                <span className="text-[#967A53]">Geo-Coordinates:</span>
                <span className="text-[#422D0B]">
                  {waste.location?.latitude || "N/A"}, {waste.location?.longitude || "N/A"}
                </span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Description Panel */}
      <div className="bg-[#FFFBF5] border border-[#E8DDCB] rounded-xl p-5 space-y-2">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#967A53]">
          Batch Description
        </h3>
        <p className="text-xs text-[#422D0B] leading-relaxed">
          {waste.description || "No description provided for this batch."}
        </p>
      </div>

      {/* Audit Timestamps */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#967A53] border-t border-[#E8DDCB]/60">
        <div>
          <span>Registered On: </span>
          <span className="font-semibold text-[#422D0B]">
            {waste.createdAt ? new Date(waste.createdAt).toLocaleDateString() : "N/A"}
          </span>
        </div>
        <div>
          <span>Last Updated: </span>
          <span className="font-semibold text-[#422D0B]">
            {waste.updatedAt ? new Date(waste.updatedAt).toLocaleDateString() : "N/A"}
          </span>
        </div>
      </div>

    </div>
  );
};

export default WasteDetails;