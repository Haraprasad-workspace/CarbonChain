const CarbonCard = ({ record }) => {
  return (
    <div className="bg-[#FAFBF9] border border-[#E1E6DE] hover:border-[#73A892] rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 font-['Plus_Jakarta_Sans',sans-serif] text-[#162925] flex flex-col justify-between space-y-4 group">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-[#E1E6DE] pb-3">
        <div className="space-y-0.5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#6B7D76]">
            Processed Waste Type
          </span>
          <h3 className="text-base font-black text-[#162925] tracking-tight group-hover:text-[#204E4A] transition-colors">
            {record.wasteType || "Waste"}
          </h3>
        </div>

        {/* Impact Badge */}
        <div className="px-2.5 py-1 bg-[#D8EEDF] border border-[#C2E3CD] rounded-full text-[10px] font-extrabold uppercase tracking-wider text-[#1E5E38] flex items-center gap-1 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />
          <span>Eco Impact</span>
        </div>
      </div>

      {/* Primary Hero Metric: CO2e Avoided */}
      <div className="bg-[#F4F6F0] border border-[#E1E6DE] rounded-xl p-3.5 flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#6B7D76]">
            CO₂ Equivalent Avoided
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-[#162925]">
              {record.co2eAvoided ?? 0}
            </span>
            <span className="text-xs font-black text-[#204E4A]">TON</span>
          </div>
        </div>

        <div className="w-9 h-9 rounded-xl bg-[#D2E7D6] text-[#204E4A] flex items-center justify-center shrink-0">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
        </div>
      </div>

      {/* Operational Details Grid */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        {/* Quantity */}
        <div className="bg-white border border-[#E1E6DE] rounded-xl p-2.5 space-y-0.5">
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#6B7D76]">
            Batch Volume
          </span>
          <p className="font-extrabold text-[#162925] truncate">
            {record.quantity?.value != null
              ? `${record.quantity.value} ${record.quantity.unit || ""}`
              : "N/A"}
          </p>
        </div>

        {/* Processing Method */}
        <div className="bg-white border border-[#E1E6DE] rounded-xl p-2.5 space-y-0.5">
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#6B7D76]">
            Method
          </span>
          <p className="font-extrabold text-[#162925] truncate">
            {record.processingMethod || "N/A"}
          </p>
        </div>
      </div>

      {/* Footer Details */}
      <div className="border-t border-[#E1E6DE] pt-3 space-y-1 text-[11px] text-[#6B7D76] font-medium">
        <div className="flex items-center justify-between">
          <span>Carbon Factor:</span>
          <span className="font-bold text-[#162925]">
            {record.carbonFactor ?? "N/A"}
          </span>
        </div>

        {record.facility?.facilityName && (
          <div className="flex items-center justify-between">
            <span>Facility:</span>
            <span className="font-bold text-[#162925] truncate max-w-[150px]">
              {record.facility.facilityName}
            </span>
          </div>
        )}

        {record.processedAt && (
          <div className="flex items-center justify-between pt-1 text-[10px]">
            <span>Processed On:</span>
            <span className="font-extrabold text-[#162925]">
              {new Date(record.processedAt).toLocaleDateString(undefined, {
                dateStyle: "medium",
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarbonCard;