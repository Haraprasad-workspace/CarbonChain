import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { deleteFacility } from "../../services/facilityService";

const FacilityCard = ({ facility, onUpdate }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // GSAP Hover Scale Animation
  const handleMouseEnter = () => {
    gsap.to(cardRef.current, {
      y: -6,
      boxShadow: "0 12px 24px -10px rgba(66, 45, 11, 0.12)",
      borderColor: "#FFA800",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
      borderColor: "#E8DDCB",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  // GSAP Animated Delete Action
  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${facility.facilityName}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);

      // GSAP Shrink & Fade Animation before triggering state removal
      await gsap.to(cardRef.current, {
        opacity: 0,
        scale: 0.85,
        y: -20,
        duration: 0.35,
        ease: "power2.in",
      });

      await deleteFacility(facility._id);
      onUpdate();
    } catch (error) {
      // Revert animation if delete fails
      gsap.to(cardRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.3,
      });
      alert(
        error.response?.data?.message ||
          "Failed to delete facility. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Status Badge Color Helpers
  const getVerificationBadge = (status) => {
    switch (status?.toUpperCase()) {
      case "VERIFIED":
      case "APPROVED":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "PENDING":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "REJECTED":
        return "bg-red-50 text-red-800 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
      case "OPERATIONAL":
        return "bg-emerald-500/10 text-emerald-900 border-emerald-300";
      case "INACTIVE":
      case "MAINTENANCE":
        return "bg-amber-500/10 text-amber-900 border-amber-300";
      default:
        return "bg-[#FFFBF5] text-[#967A53] border-[#E8DDCB]";
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="bg-white border border-[#E8DDCB] rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-5 transition-colors font-['Montserrat',sans-serif] text-[#422D0B] relative overflow-hidden"
    >
      {/* Decorative Accent Glow */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFA800]/5 rounded-bl-full pointer-events-none" />

      {/* Header & Badges */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#967A53]">
              {facility.facilityType || "PROCESSING FACILITY"}
            </span>
            <h3 className="text-base font-extrabold text-[#422D0B] leading-snug line-clamp-2">
              {facility.facilityName}
            </h3>
          </div>

          {/* Operational Status Dot */}
          {facility.operationalStatus && (
            <span
              className={`px-2.5 py-1 border text-[10px] font-bold rounded-full uppercase shrink-0 ${getStatusBadge(
                facility.operationalStatus
              )}`}
            >
              {facility.operationalStatus}
            </span>
          )}
        </div>

        {/* Verification Pill */}
        {facility.verificationStatus && (
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[11px] font-bold text-[#967A53]">
              Verification:
            </span>
            <span
              className={`px-2 py-0.5 border text-[10px] font-extrabold rounded-md uppercase ${getVerificationBadge(
                facility.verificationStatus
              )}`}
            >
              {facility.verificationStatus}
            </span>
          </div>
        )}
      </div>

      {/* Key Specifications Grid */}
      <div className="space-y-3 pt-2 border-t border-[#E8DDCB]/60 text-xs">
        {/* Capacity */}
        <div className="flex items-center justify-between">
          <span className="text-[#967A53] font-medium flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-[#FFA800]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Capacity:
          </span>
          <span className="font-extrabold text-[#422D0B]">
            {facility.processingCapacity?.value
              ? `${facility.processingCapacity.value} ${
                  facility.processingCapacity?.unit === "TON_PER_DAY"
                    ? "Tons/Day"
                    : facility.processingCapacity?.unit === "KG_PER_DAY"
                    ? "KG/Day"
                    : facility.processingCapacity?.unit
                }`
              : "N/A"}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center justify-between">
          <span className="text-[#967A53] font-medium flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-[#FFA800]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            Location:
          </span>
          <span className="font-bold text-[#422D0B] truncate max-w-[140px] text-right">
            {facility.location?.city || "Not specified"}
          </span>
        </div>

        {/* Pricing Model */}
        <div className="flex items-center justify-between">
          <span className="text-[#967A53] font-medium flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-[#FFA800]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pricing:
          </span>
          <div className="text-right">
            <span className="font-bold text-[#422D0B] uppercase">
              {facility.pricing ? facility.pricing.replace("_", " ") : "Negotiable"}
            </span>
            {facility.pricePerUnit !== undefined && (
              <span className="block text-[11px] font-extrabold text-[#FFA800]">
                ₹{facility.pricePerUnit} / unit
              </span>
            )}
          </div>
        </div>

        {/* Accepted Waste Chips */}
        <div className="pt-2">
          <span className="text-[11px] font-bold text-[#967A53] block mb-1.5">
            Accepted Waste Types:
          </span>
          <div className="flex flex-wrap gap-1">
            {facility.acceptedWasteTypes && facility.acceptedWasteTypes.length > 0 ? (
              facility.acceptedWasteTypes.map((waste, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 bg-[#FFFBF5] border border-[#E8DDCB] text-[#422D0B] rounded-md text-[10px] font-semibold"
                >
                  {waste}
                </span>
              ))
            ) : (
              <span className="text-[11px] text-[#967A53] italic">
                Not specified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="flex items-center gap-2 pt-3 border-t border-[#E8DDCB]/60">
        <button
          onClick={() => navigate(`/facility/${facility._id}`)}
          className="flex-1 py-2.5 px-3 bg-[#FFA800] hover:bg-[#FFC24A] text-[#422D0B] font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 active:scale-95"
        >
          <span>View Details</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          title="Delete Facility"
          className="p-2.5 bg-white hover:bg-red-50 text-red-600 border border-[#E8DDCB] hover:border-red-200 rounded-xl transition-all active:scale-95 disabled:opacity-50"
        >
          {isDeleting ? (
            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default FacilityCard;