import { useMemo } from "react";

const STEPS = [
  { key: "CREATED", label: "Created", desc: "Waiting for a logistics provider to be assigned." },
  { key: "ASSIGNED", label: "Assigned", desc: "A logistics provider has been assigned." },
  { key: "PICKUP_SCHEDULED", label: "Scheduled", desc: "Waste pickup has been scheduled." },
  { key: "PICKED_UP", label: "Picked Up", desc: "The waste has been collected from generator." },
  { key: "IN_TRANSIT", label: "In Transit", desc: "The waste is currently being transported." },
  { key: "DELIVERED", label: "Delivered", desc: "The waste has reached the facility safely." },
];

const ShipmentStatus = ({ status }) => {
  const isCancelled = status === "CANCELLED";

  // Calculate current active step index
  const activeIndex = useMemo(() => {
    return STEPS.findIndex((step) => step.key === status);
  }, [status]);

  return (
    <div className="bg-[#0B1610] border border-[rgba(16,185,129,0.15)] rounded-2xl p-6 shadow-[0_4px_12px_-2px_rgba(2,44,34,0.5)] space-y-6 font-['Montserrat',sans-serif] text-[#ECFDF5] backdrop-blur-[16px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[rgba(16,185,129,0.15)] pb-4">
        <div className="space-y-0.5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#065F46]">
            Tracking Timeline
          </span>
          <h3 className="text-base font-extrabold text-[#ECFDF5]">
            Shipment Status
          </h3>
        </div>

        {/* Current State Pill */}
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
            isCancelled
              ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
              : "bg-[#10B981]/10 text-[#34D399] border-[#10B981]/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
          }`}
        >
          {isCancelled ? "Cancelled" : STEPS[activeIndex]?.label || status}
        </span>
      </div>

      {/* Cancelled Banner State */}
      {isCancelled ? (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl space-y-1">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
            <svg
              className="w-4 h-4 text-rose-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Shipment Terminated</span>
          </div>
          <p className="text-xs text-rose-300 font-medium">
            This shipment thread was cancelled and is no longer active in transit.
          </p>
        </div>
      ) : (
        /* Progress Timeline List */
        <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-[#12221A]">
          {STEPS.map((step, idx) => {
            const isCompleted = activeIndex > idx;
            const isCurrent = activeIndex === idx;

            return (
              <div key={step.key} className="relative flex items-start gap-4 group">
                {/* Timeline Indicator Badge */}
                <div
                  className={`absolute -left-[24px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                    isCompleted
                      ? "bg-[#10B981] text-[#050B07] border border-[#34D399] shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                      : isCurrent
                      ? "bg-[#34D399] text-[#050B07] ring-4 ring-[#10B981]/30 shadow-[0_0_15px_rgba(52,211,153,0.6)] animate-pulse"
                      : "bg-[#12221A] text-[#065F46] border border-[rgba(16,185,129,0.15)]"
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      className="w-3.5 h-3.5 stroke-[3]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    idx + 1
                  )}
                </div>

                {/* Content */}
                <div className="space-y-0.5">
                  <h4
                    className={`text-xs font-bold tracking-tight ${
                      isCurrent
                        ? "text-[#34D399]"
                        : isCompleted
                        ? "text-[#ECFDF5]"
                        : "text-[#065F46]"
                    }`}
                  >
                    {step.label}
                  </h4>
                  <p
                    className={`text-[11px] leading-relaxed ${
                      isCurrent
                        ? "text-[#ECFDF5] font-medium"
                        : "text-[#A7F3D0]/70"
                    }`}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShipmentStatus;