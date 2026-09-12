import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  createWastePassport,
  getPassportByWaste,
} from "../../services/trackingService";

const WastePassport = ({ wasteBatch }) => {
  const [passport, setPassport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const cardRef = useRef(null);

  const fetchPassport = async () => {
    if (!wasteBatch?._id) return;

    try {
      setLoading(true);
      setError("");

      const response = await getPassportByWaste(wasteBatch._id);

      setPassport(response?.passport || null);
    } catch (err) {
      // 404 simply means passport has not been created yet
      if (err.response?.status !== 404) {
        setError(
          err.response?.data?.message ||
            "Failed to fetch digital passport."
        );
      }

      setPassport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassport();
  }, [wasteBatch?._id]);

  useEffect(() => {
    if (!loading && cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        }
      );
    }
  }, [loading, passport]);

  const handleCreatePassport = async () => {
    try {
      setCreating(true);
      setError("");

      const response = await createWastePassport(wasteBatch._id);

      setPassport(response?.passport || null);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create digital passport."
      );
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#0B1610] border border-[rgba(16,185,129,0.15)] rounded-2xl p-6 shadow-[0_4px_12px_-2px_rgba(2,44,34,0.5)]">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-[#12221A] rounded w-1/3" />
          <div className="h-4 bg-[#12221A] rounded w-2/3" />
          <div className="h-10 bg-[#12221A] rounded" />
        </div>
      </div>
    );
  }

  return (
    <section
      ref={cardRef}
      className="bg-[#0B1610] border border-[rgba(16,185,129,0.15)] rounded-2xl p-6 shadow-[0_4px_12px_-2px_rgba(2,44,34,0.5)] font-['Montserrat',sans-serif] text-[#ECFDF5] backdrop-blur-[16px]"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 pb-4 border-b border-[rgba(16,185,129,0.15)]">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#065F46]">
            Digital Waste Passport
          </p>

          <h2 className="text-xl font-bold text-[#ECFDF5] mt-1 tracking-tight">
            Waste Lifecycle Identity
          </h2>

          <p className="text-xs text-[#A7F3D0]/70 mt-1 font-medium">
            Track this waste from origin registration to verified carbon credit processing.
          </p>
        </div>

        {passport && (
          <span className="px-3.5 py-1.5 rounded-full bg-[#10B981]/10 text-[#34D399] border border-[#10B981]/30 text-xs font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(16,185,129,0.2)] self-start md:self-auto">
            {passport.lifecycleStatus}
          </span>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
          <svg className="w-4 h-4 text-rose-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Empty Passport State */}
      {!passport ? (
        <div className="border border-dashed border-[rgba(16,185,129,0.25)] bg-[#12221A] rounded-xl p-8 text-center">
          <div className="w-12 h-12 bg-[#0B1610] border border-[rgba(16,185,129,0.30)] text-[#10B981] rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-xs mb-3">
            ♻️
          </div>

          <h3 className="text-base font-bold text-[#ECFDF5]">
            No Digital Passport Found
          </h3>

          <p className="text-xs text-[#A7F3D0]/70 mt-1 mb-6 max-w-sm mx-auto font-medium">
            Generate an immutable cryptographic digital identity to track this batch’s full circular lifecycle.
          </p>

          <button
            onClick={handleCreatePassport}
            disabled={creating}
            className="px-6 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#34D399] text-[#050B07] text-xs font-extrabold transition-all duration-200 shadow-[0_0_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_20px_rgba(52,211,153,0.6)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {creating ? "Generating Passport..." : "Create Digital Passport"}
          </button>
        </div>
      ) : (
        /* Passport Data Cards */
        <div className="space-y-5">
          {/* Passport ID */}
          <div className="p-4 rounded-xl bg-[#12221A] border border-[rgba(16,185,129,0.15)] space-y-1">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#065F46]">
              Passport ID
            </p>

            <p className="text-sm font-extrabold text-[#34D399] break-all tracking-mono">
              {passport.passportId}
            </p>
          </div>

          {/* Waste Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#12221A] border border-[rgba(16,185,129,0.15)] space-y-1">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#065F46]">
                Waste Type
              </p>
              <p className="font-bold text-xs text-[#ECFDF5]">
                {passport.wasteType}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#12221A] border border-[rgba(16,185,129,0.15)] space-y-1">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#065F46]">
                Quantity
              </p>
              <p className="font-bold text-xs text-[#ECFDF5]">
                {passport.quantity?.value} {passport.quantity?.unit}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#12221A] border border-[rgba(16,185,129,0.15)] space-y-1">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#065F46]">
                Lifecycle Status
              </p>
              <p className="font-bold text-xs text-[#34D399]">
                {passport.lifecycleStatus}
              </p>
            </div>
          </div>

          {/* Origin / Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#12221A] border border-[rgba(16,185,129,0.15)] space-y-1">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#065F46]">
                Origin
              </p>

              <p className="font-bold text-xs text-[#ECFDF5] truncate">
                {passport.origin?.address ||
                  passport.origin?.city ||
                  "Not available"}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#12221A] border border-[rgba(16,185,129,0.15)] space-y-1">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#065F46]">
                Destination
              </p>

              <p className="font-bold text-xs text-[#ECFDF5] truncate">
                {passport.destination?.address ||
                  passport.destination?.city ||
                  "Not assigned"}
              </p>
            </div>
          </div>

          {/* Carbon Impact Box */}
          {passport.carbonImpact?.co2eAvoided !== undefined && (
            <div className="p-5 rounded-xl bg-[#12221A] border border-[rgba(16,185,129,0.30)] shadow-[0_0_20px_rgba(16,185,129,0.08)] space-y-1">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#10B981]">
                Carbon Impact
              </p>

              <p className="text-2xl font-black text-[#34D399]">
                {passport.carbonImpact.co2eAvoided} <span className="text-sm font-bold text-[#ECFDF5]">tCO₂e</span>
              </p>

              <p className="text-xs text-[#A7F3D0]/70 font-medium">
                Verified CO₂ equivalent greenhouse emissions avoided from landfill.
              </p>
            </div>
          )}

          {/* Lifecycle Audit Events */}
          {passport.events?.length > 0 && (
            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#065F46] mb-3">
                Lifecycle Events
              </h3>

              <div className="space-y-3">
                {passport.events
                  .slice()
                  .reverse()
                  .map((event, index) => (
                    <div
                      key={`${event.timestamp}-${index}`}
                      className="flex gap-3 p-3 rounded-xl bg-[#12221A]/60 border border-[rgba(16,185,129,0.10)]"
                    >
                      <div className="w-2.5 h-2.5 mt-1 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.8)] shrink-0" />

                      <div className="space-y-0.5">
                        <p className="font-bold text-xs text-[#ECFDF5]">
                          {event.status}
                        </p>

                        <p className="text-xs text-[#A7F3D0]/70 font-medium">
                          {event.description}
                        </p>

                        <p className="text-[10px] text-[#065F46] font-bold pt-0.5">
                          {event.timestamp
                            ? new Date(event.timestamp).toLocaleString()
                            : ""}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default WastePassport;