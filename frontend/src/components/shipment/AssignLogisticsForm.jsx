import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { assignLogisticsProvider } from "../../services/shipmentService";
import api from "../../services/api";

gsap.registerPlugin(ScrollTrigger);

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

  // Animation Refs
  const formContainerRef = useRef(null);
  const previewRef = useRef(null);
  const alertRef = useRef(null);
  const staticDetailsRef = useRef(null);

  // GSAP Entrance Animation
  useEffect(() => {
    if (formContainerRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          formContainerRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: formContainerRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );

        if (staticDetailsRef.current?.children) {
          gsap.fromTo(
            staticDetailsRef.current.children,
            { opacity: 0, y: 10 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.08,
              ease: "power2.out",
              delay: 0.2,
            }
          );
        }
      }, formContainerRef);

      return () => ctx.revert();
    }
  }, []);

  // GSAP Animation for Assignment Preview Box
  useEffect(() => {
    if (selectedProvider && previewRef.current) {
      gsap.fromTo(
        previewRef.current,
        { opacity: 0, y: 12, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.4)" }
      );
    }
  }, [selectedProvider]);

  // GSAP Animation for Error / Success Alerts
  useEffect(() => {
    if ((error || success) && alertRef.current) {
      gsap.fromTo(
        alertRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
      );
    }
  }, [error, success]);

  // ==================== FETCH PROVIDERS ====================

  const fetchProviders = async () => {
    try {
      setLoadingProviders(true);
      setError("");

      const response = await api.get("/users/logistics-providers");

      const logisticsProviders = response.data?.providers || [];

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

    if (["DELIVERED", "CANCELLED"].includes(shipment.status)) {
      setError("This shipment can no longer be assigned.");
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
      setError("Driver phone number must contain 10 digits.");
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

      setSuccess("Logistics provider assigned successfully.");

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
    (provider) => provider._id === selectedProvider
  );

  // ==================== UI ====================

  return (
    <div
      ref={formContainerRef}
      className="bg-[#0B1A12] border border-[#1B382B] hover:border-[#10B981]/50 rounded-2xl p-6 sm:p-8 shadow-xl font-['Montserrat',sans-serif] text-[#E2F1E7] space-y-6 transition-all duration-300 relative overflow-hidden"
    >
      {/* Ambient Dark Green Glow */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#10B981]/5 rounded-bl-full pointer-events-none blur-3xl" />

      {/* Header */}
      <div className="border-b border-[#1B382B] pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#6E9B82]">
            Transport Assignment
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-[#E2F1E7] tracking-tight">
          Logistics Provider Details
        </h2>

        <p className="mt-1 text-xs font-medium text-[#6E9B82] leading-relaxed">
          Select an active transport partner and specify the vehicle and driver details to initiate dispatch.
        </p>
      </div>

      {/* Shipment Status */}
      {shipment?.status && (
        <div className="bg-[#132A1D]/80 border border-[#1B382B] rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="block text-[9px] font-extrabold uppercase tracking-widest text-[#6E9B82]">
              Shipment Status
            </span>

            <p className="text-xs font-black text-[#E2F1E7] mt-1">
              {shipment.status}
            </p>
          </div>

          <span className="px-3 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#34D399] text-[9px] font-extrabold tracking-wider uppercase">
            Ready for Assignment
          </span>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div
          ref={alertRef}
          className="bg-[#EF4444]/15 border border-[#EF4444]/30 rounded-2xl p-4 flex items-start gap-3 text-[#F87171]"
        >
          <div className="w-6 h-6 bg-[#EF4444]/20 border border-[#EF4444]/30 text-[#F87171] rounded-lg flex items-center justify-center shrink-0 text-xs font-black">
            !
          </div>

          <p className="text-xs font-bold leading-relaxed pt-0.5">
            {error}
          </p>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div
          ref={alertRef}
          className="bg-[#10B981]/15 border border-[#10B981]/30 rounded-2xl p-4 flex items-center gap-3 text-[#34D399]"
        >
          <div className="w-6 h-6 bg-[#10B981]/20 border border-[#10B981]/30 text-[#34D399] rounded-lg flex items-center justify-center shrink-0 text-xs font-black">
            ✓
          </div>

          <p className="text-xs font-bold leading-relaxed">
            {success}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logistics Provider Selection */}
        <div className="space-y-2">
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#6E9B82]">
            Logistics Provider <span className="text-[#F87171]">*</span>
          </label>

          {loadingProviders ? (
            <div className="h-12 bg-[#132A1D]/60 border border-[#1B382B] rounded-2xl flex items-center px-4">
              <div className="w-4 h-4 border-2 border-[#1B382B] border-t-[#10B981] rounded-full mr-3 animate-spin" />

              <span className="text-xs font-medium text-[#6E9B82]">
                Fetching active transport providers...
              </span>
            </div>
          ) : providers.length === 0 ? (
            <div className="bg-[#132A1D]/60 border border-[#1B382B] rounded-2xl p-4">
              <p className="text-xs font-semibold text-[#6E9B82]">
                No active logistics providers found in the system.
              </p>
            </div>
          ) : (
            <div className="relative">
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                disabled={submitting}
                className="w-full h-12 px-4 bg-[#132A1D] border border-[#1B382B] rounded-2xl text-xs font-bold text-[#E2F1E7] outline-none focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/15 disabled:opacity-50 transition-all appearance-none cursor-pointer pr-10"
              >
                <option value="" className="bg-[#0B1A12] text-[#6E9B82]">
                  Select logistics provider
                </option>

                {providers.map((provider) => (
                  <option
                    key={provider._id}
                    value={provider._id}
                    className="bg-[#0B1A12] text-[#E2F1E7]"
                  >
                    {provider.organization
                      ? `${provider.organization} — ${provider.name}`
                      : provider.name}
                  </option>
                ))}
              </select>

              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-xs text-[#6E9B82]">
                ▼
              </div>
            </div>
          )}
        </div>

        {/* Vehicle + Driver Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Vehicle */}
          <div className="space-y-2">
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#6E9B82]">
              Vehicle Number <span className="text-[#F87171]">*</span>
            </label>

            <input
              type="text"
              value={vehicleNumber}
              onChange={(e) =>
                setVehicleNumber(e.target.value.toUpperCase())
              }
              placeholder="e.g. GJ01AB1234"
              disabled={submitting}
              className="w-full h-12 px-4 bg-[#132A1D] border border-[#1B382B] rounded-2xl text-xs font-bold text-[#E2F1E7] placeholder:text-[#6E9B82]/60 outline-none focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/15 disabled:opacity-50 uppercase tracking-wider transition-all"
            />
          </div>

          {/* Driver Name */}
          <div className="space-y-2">
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#6E9B82]">
              Driver Name <span className="text-[#F87171]">*</span>
            </label>

            <input
              type="text"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              placeholder="Enter driver's full name"
              disabled={submitting}
              className="w-full h-12 px-4 bg-[#132A1D] border border-[#1B382B] rounded-2xl text-xs font-bold text-[#E2F1E7] placeholder:text-[#6E9B82]/60 outline-none focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/15 disabled:opacity-50 transition-all"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2 md:col-span-2">
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#6E9B82]">
              Driver Phone Number <span className="text-[#F87171]">*</span>
            </label>

            <input
              type="tel"
              value={driverPhone}
              onChange={(e) =>
                setDriverPhone(e.target.value.replace(/\D/g, ""))
              }
              placeholder="Enter 10-digit phone number"
              maxLength={10}
              disabled={submitting}
              className="w-full h-12 px-4 bg-[#132A1D] border border-[#1B382B] rounded-2xl text-xs font-bold text-[#E2F1E7] placeholder:text-[#6E9B82]/60 outline-none focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/15 disabled:opacity-50 transition-all"
            />
          </div>
        </div>

        {/* Assignment Preview */}
        {selectedProvider && (
          <div
            ref={previewRef}
            className="bg-[#132A1D]/80 border border-[#10B981]/40 rounded-2xl p-5 space-y-3 shadow-md"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />

              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#6E9B82]">
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
                value={vehicleNumber || "Pending input"}
              />

              <SummaryPreviewItem
                label="Assigned Driver"
                value={
                  driverName
                    ? `${driverName}${
                        driverPhone ? ` (${driverPhone})` : ""
                      }`
                    : "Pending input"
                }
              />
            </div>
          </div>
        )}

        {/* Submit Action */}
        <div className="flex justify-end pt-3">
          <button
            type="submit"
            disabled={
              submitting ||
              loadingProviders ||
              providers.length === 0
            }
            className="w-full sm:w-auto min-w-[200px] px-8 py-3.5 bg-[#10B981] hover:bg-[#059669] active:bg-[#047857] disabled:bg-[#132A1D] disabled:text-[#6E9B82] text-[#0B1A12] font-black text-xs rounded-2xl shadow-lg hover:shadow-xl disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-[#0B1A12] border-t-transparent rounded-full animate-spin" />

                <span>Assigning Provider...</span>
              </>
            ) : (
              <>
                <span>Confirm Assignment</span>
                <span className="text-sm">→</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Static Info Parameters */}
      <div className="pt-3 border-t border-[#1B382B] space-y-2">
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#6E9B82]">
          Logistics Compliance Protocols
        </p>

        <div
          ref={staticDetailsRef}
          className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs"
        >
          <div className="bg-[#132A1D]/60 border border-[#1B382B] p-2.5 rounded-xl flex flex-col justify-between">
            <span className="text-[10px] font-bold text-[#6E9B82] uppercase">
              GPS Tracking
            </span>
            <span className="font-extrabold text-[#34D399]">Enabled</span>
          </div>

          <div className="bg-[#132A1D]/60 border border-[#1B382B] p-2.5 rounded-xl flex flex-col justify-between">
            <span className="text-[10px] font-bold text-[#6E9B82] uppercase">
              Manifest Hash
            </span>
            <span className="font-extrabold text-[#E2F1E7]">Auto-Generated</span>
          </div>

          <div className="bg-[#132A1D]/60 border border-[#1B382B] p-2.5 rounded-xl flex flex-col justify-between col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-[#6E9B82] uppercase">
              Chain of Custody
            </span>
            <span className="font-extrabold text-[#E2F1E7]">Immutably Logged</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryPreviewItem = ({ label, value }) => {
  return (
    <div className="bg-[#0B1A12] border border-[#1B382B] rounded-xl p-3.5 space-y-1">
      <span className="block text-[9px] font-extrabold uppercase tracking-wider text-[#6E9B82]">
        {label}
      </span>

      <span className="block text-xs font-black text-[#E2F1E7] truncate">
        {value}
      </span>
    </div>
  );
};

export default AssignLogisticsForm;