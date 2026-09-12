import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { createFacility } from "../../services/facilityService";

const FacilityForm = () => {
  const navigate = useNavigate();

  // GSAP Animation Refs
  const formRef = useRef(null);
  const headerRef = useRef(null);
  const sectionRefs = useRef([]);
  const alertRef = useRef(null);

  sectionRefs.current = [];
  const addToRefs = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  const [formData, setFormData] = useState({
    facilityName: "",
    facilityType: "BIOCHAR",
    acceptedWasteTypes: "",
    capacity: "",
    capacityUnit: "TON_PER_DAY",
    address: "",
    city: "",
    state: "",
    pincode: "",
    latitude: "",
    longitude: "",
    pricing: "NEGOTIABLE",
    pricePerUnit: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  // GSAP Initial Reveal Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -25 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
      );

      // Sequential Card Section Slide-in
      gsap.fromTo(
        sectionRefs.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
          delay: 0.2,
        }
      );
    }, formRef);

    return () => ctx.revert();
  }, []);

  // Alert Banner GSAP Bounce Animation
  useEffect(() => {
    if (error || success) {
      gsap.fromTo(
        alertRef.current,
        { opacity: 0, scale: 0.95, y: -10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
      );
    }
  }, [error, success]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Helper for Non-Tech Users: Auto GPS Detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          latitude: position.coords.latitude.toFixed(6),
          longitude: position.coords.longitude.toFixed(6),
        }));
        setIsLocating(false);
      },
      () => {
        setError("Unable to retrieve location. Please type coordinates manually.");
        setIsLocating(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const acceptedWasteTypes = formData.acceptedWasteTypes
        .split(",")
        .map((type) => type.trim())
        .filter(Boolean);

      const facilityData = {
        facilityName: formData.facilityName,
        facilityType: formData.facilityType,
        acceptedWasteTypes,
        processingCapacity: {
          value: Number(formData.capacity),
          unit: formData.capacityUnit,
        },
        location: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          latitude: Number(formData.latitude),
          longitude: Number(formData.longitude),
        },
        pricing: formData.pricing,
        pricePerUnit: formData.pricePerUnit
          ? Number(formData.pricePerUnit)
          : undefined,
        description: formData.description,
      };

      await createFacility(facilityData);

      setSuccess("Your facility has been registered successfully!");
      setFormData({
        facilityName: "",
        facilityType: "BIOCHAR",
        acceptedWasteTypes: "",
        capacity: "",
        capacityUnit: "TON_PER_DAY",
        address: "",
        city: "",
        state: "",
        pincode: "",
        latitude: "",
        longitude: "",
        pricing: "NEGOTIABLE",
        pricePerUnit: "",
        description: "",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not register your facility. Please check the fields and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={formRef}
      className="w-full max-w-4xl mx-auto font-sans text-[#422D0B] p-4 sm:p-6 selection:bg-[#FFA800] selection:text-[#422D0B]"
    >
      {/* Top Header */}
      <div
        ref={headerRef}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDCB] pb-5 mb-8"
      >
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#967A53]">
            Processing Hub Registration
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#422D0B] tracking-tight mt-0.5">
            Register Facility
          </h1>
          <p className="text-xs text-[#967A53] mt-1">
            List your processing center to connect with local waste suppliers and generators.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/facility")}
          className="self-start sm:self-auto px-4 py-2.5 bg-[#FFFBF5] hover:bg-[#FFC24A]/20 text-[#422D0B] border border-[#E8DDCB] hover:border-[#FFA800] font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 group cursor-pointer"
        >
          <svg
            className="w-4 h-4 text-[#FFA800] group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Alert Banners */}
      {(error || success) && (
        <div ref={alertRef} className="mb-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-800 text-xs shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-red-100 flex items-center justify-center font-extrabold text-red-700 shrink-0">
                !
              </div>
              <p className="font-semibold leading-relaxed">{error}</p>
            </div>
          )}
          {success && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-900 text-xs shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center font-extrabold text-emerald-700 shrink-0">
                ✓
              </div>
              <p className="font-semibold leading-relaxed">{success}</p>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: General Information */}
        <div
          ref={addToRefs}
          className="bg-[#FFFBF5] border border-[#E8DDCB] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow space-y-5"
        >
          <div className="flex items-center gap-2 border-b border-[#E8DDCB]/60 pb-3">
            <span className="w-6 h-6 rounded-lg bg-[#FFA800]/20 text-[#422D0B] font-extrabold text-xs flex items-center justify-center">
              1
            </span>
            <h2 className="text-sm font-extrabold text-[#422D0B] tracking-tight">
              General Facility Details
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Facility Name */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-[#422D0B] flex items-center gap-1">
                Facility Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="facilityName"
                placeholder="e.g., Green Earth Biochar Processing Plant"
                value={formData.facilityName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white border border-[#E8DDCB] rounded-xl text-xs font-medium text-[#422D0B] focus:outline-none focus:border-[#FFA800] focus:ring-2 focus:ring-[#FFA800]/20 transition-all placeholder:text-[#967A53]/60"
              />
            </div>

            {/* Facility Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#422D0B]">
                Facility Type <span className="text-red-500">*</span>
              </label>
              <select
                name="facilityType"
                value={formData.facilityType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white border border-[#E8DDCB] rounded-xl text-xs font-bold text-[#422D0B] focus:outline-none focus:border-[#FFA800] focus:ring-2 focus:ring-[#FFA800]/20 transition-all cursor-pointer"
              >
                <option value="BIOCHAR">Biochar Processing</option>
                <option value="BIOGAS">Biogas Plant</option>
                <option value="COMPOSTING">Composting Facility</option>
                <option value="RECYCLING">Recycling Center</option>
                <option value="WASTE_TO_ENERGY">Waste to Energy</option>
                <option value="OTHER">Other Facility</option>
              </select>
            </div>

            {/* Accepted Waste Types */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#422D0B]">
                Accepted Waste Types <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="acceptedWasteTypes"
                placeholder="e.g., Rice Husk, Sawdust, Bagasse"
                value={formData.acceptedWasteTypes}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white border border-[#E8DDCB] rounded-xl text-xs font-medium text-[#422D0B] focus:outline-none focus:border-[#FFA800] focus:ring-2 focus:ring-[#FFA800]/20 transition-all placeholder:text-[#967A53]/60"
              />
              <p className="text-[10px] text-[#967A53]">
                Separate multiple materials using commas.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: Processing Capacity */}
        <div
          ref={addToRefs}
          className="bg-[#FFFBF5] border border-[#E8DDCB] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow space-y-5"
        >
          <div className="flex items-center gap-2 border-b border-[#E8DDCB]/60 pb-3">
            <span className="w-6 h-6 rounded-lg bg-[#FFA800]/20 text-[#422D0B] font-extrabold text-xs flex items-center justify-center">
              2
            </span>
            <h2 className="text-sm font-extrabold text-[#422D0B] tracking-tight">
              Processing Capacity & Limits
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-[#422D0B]">
                Daily Processing Capacity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="capacity"
                placeholder="e.g., 50"
                min="0"
                value={formData.capacity}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white border border-[#E8DDCB] rounded-xl text-xs font-medium text-[#422D0B] focus:outline-none focus:border-[#FFA800] focus:ring-2 focus:ring-[#FFA800]/20 transition-all placeholder:text-[#967A53]/60"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#422D0B]">
                Measurement Unit
              </label>
              <select
                name="capacityUnit"
                value={formData.capacityUnit}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-[#E8DDCB] rounded-xl text-xs font-bold text-[#422D0B] focus:outline-none focus:border-[#FFA800] focus:ring-2 focus:ring-[#FFA800]/20 transition-all cursor-pointer"
              >
                <option value="TON_PER_DAY">Tonnes / Day</option>
                <option value="KG_PER_DAY">Kilograms / Day</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 3: Location Details */}
        <div
          ref={addToRefs}
          className="bg-[#FFFBF5] border border-[#E8DDCB] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow space-y-5"
        >
          <div className="flex items-center justify-between border-b border-[#E8DDCB]/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#FFA800]/20 text-[#422D0B] font-extrabold text-xs flex items-center justify-center">
                3
              </span>
              <h2 className="text-sm font-extrabold text-[#422D0B] tracking-tight">
                Location & Coordinates
              </h2>
            </div>

            <button
              type="button"
              onClick={handleDetectLocation}
              disabled={isLocating}
              className="px-3 py-1.5 bg-white hover:bg-[#FFC24A]/20 text-[#422D0B] border border-[#E8DDCB] rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 text-[#FFA800]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{isLocating ? "Detecting GPS..." : "Auto-Fill GPS"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-[#422D0B]">
                Street Address
              </label>
              <input
                type="text"
                name="address"
                placeholder="Plot / Street / Industrial Area"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-[#E8DDCB] rounded-xl text-xs font-medium text-[#422D0B] focus:outline-none focus:border-[#FFA800] focus:ring-2 focus:ring-[#FFA800]/20 transition-all placeholder:text-[#967A53]/60"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#422D0B]">City</label>
              <input
                type="text"
                name="city"
                placeholder="City Name"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-[#E8DDCB] rounded-xl text-xs font-medium text-[#422D0B] focus:outline-none focus:border-[#FFA800] focus:ring-2 focus:ring-[#FFA800]/20 transition-all placeholder:text-[#967A53]/60"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#422D0B]">State</label>
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-[#E8DDCB] rounded-xl text-xs font-medium text-[#422D0B] focus:outline-none focus:border-[#FFA800] focus:ring-2 focus:ring-[#FFA800]/20 transition-all placeholder:text-[#967A53]/60"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#422D0B]">Pincode</label>
              <input
                type="text"
                name="pincode"
                placeholder="PIN Code"
                value={formData.pincode}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-[#E8DDCB] rounded-xl text-xs font-medium text-[#422D0B] focus:outline-none focus:border-[#FFA800] focus:ring-2 focus:ring-[#FFA800]/20 transition-all placeholder:text-[#967A53]/60"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 sm:col-span-1">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#422D0B]">
                  Latitude <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="latitude"
                  placeholder="e.g., 22.5726"
                  value={formData.latitude}
                  onChange={handleChange}
                  step="any"
                  required
                  className="w-full px-3 py-3 bg-white border border-[#E8DDCB] rounded-xl text-xs font-medium text-[#422D0B] focus:outline-none focus:border-[#FFA800] transition-all placeholder:text-[#967A53]/60"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#422D0B]">
                  Longitude <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="longitude"
                  placeholder="e.g., 88.3639"
                  value={formData.longitude}
                  onChange={handleChange}
                  step="any"
                  required
                  className="w-full px-3 py-3 bg-white border border-[#E8DDCB] rounded-xl text-xs font-medium text-[#422D0B] focus:outline-none focus:border-[#FFA800] transition-all placeholder:text-[#967A53]/60"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: Pricing Model */}
        <div
          ref={addToRefs}
          className="bg-[#FFFBF5] border border-[#E8DDCB] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow space-y-5"
        >
          <div className="flex items-center gap-2 border-b border-[#E8DDCB]/60 pb-3">
            <span className="w-6 h-6 rounded-lg bg-[#FFA800]/20 text-[#422D0B] font-extrabold text-xs flex items-center justify-center">
              4
            </span>
            <h2 className="text-sm font-extrabold text-[#422D0B] tracking-tight">
              Pricing Model & Extra Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#422D0B]">
                Pricing Structure <span className="text-red-500">*</span>
              </label>
              <select
                name="pricing"
                value={formData.pricing}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white border border-[#E8DDCB] rounded-xl text-xs font-bold text-[#422D0B] focus:outline-none focus:border-[#FFA800] focus:ring-2 focus:ring-[#FFA800]/20 transition-all cursor-pointer"
              >
                <option value="BUY_WASTE">Buy Waste (We pay generator)</option>
                <option value="FREE_TREATMENT">Free Treatment (Zero cost)</option>
                <option value="CHARGE_TREATMENT">
                  Charge for Treatment (Generator pays us)
                </option>
                <option value="NEGOTIABLE">Negotiable on Contact</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#422D0B]">
                Price Per Unit (Optional)
              </label>
              <input
                type="number"
                name="pricePerUnit"
                placeholder="Amount in ₹"
                min="0"
                value={formData.pricePerUnit}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-[#E8DDCB] rounded-xl text-xs font-medium text-[#422D0B] focus:outline-none focus:border-[#FFA800] focus:ring-2 focus:ring-[#FFA800]/20 transition-all placeholder:text-[#967A53]/60"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold text-[#422D0B]">
                Facility Description
              </label>
              <textarea
                name="description"
                placeholder="Describe your equipment, operating hours, transportation capabilities, or compliance certifications..."
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 bg-white border border-[#E8DDCB] rounded-xl text-xs font-medium text-[#422D0B] focus:outline-none focus:border-[#FFA800] focus:ring-2 focus:ring-[#FFA800]/20 transition-all placeholder:text-[#967A53]/60 resize-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 5: Sustainable Operational Guarantee */}
        <div
          ref={addToRefs}
          className="p-4 bg-[#FFC24A]/10 border border-[#FFA800]/30 rounded-2xl text-xs text-[#422D0B] space-y-1"
        >
          <span className="font-extrabold uppercase tracking-widest text-[10px] text-[#FFA800] block">
            Verification Protocol
          </span>
          <p className="text-[#967A53] leading-relaxed">
            By completing this registration, you confirm that your facility adheres to statutory local environmental standards for organic waste recovery and processing traceabilities.
          </p>
        </div>

        {/* Submit Action Bar */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/facility")}
            className="w-full sm:w-auto px-6 py-3 bg-[#FFFBF5] hover:bg-[#FFC24A]/10 text-[#422D0B] border border-[#E8DDCB] font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 bg-[#FFA800] hover:bg-[#FFC24A] text-[#422D0B] font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#422D0B] border-t-transparent rounded-full animate-spin" />
                <span>Registering Facility...</span>
              </>
            ) : (
              <span>Complete Facility Registration</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FacilityForm;