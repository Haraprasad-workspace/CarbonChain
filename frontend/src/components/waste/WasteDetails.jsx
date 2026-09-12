const WasteDetails = ({ waste }) => {
  if (!waste) {
    return (
      <div className="w-full p-8 bg-white border border-[#E6EDE8] rounded-2xl text-center font-['Plus_Jakarta_Sans',sans-serif] shadow-[0px_1px_3px_rgba(0,0,0,0.03)]">
        <div className="w-12 h-12 rounded-2xl bg-[#DCE9DF] flex items-center justify-center mx-auto text-[#1E3B30] mb-3">
          <svg className="w-6 h-6 text-[#143B36]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-[#1E332B]">Waste Batch Not Found</h3>
        <p className="text-xs text-[#63786E] mt-1 font-medium">
          The requested batch record could not be loaded or may have been removed.
        </p>
      </div>
    );
  }

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
    <div className="w-full bg-white border border-[#E6EDE8] rounded-2xl shadow-[0px_1px_3px_rgba(0,0,0,0.03),0px_4px_12px_rgba(22,41,37,0.03)] p-6 sm:p-8 space-y-6 font-['Plus_Jakarta_Sans',sans-serif] text-[#1E332B] selection:bg-[#143B36] selection:text-white">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8EFEA] pb-5">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#63786E]">
            Batch Identifier: #{waste._id ? waste._id.slice(-6) : "N/A"}
          </span>
          <h2 className="text-2xl font-extrabold text-[#1E332B] capitalize tracking-tight mt-0.5">
            {waste.wasteType}
          </h2>
        </div>
        
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border uppercase tracking-wider ${getStatusBadgeStyle(
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
        <div className="bg-[#F4F6F0] border border-[#E6EDE8] rounded-xl p-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#63786E] border-b border-[#E8EFEA] pb-2">
            Specifications & Pricing
          </h3>
          
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1">
              <span className="text-[#63786E] font-medium">Quantity Volume:</span>
              <span className="font-bold text-[#1E332B]">
                {waste.quantity?.value} {waste.quantity?.unit}
              </span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-[#63786E] font-medium">Quality Grade:</span>
              <span className="font-semibold text-[#1E332B]">
                {waste.quality || "Not specified"}
              </span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-[#63786E] font-medium">Pricing Model:</span>
              <span className="font-semibold text-[#1E332B] uppercase">
                {waste.pricingType}
              </span>
            </div>

            {waste.askingPrice !== undefined && (
              <div className="flex justify-between py-1 text-sm border-t border-[#E8EFEA] pt-2">
                <span className="font-bold text-[#1E332B]">Asking Price:</span>
                <span className="font-extrabold text-[#143B36]">
                  ₹{waste.askingPrice}
                </span>
              </div>
            )}

            <div className="flex justify-between py-1 border-t border-[#E8EFEA] pt-2">
              <span className="text-[#63786E] font-medium">Availability Date:</span>
              <span className="font-semibold text-[#1E332B]">
                {waste.availabilityDate
                  ? new Date(waste.availabilityDate).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Dispatch Location Card */}
        <div className="bg-[#F4F6F0] border border-[#E6EDE8] rounded-xl p-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#63786E] border-b border-[#E8EFEA] pb-2">
            Origin Location Details
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1">
              <span className="text-[#63786E] font-medium">Address:</span>
              <span className="font-semibold text-[#1E332B] text-right max-w-[60%]">
                {waste.location?.address || "Not specified"}
              </span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-[#63786E] font-medium">City:</span>
              <span className="font-semibold text-[#1E332B]">
                {waste.location?.city || "Not specified"}
              </span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-[#63786E] font-medium">State & Pincode:</span>
              <span className="font-semibold text-[#1E332B]">
                {waste.location?.state || "N/A"}{" "}
                {waste.location?.pincode ? `(${waste.location.pincode})` : ""}
              </span>
            </div>

            {(waste.location?.latitude || waste.location?.longitude) && (
              <div className="flex justify-between py-1 border-t border-[#E8EFEA] pt-2 font-mono text-[11px]">
                <span className="text-[#63786E]">Geo-Coordinates:</span>
                <span className="text-[#1E332B]">
                  {waste.location?.latitude || "N/A"}, {waste.location?.longitude || "N/A"}
                </span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Description Panel */}
      <div className="bg-[#F4F6F0] border border-[#E6EDE8] rounded-xl p-5 space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#63786E]">
          Batch Description
        </h3>
        <p className="text-xs text-[#1E332B] leading-relaxed">
          {waste.description || "No description provided for this batch."}
        </p>
      </div>

      {/* Audit Timestamps */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#8EA097] border-t border-[#E8EFEA]">
        <div>
          <span>Registered On: </span>
          <span className="font-semibold text-[#1E332B]">
            {waste.createdAt ? new Date(waste.createdAt).toLocaleDateString() : "N/A"}
          </span>
        </div>
        <div>
          <span>Last Updated: </span>
          <span className="font-semibold text-[#1E332B]">
            {waste.updatedAt ? new Date(waste.updatedAt).toLocaleDateString() : "N/A"}
          </span>
        </div>
      </div>

    </div>
  );
};

export default WasteDetails;