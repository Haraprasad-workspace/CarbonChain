import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createWasteBatch } from "../../services/wasteService";

const WasteForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    wasteType: "",
    quantity: "",
    unit: "TON",
    quality: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    latitude: "",
    longitude: "",
    availabilityDate: "",
    pricingType: "NEGOTIABLE",
    askingPrice: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const wasteData = {
        wasteType: formData.wasteType,
        quantity: {
          value: Number(formData.quantity),
          unit: formData.unit,
        },
        quality: formData.quality,
        location: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          latitude: formData.latitude ? Number(formData.latitude) : undefined,
          longitude: formData.longitude ? Number(formData.longitude) : undefined,
        },
        availabilityDate: formData.availabilityDate,
        pricingType: formData.pricingType,
        askingPrice: formData.askingPrice ? Number(formData.askingPrice) : undefined,
        description: formData.description,
      };

      await createWasteBatch(wasteData);

      setSuccess("Waste batch registered successfully.");

      setFormData({
        wasteType: "",
        quantity: "",
        unit: "TON",
        quality: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        latitude: "",
        longitude: "",
        availabilityDate: "",
        pricingType: "NEGOTIABLE",
        askingPrice: "",
        description: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to register waste."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F4F6F0] text-[#1E332B] font-['Plus_Jakarta_Sans',sans-serif] p-4 sm:p-[28px] flex justify-center selection:bg-[#143B36] selection:text-white">
      <div className="w-full max-w-3xl space-y-6">
        
        {/* Header Title Section */}
        <div className="border-b border-[#E8EFEA] pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E332B] tracking-tight">
              Register Waste Batch
            </h2>
            <p className="text-xs text-[#63786E] mt-1">
              List available organic or industrial byproducts for recycling and carbon credit mapping.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/generator/waste")}
            className="self-start sm:self-auto px-4 py-2 bg-white text-[#1E332B] border border-[#E6EDE8] text-xs font-semibold rounded-xl shadow-[0px_1px_3px_rgba(0,0,0,0.03)] hover:border-[#73A892] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span>View My Waste</span>
            <svg className="w-4 h-4 text-[#63786E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Feedback Notifications */}
        {error && (
          <div className="p-4 rounded-xl text-xs font-semibold bg-red-50 border border-red-200 text-red-700 flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl text-xs font-semibold bg-[#D8EEDF] border border-[#D8EEDF] text-[#1E5E38] flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        {/* Main Form Body */}
        <form onSubmit={handleSubmit} className="bg-white border border-[#E6EDE8] rounded-2xl shadow-[0px_1px_3px_rgba(0,0,0,0.03),0px_4px_12px_rgba(22,41,37,0.03)] p-6 sm:p-8 space-y-6">
          
          {/* Section 1: Classification & Volume */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#63786E]">
              1. Waste Specs & Quantity
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E332B] mb-1.5">
                  Waste Type / Category *
                </label>
                <input
                  type="text"
                  name="wasteType"
                  placeholder="e.g. Agricultural Husk, Plastics, Biomass"
                  value={formData.wasteType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 text-sm bg-white border border-[#DFE6E1] rounded-xl text-[#1E332B] placeholder-[#8EA097] focus:outline-none focus:ring-2 focus:ring-[#143B36] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E332B] mb-1.5">
                  Quality / Grade
                </label>
                <input
                  type="text"
                  name="quality"
                  placeholder="e.g. Dry Grade A, Untreated"
                  value={formData.quality}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm bg-white border border-[#DFE6E1] rounded-xl text-[#1E332B] placeholder-[#8EA097] focus:outline-none focus:ring-2 focus:ring-[#143B36] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#1E332B] mb-1.5">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="quantity"
                  placeholder="0.00"
                  min="0"
                  step="any"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 text-sm bg-white border border-[#DFE6E1] rounded-xl text-[#1E332B] placeholder-[#8EA097] focus:outline-none focus:ring-2 focus:ring-[#143B36] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E332B] mb-1.5">
                  Unit *
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm bg-white border border-[#DFE6E1] rounded-xl text-[#1E332B] focus:outline-none focus:ring-2 focus:ring-[#143B36] transition-all"
                >
                  <option value="TON">Ton</option>
                  <option value="KG">KG</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="border-[#E8EFEA]" />

          {/* Section 2: Location Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#63786E]">
              2. Origin & Dispatch Location
            </h3>

            <div>
              <label className="block text-xs font-semibold text-[#1E332B] mb-1.5">
                Street Address
              </label>
              <input
                type="text"
                name="address"
                placeholder="Facility address or site marker"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2.5 text-sm bg-white border border-[#DFE6E1] rounded-xl text-[#1E332B] placeholder-[#8EA097] focus:outline-none focus:ring-2 focus:ring-[#143B36] transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E332B] mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm bg-white border border-[#DFE6E1] rounded-xl text-[#1E332B] placeholder-[#8EA097] focus:outline-none focus:ring-2 focus:ring-[#143B36] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E332B] mb-1.5">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm bg-white border border-[#DFE6E1] rounded-xl text-[#1E332B] placeholder-[#8EA097] focus:outline-none focus:ring-2 focus:ring-[#143B36] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E332B] mb-1.5">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  placeholder="Postal Code"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm bg-white border border-[#DFE6E1] rounded-xl text-[#1E332B] placeholder-[#8EA097] focus:outline-none focus:ring-2 focus:ring-[#143B36] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E332B] mb-1.5">
                  Latitude (Optional)
                </label>
                <input
                  type="number"
                  name="latitude"
                  placeholder="e.g. 22.5726"
                  step="any"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm bg-white border border-[#DFE6E1] rounded-xl text-[#1E332B] placeholder-[#8EA097] focus:outline-none focus:ring-2 focus:ring-[#143B36] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E332B] mb-1.5">
                  Longitude (Optional)
                </label>
                <input
                  type="number"
                  name="longitude"
                  placeholder="e.g. 88.3639"
                  step="any"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm bg-white border border-[#DFE6E1] rounded-xl text-[#1E332B] placeholder-[#8EA097] focus:outline-none focus:ring-2 focus:ring-[#143B36] transition-all"
                />
              </div>
            </div>
          </div>

          <hr className="border-[#E8EFEA]" />

          {/* Section 3: Availability & Commercial Terms */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#63786E]">
              3. Timing & Pricing Terms
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E332B] mb-1.5">
                  Availability Date *
                </label>
                <input
                  type="date"
                  name="availabilityDate"
                  value={formData.availabilityDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 text-sm bg-white border border-[#DFE6E1] rounded-xl text-[#1E332B] focus:outline-none focus:ring-2 focus:ring-[#143B36] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E332B] mb-1.5">
                  Pricing Model *
                </label>
                <select
                  name="pricingType"
                  value={formData.pricingType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 text-sm bg-white border border-[#DFE6E1] rounded-xl text-[#1E332B] focus:outline-none focus:ring-2 focus:ring-[#143B36] transition-all"
                >
                  <option value="SELL">Sell</option>
                  <option value="FREE_PICKUP">Free Pickup</option>
                  <option value="PAY_FOR_TREATMENT">Pay for Treatment</option>
                  <option value="NEGOTIABLE">Negotiable</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E332B] mb-1.5">
                  Asking Price (INR)
                </label>
                <input
                  type="number"
                  name="askingPrice"
                  placeholder="0.00"
                  min="0"
                  step="any"
                  value={formData.askingPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 text-sm bg-white border border-[#DFE6E1] rounded-xl text-[#1E332B] placeholder-[#8EA097] focus:outline-none focus:ring-2 focus:ring-[#143B36] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E332B] mb-1.5">
                Additional Batch Description
              </label>
              <textarea
                name="description"
                placeholder="Mention moisture levels, handling requirements, or packaging status..."
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2.5 text-sm bg-white border border-[#DFE6E1] rounded-xl text-[#1E332B] placeholder-[#8EA097] focus:outline-none focus:ring-2 focus:ring-[#143B36] transition-all"
              />
            </div>
          </div>

          {/* Form Controls */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/generator/waste")}
              className="px-5 py-2.5 text-xs font-semibold text-[#63786E] hover:text-[#1E332B] transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#143B36] hover:bg-[#0D2925] text-white font-semibold text-xs rounded-xl shadow-xs transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Registering Batch...</span>
                </>
              ) : (
                <span>Submit Waste Batch</span>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default WasteForm;