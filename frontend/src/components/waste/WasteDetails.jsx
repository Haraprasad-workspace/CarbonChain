import { useEffect, useRef } from "react";
import gsap from "gsap";

const WasteDetails = ({ waste }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
        }
      );
    }
  }, []);

  if (!waste) {
    return (
      <div 
        ref={containerRef}
        className="w-full p-8 bg-[#0B1610] border border-[rgba(16,185,129,0.15)] rounded-2xl text-center font-['Montserrat',sans-serif] shadow-[0_4px_16px_-2px_rgba(2,44,34,0.5)]"
      >
        <div className="w-12 h-12 rounded-2xl bg-[#12221A] border border-[rgba(16,185,129,0.30)] flex items-center justify-center mx-auto text-[#10B981] mb-3 shadow-xs">
          <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-base font-bold text-[#ECFDF5]">Waste Batch Not Found</h3>
        <p className="text-xs text-[#A7F3D0]/70 mt-1 font-medium">
          The requested batch record could not be loaded or may have been removed.
        </p>
      </div>
    );
  }

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "REGISTERED":
        return "bg-[#FFA800]/10 text-[#FFA800] border-[#FFA800]/30 shadow-[0_0_10px_rgba(255,168,0,0.15)]";
      case "MATCHED":
        return "bg-sky-500/10 text-sky-300 border-sky-500/30 shadow-[0_0_10px_rgba(14,165,233,0.15)]";
      case "COLLECTED":
      case "COMPLETED":
        return "bg-[#10B981]/10 text-[#34D399] border-[#10B981]/30 shadow-[0_0_10px_rgba(16,185,129,0.15)]";
      case "CANCELLED":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.15)]";
      default:
        return "bg-[#12221A] text-[#A7F3D0]/70 border-[rgba(16,185,129,0.15)]";
    }
  };

  return (
    <div 
      ref={containerRef}
      className="w-full bg-[#0B1610] border border-[rgba(16,185,129,0.15)] rounded-2xl shadow-[0_4px_24px_-4px_rgba(2,44,34,0.6)] p-6 sm:p-8 space-y-6 font-['Montserrat',sans-serif] text-[#ECFDF5] backdrop-blur-[16px] selection:bg-[#10B981] selection:text-[#050B07]"
    >
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(16,185,129,0.15)] pb-5">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#065F46]">
            Batch Identifier: #{waste._id ? waste._id.slice(-6) : "N/A"}
          </span>
          <h2 className="text-2xl font-black text-[#ECFDF5] capitalize tracking-tight mt-0.5">
            {waste.wasteType}
          </h2>
        </div>
        
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-extrabold border uppercase tracking-wider ${getStatusBadgeStyle(
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
        <div className="bg-[#12221A] border border-[rgba(16,185,129,0.15)] rounded-xl p-5 space-y-3 shadow-xs">
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-[#065F46] border-b border-[rgba(16,185,129,0.15)] pb-2">
            Specifications & Pricing
          </h3>
          
          <div className="space-y-2.5 text-xs font-medium">
            <div className="flex justify-between py-1">
              <span className="text-[#A7F3D0]/70 font-medium">Quantity Volume:</span>
              <span className="font-bold text-[#ECFDF5]">
                {waste.quantity?.value} {waste.quantity?.unit}
              </span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-[#A7F3D0]/70 font-medium">Quality Grade:</span>
              <span className="font-bold text-[#ECFDF5]">
                {waste.quality || "Not specified"}
              </span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-[#A7F3D0]/70 font-medium">Pricing Model:</span>
              <span className="font-bold text-[#34D399] uppercase tracking-wider">
                {waste.pricingType}
              </span>
            </div>

            {waste.askingPrice !== undefined && (
              <div className="flex justify-between py-2 text-sm border-t border-[rgba(16,185,129,0.15)] pt-2.5">
                <span className="font-extrabold text-[#ECFDF5]">Asking Price:</span>
                <span className="font-black text-[#34D399]">
                  ₹{waste.askingPrice}
                </span>
              </div>
            )}

            <div className="flex justify-between py-1 border-t border-[rgba(16,185,129,0.15)] pt-2.5">
              <span className="text-[#A7F3D0]/70 font-medium">Availability Date:</span>
              <span className="font-bold text-[#ECFDF5]">
                {waste.availabilityDate
                  ? new Date(waste.availabilityDate).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Dispatch Location Card */}
        <div className="bg-[#12221A] border border-[rgba(16,185,129,0.15)] rounded-xl p-5 space-y-3 shadow-xs">
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-[#065F46] border-b border-[rgba(16,185,129,0.15)] pb-2">
            Origin Location Details
          </h3>

          <div className="space-y-2.5 text-xs font-medium">
            <div className="flex justify-between py-1">
              <span className="text-[#A7F3D0]/70 font-medium">Address:</span>
              <span className="font-bold text-[#ECFDF5] text-right max-w-[60%]">
                {waste.location?.address || "Not specified"}
              </span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-[#A7F3D0]/70 font-medium">City:</span>
              <span className="font-bold text-[#ECFDF5]">
                {waste.location?.city || "Not specified"}
              </span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-[#A7F3D0]/70 font-medium">State & Pincode:</span>
              <span className="font-bold text-[#ECFDF5]">
                {waste.location?.state || "N/A"}{" "}
                {waste.location?.pincode ? `(${waste.location.pincode})` : ""}
              </span>
            </div>

            {(waste.location?.latitude || waste.location?.longitude) && (
              <div className="flex justify-between py-1 border-t border-[rgba(16,185,129,0.15)] pt-2.5 font-mono text-[11px]">
                <span className="text-[#A7F3D0]/70">Geo-Coordinates:</span>
                <span className="text-[#34D399] font-bold">
                  {waste.location?.latitude || "N/A"}, {waste.location?.longitude || "N/A"}
                </span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Description Panel */}
      <div className="bg-[#12221A] border border-[rgba(16,185,129,0.15)] rounded-xl p-5 space-y-2 shadow-xs">
        <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-[#065F46]">
          Batch Description
        </h3>
        <p className="text-xs text-[#A7F3D0]/90 leading-relaxed font-medium">
          {waste.description || "No description provided for this batch."}
        </p>
      </div>

      {/* Audit Timestamps */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#A7F3D0]/60 border-t border-[rgba(16,185,129,0.15)] font-medium">
        <div>
          <span>Registered On: </span>
          <span className="font-bold text-[#ECFDF5]">
            {waste.createdAt ? new Date(waste.createdAt).toLocaleDateString() : "N/A"}
          </span>
        </div>
        <div>
          <span>Last Updated: </span>
          <span className="font-bold text-[#ECFDF5]">
            {waste.updatedAt ? new Date(waste.updatedAt).toLocaleDateString() : "N/A"}
          </span>
        </div>
      </div>

    </div>
  );
};

export default WasteDetails;