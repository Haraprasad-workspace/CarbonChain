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
    <div className="bg-white border border-[#E8DDCB] rounded-2xl p-6 shadow-xs space-y-6 font-['Montserrat',sans-serif] text-[#422D0B]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E8DDCB] pb-4">
        <div className="space-y-0.5">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#967A53]">
            Tracking Timeline
          </span>
          <h3 className="text-base font-black text-[#422D0B]">
            Shipment Status
          </h3>
        </div>

        {/* Current State Pill */}
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
            isCancelled
              ? "bg-rose-50 text-rose-800 border-rose-200"
              : "bg-[#FFFBF5] text-[#FFA800] border-[#E8DDCB]"
          }`}
        >
          {isCancelled ? "Cancelled" : STEPS[activeIndex]?.label || status}
        </span>
      </div>

      {/* Cancelled Banner State */}
      {isCancelled ? (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-1">
          <div className="flex items-center gap-2 text-rose-800 font-extrabold text-xs">
            <svg
              className="w-4 h-4 text-rose-600"
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
          <p className="text-xs text-rose-700 font-medium">
            This shipment thread was cancelled and is no longer active in transit.
          </p>
        </div>
      ) : (
        /* Progress Timeline List */
        <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E8DDCB]">
          {STEPS.map((step, idx) => {
            const isCompleted = activeIndex > idx;
            const isCurrent = activeIndex === idx;

            return (
              <div key={step.key} className="relative flex items-start gap-4 group">
                {/* Timeline Indicator Badge */}
                <div
                  className={`absolute -left-[24px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all duration-300 ${
                    isCompleted
                      ? "bg-[#FFA800] text-[#422D0B] shadow-2xs ring-4 ring-[#FFFBF5]"
                      : isCurrent
                      ? "bg-[#422D0B] text-white ring-4 ring-[#FFA800]/30 animate-pulse"
                      : "bg-[#FFFBF5] text-[#967A53] border border-[#E8DDCB]"
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
                    className={`text-xs font-black tracking-tight ${
                      isCurrent
                        ? "text-[#FFA800]"
                        : isCompleted
                        ? "text-[#422D0B]"
                        : "text-[#967A53]"
                    }`}
                  >
                    {step.label}
                  </h4>
                  <p
                    className={`text-[11px] leading-relaxed ${
                      isCurrent
                        ? "text-[#422D0B] font-bold"
                        : "text-[#967A53]"
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