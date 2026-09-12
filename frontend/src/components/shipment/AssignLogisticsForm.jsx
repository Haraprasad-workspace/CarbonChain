import { useEffect, useState } from "react";
import { assignLogisticsProvider } from "../../services/shipmentService";
import api from "../../services/api";

const AssignLogisticsForm = ({ shipment, onAssigned }) => {
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("");

  const [loadingProviders, setLoadingProviders] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==================== FETCH PROVIDERS ====================

  const fetchProviders = async () => {
    try {
      setLoadingProviders(true);
      setError("");

      const response = await api.get(
        "/users/logistics-providers"
      );

      const logisticsProviders =
        response.data?.providers || [];

      setProviders(logisticsProviders);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load logistics providers."
      );
    } finally {
      setLoadingProviders(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  // ==================== SUBMIT ====================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!shipment?._id) {
      setError("Invalid shipment.");
      return;
    }

    if (shipment.logisticsProvider) {
      setError(
        "A logistics provider is already assigned to this shipment."
      );
      return;
    }

    if (
      ["DELIVERED", "CANCELLED"].includes(
        shipment.status
      )
    ) {
      setError(
        "This shipment can no longer be assigned."
      );
      return;
    }

    if (!selectedProvider) {
      setError("Please select a logistics provider.");
      return;
    }

    if (!vehicleNumber.trim()) {
      setError("Please enter the vehicle number.");
      return;
    }

    if (!driverName.trim()) {
      setError("Please enter the driver name.");
      return;
    }

    if (!driverPhone.trim()) {
      setError("Please enter the driver phone number.");
      return;
    }

    if (driverPhone.trim().length !== 10) {
      setError(
        "Driver phone number must contain 10 digits."
      );
      return;
    }

    try {
      setSubmitting(true);

      await assignLogisticsProvider(shipment._id, {
        logisticsProviderId: selectedProvider,
        vehicleNumber: vehicleNumber.trim().toUpperCase(),
        driverName: driverName.trim(),
        driverPhone: driverPhone.trim(),
      });

      setSuccess(
        "Logistics provider assigned successfully."
      );

      setTimeout(() => {
        if (onAssigned) {
          onAssigned();
        }
      }, 800);

    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to assign logistics provider."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==================== SELECTED PROVIDER ====================

  const selectedProviderData = providers.find(
    (provider) =>
      provider._id === selectedProvider
  );

  // ==================== UI ====================

  return (
    <div className="font-['Montserrat',sans-serif] text-[#422D0B] space-y-6">

      {/* Header */}
      <div className="border-b border-[#E8DDCB] pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFA800]" />

          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#967A53]">
            Transport Assignment
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black tracking-tight">
          Logistics Provider Details
        </h2>

        <p className="mt-1 text-xs font-medium text-[#967A53] leading-relaxed">
          Select an active transport partner and specify the
          vehicle and driver details to initiate dispatch.
        </p>
      </div>

      {/* Shipment Status */}
      {shipment?.status && (
        <div className="bg-[#FFFBF5] border border-[#E8DDCB] rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="block text-[9px] font-extrabold uppercase tracking-widest text-[#967A53]">
              Shipment Status
            </span>

            <p className="text-xs font-black text-[#422D0B] mt-1">
              {shipment.status}
            </p>
          </div>

          <span className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-bold">
            READY FOR ASSIGNMENT
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-rose-50/80 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 text-rose-800">
          <div className="w-6 h-6 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center shrink-0 text-xs font-black">
            !
          </div>

          <p className="text-xs font-semibold leading-relaxed pt-0.5">
            {error}
          </p>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-800">
          <div className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center shrink-0 text-xs font-black">
            ✓
          </div>

          <p className="text-xs font-semibold leading-relaxed">
            {success}
          </p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* Logistics Provider */}
        <div className="space-y-2">
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#967A53]">
            Logistics Provider{" "}
            <span className="text-rose-500">*</span>
          </label>

          {loadingProviders ? (
            <div className="h-12 bg-[#FFFBF5] border border-[#E8DDCB] rounded-2xl flex items-center px-4">
              <div className="w-4 h-4 border-2 border-[#E8DDCB] border-t-[#FFA800] rounded-full mr-3 animate-spin" />

              <span className="text-xs font-medium text-[#967A53]">
                Fetching active transport providers...
              </span>
            </div>
          ) : providers.length === 0 ? (
            <div className="bg-[#FFFBF5] border border-[#E8DDCB] rounded-2xl p-4">
              <p className="text-xs font-semibold text-[#967A53]">
                No active logistics providers found in the system.
              </p>
            </div>
          ) : (
            <div className="relative">
              <select
                value={selectedProvider}
                onChange={(e) =>
                  setSelectedProvider(e.target.value)
                }
                disabled={submitting}
                className="w-full h-12 px-4 bg-[#FFFBF5] border border-[#E8DDCB] rounded-2xl text-xs font-bold text-[#422D0B] outline-none focus:border-[#FFA800] focus:ring-4 focus:ring-[#FFA800]/15 disabled:opacity-60 transition-all appearance-none cursor-pointer pr-10"
              >
                <option value="">
                  Select logistics provider
                </option>

                {providers.map((provider) => (
                  <option
                    key={provider._id}
                    value={provider._id}
                  >
                    {provider.organization
                      ? `${provider.organization} — ${provider.name}`
                      : provider.name}
                  </option>
                ))}
              </select>

              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-[#967A53]">
                ▼
              </div>
            </div>
          )}
        </div>

        {/* Vehicle + Driver */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Vehicle */}
          <div className="space-y-2">
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#967A53]">
              Vehicle Number{" "}
              <span className="text-rose-500">*</span>
            </label>

            <input
              type="text"
              value={vehicleNumber}
              onChange={(e) =>
                setVehicleNumber(
                  e.target.value.toUpperCase()
                )
              }
              placeholder="e.g. GJ01AB1234"
              disabled={submitting}
              className="w-full h-12 px-4 bg-[#FFFBF5] border border-[#E8DDCB] rounded-2xl text-xs font-bold text-[#422D0B] placeholder:text-[#B8A78D] outline-none focus:border-[#FFA800] focus:ring-4 focus:ring-[#FFA800]/15 disabled:opacity-60 uppercase tracking-wider transition-all"
            />
          </div>

          {/* Driver */}
          <div className="space-y-2">
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#967A53]">
              Driver Name{" "}
              <span className="text-rose-500">*</span>
            </label>

            <input
              type="text"
              value={driverName}
              onChange={(e) =>
                setDriverName(e.target.value)
              }
              placeholder="Enter driver's full name"
              disabled={submitting}
              className="w-full h-12 px-4 bg-[#FFFBF5] border border-[#E8DDCB] rounded-2xl text-xs font-bold text-[#422D0B] placeholder:text-[#B8A78D] outline-none focus:border-[#FFA800] focus:ring-4 focus:ring-[#FFA800]/15 disabled:opacity-60 transition-all"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2 md:col-span-2">
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#967A53]">
              Driver Phone Number{" "}
              <span className="text-rose-500">*</span>
            </label>

            <input
              type="tel"
              value={driverPhone}
              onChange={(e) =>
                setDriverPhone(
                  e.target.value.replace(/\D/g, "")
                )
              }
              placeholder="Enter 10-digit phone number"
              maxLength={10}
              disabled={submitting}
              className="w-full h-12 px-4 bg-[#FFFBF5] border border-[#E8DDCB] rounded-2xl text-xs font-bold text-[#422D0B] placeholder:text-[#B8A78D] outline-none focus:border-[#FFA800] focus:ring-4 focus:ring-[#FFA800]/15 disabled:opacity-60 transition-all"
            />
          </div>
        </div>

        {/* Assignment Preview */}
        {selectedProvider && (
          <div className="bg-[#FFFBF5] border border-[#FFC24A] rounded-2xl p-5 space-y-3">

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FFA800]" />

              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#967A53]">
                Assignment Preview
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

              <SummaryPreviewItem
                label="Selected Provider"
                value={
                  selectedProviderData?.organization ||
                  selectedProviderData?.name ||
                  "Selected"
                }
              />

              <SummaryPreviewItem
                label="Vehicle Registration"
                value={
                  vehicleNumber || "Pending input"
                }
              />

              <SummaryPreviewItem
                label="Assigned Driver"
                value={
                  driverName
                    ? `${driverName}${
                        driverPhone
                          ? ` (${driverPhone})`
                          : ""
                      }`
                    : "Pending input"
                }
              />

            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end pt-3">
          <button
            type="submit"
            disabled={
              submitting ||
              loadingProviders ||
              providers.length === 0
            }
            className="w-full sm:w-auto min-w-[200px] px-8 py-3.5 bg-[#422D0B] hover:bg-[#2F2008] active:bg-[#1E1303] hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs rounded-2xl transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />

                <span>
                  Assigning Provider...
                </span>
              </>
            ) : (
              <>
                <span>
                  Confirm Assignment
                </span>

                <span className="text-sm">
                  →
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const SummaryPreviewItem = ({
  label,
  value,
}) => {
  return (
    <div className="bg-white border border-[#E8DDCB] rounded-xl p-3.5 space-y-1">
      <span className="block text-[9px] font-extrabold uppercase tracking-wider text-[#967A53]">
        {label}
      </span>

      <span className="block text-xs font-black text-[#422D0B] truncate">
        {value}
      </span>
    </div>
  );
};

export default AssignLogisticsForm;