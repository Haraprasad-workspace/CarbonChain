import React from "react";

const FacilityDetails = ({ facility }) => {
  if (!facility) return null;

  const location = facility.location || {};
  const capacity = facility.processingCapacity || {};
  const pricing = facility.pricing || "NEGOTIABLE";

  const formatText = (value) => {
    if (!value) return "Not specified";

    return value
      .toString()
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="space-y-6 font-sans text-[#422D0B]">
      {/* Header Banner */}
      <div className="bg-[#FFFBF5] border border-[#E8DDCB] rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 bg-[#FFC24A]/20 border border-[#FFA800]/30 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-[#422D0B]">
              {formatText(facility.facilityType)}
            </span>

            <h1 className="text-2xl sm:text-3xl font-black text-[#422D0B] tracking-tight">
              {facility.facilityName}
            </h1>

            <p className="text-xs font-medium text-[#967A53] leading-relaxed max-w-2xl">
              {facility.description || "No facility description available."}
            </p>
          </div>

          <span
            className={`px-3.5 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider whitespace-nowrap self-start ${
              facility.operationalStatus === "ACTIVE"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-amber-50 text-amber-800 border-amber-200"
            }`}
          >
            {formatText(facility.operationalStatus)}
          </span>
        </div>
      </div>

      {/* Overview & Impact Statement */}
      <div className="bg-[#FFFBF5] border border-[#E8DDCB] rounded-3xl p-6 sm:p-8 shadow-sm space-y-3">
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#967A53]">
          Facility Overview & Environmental Role
        </h2>
        <p className="text-xs text-[#967A53] leading-relaxed">
          This facility is registered within our sustainable bio-waste management network. It serves as a regional processing unit converting organic residue and agriculture waste into verified carbon offsets, reducing landfill methane emissions and powering circular eco-initiatives.
        </p>
      </div>

      {/* Operational Status */}
      <div className="bg-[#FFFBF5] border border-[#E8DDCB] rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center gap-2 border-b border-[#E8DDCB] pb-4">
          <span className="w-2 h-2 rounded-full bg-[#FFA800] animate-pulse" />
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#967A53]">
            Facility Operational Status
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoBox
            label="Operational Status"
            value={formatText(facility.operationalStatus)}
            active={facility.operationalStatus === "ACTIVE"}
          />

          <InfoBox
            label="Verification Status"
            value={`Verification ${formatText(facility.verificationStatus)}`}
          />
        </div>

        {facility.verificationStatus === "PENDING" && (
          <div className="bg-[#FFC24A]/10 border border-[#FFA800]/30 rounded-2xl px-4 py-3 text-xs text-[#422D0B] flex items-center gap-2">
            <span className="text-[#FFA800]">⌛</span>
            <span>
              Facility verification is currently under review by compliance managers.
            </span>
          </div>
        )}
      </div>

      {/* Facility Information */}
      <div className="bg-[#FFFBF5] border border-[#E8DDCB] rounded-3xl p-6 sm:p-8 shadow-sm">
        <SectionTitle title="Facility Information" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoRow
            label="Facility Name"
            value={facility.facilityName}
          />

          <InfoRow
            label="Facility Type"
            value={formatText(facility.facilityType)}
          />

          <InfoRow
            label="Processing Capacity"
            value={
              capacity.value
                ? `${capacity.value} ${formatText(capacity.unit)}`
                : "Not specified"
            }
          />

          <InfoRow
            label="Pricing Model"
            value={formatText(pricing)}
          />

          <InfoRow
            label="Price Per Unit"
            value={
              facility.pricePerUnit !== undefined
                ? `₹${facility.pricePerUnit} / unit`
                : "Not specified"
            }
          />

          <InfoRow
            label="Verification"
            value={formatText(facility.verificationStatus)}
          />
        </div>
      </div>

      {/* Location */}
      <div className="bg-[#FFFBF5] border border-[#E8DDCB] rounded-3xl p-6 sm:p-8 shadow-sm">
        <SectionTitle title="Facility Location" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoRow
            label="Address"
            value={location.address}
          />

          <InfoRow
            label="City"
            value={location.city}
          />

          <InfoRow
            label="State"
            value={location.state}
          />

          <InfoRow
            label="Pincode"
            value={location.pincode}
          />

          <InfoRow
            label="Latitude"
            value={location.latitude}
          />

          <InfoRow
            label="Longitude"
            value={location.longitude}
          />
        </div>
      </div>

      {/* Accepted Waste Types */}
      <div className="bg-[#FFFBF5] border border-[#E8DDCB] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <SectionTitle title="Accepted Waste Types" />

        {facility.acceptedWasteTypes?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {facility.acceptedWasteTypes.map((waste, index) => (
              <span
                key={`${waste}-${index}`}
                className="px-3.5 py-2 bg-white border border-[#E8DDCB] rounded-xl text-xs font-bold text-[#422D0B] shadow-sm"
              >
                {waste}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs font-medium text-[#967A53]">
            No accepted waste types specified.
          </p>
        )}

        {/* Processing Guarantee Info */}
        <div className="p-4 bg-[#FFC24A]/10 border border-[#FFA800]/20 rounded-2xl text-xs text-[#422D0B] space-y-1">
          <p className="font-extrabold uppercase tracking-wider text-[10px] text-[#FFA800]">
            Processing Standard Compliance
          </p>
          <p className="text-[#967A53]">
            All logged waste batches dispatched to this site are processed according to strict ecological guidelines to guarantee full audit compliance and precise carbon offset calculations.
          </p>
        </div>
      </div>
    </div>
  );
};

const SectionTitle = ({ title }) => {
  return (
    <div className="border-b border-[#E8DDCB] pb-4 mb-5">
      <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#967A53]">
        {title}
      </h2>
    </div>
  );
};

const InfoBox = ({ label, value, active = false }) => {
  return (
    <div
      className={`rounded-2xl border p-4 transition-all ${
        active
          ? "bg-emerald-50/60 border-emerald-200"
          : "bg-white border-[#E8DDCB]"
      }`}
    >
      <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#967A53]">
        {label}
      </span>

      <span className="block mt-2 text-sm font-black text-[#422D0B]">
        {value}
      </span>
    </div>
  );
};

const InfoRow = ({ label, value }) => {
  return (
    <div className="bg-white border border-[#E8DDCB]/70 rounded-2xl p-4">
      <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#967A53]">
        {label}
      </span>

      <span className="block mt-1.5 text-sm font-bold text-[#422D0B] break-words">
        {value || "Not specified"}
      </span>
    </div>
  );
};

export default FacilityDetails;