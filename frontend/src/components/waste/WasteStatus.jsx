const WasteStatus = ({ status }) => {
  const statusSteps = [
    "REGISTERED",
    "MATCHED",
    "NEGOTIATED",
    "COLLECTED",
    "IN_TRANSIT",
    "RECEIVED",
    "PROCESSED",
  ];

  const isCancelled = status === "CANCELLED";
  const currentIndex = statusSteps.indexOf(status);

  return (
    <div className="w-full bg-[#0B1610] border border-[rgba(16,185,129,0.15)] rounded-2xl p-6 shadow-[0_4px_24px_-4px_rgba(2,44,34,0.6)] backdrop-blur-[16px] font-['Montserrat',sans-serif] text-[#ECFDF5] space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[rgba(16,185,129,0.15)] pb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#065F46]">
            Lifecycle Tracker
          </span>
          <h3 className="text-base font-black text-[#ECFDF5] tracking-tight mt-0.5">
            Waste Lifecycle Status
          </h3>
          <p className="text-xs text-[#A7F3D0]/70 mt-0.5 font-medium">
            Real-time tracking of waste batch progression
          </p>
        </div>

        {isCancelled && (
          <span className="px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-full text-xs font-bold tracking-wider uppercase shadow-[0_0_10px_rgba(244,63,94,0.15)]">
            Batch Cancelled
          </span>
        )}
      </div>

      {/* Cancelled State Banner */}
      {isCancelled ? (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3 text-rose-400 text-xs shadow-[0_0_10px_rgba(244,63,94,0.15)]">
          <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center font-black text-rose-400 shrink-0">
            ✕
          </div>
          <div>
            <p className="font-bold">This batch has been cancelled</p>
            <p className="text-rose-400/80 font-medium">
              The lifecycle process was terminated before completion.
            </p>
          </div>
        </div>
      ) : (
        /* Lifecycle Stepper Bar */
        <div className="relative py-2">
          {/* Horizontal Step Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 relative z-10">
            {statusSteps.map((step, index) => {
              const isCompleted = index < currentIndex;
              const isCurrent = index === currentIndex;

              return (
                <div
                  key={step}
                  className="flex flex-col items-center text-center space-y-2 group"
                >
                  {/* Step Icon Badge */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                      isCurrent
                        ? "bg-[#10B981] text-[#050B07] ring-4 ring-[#10B981]/20 shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-110 font-black"
                        : isCompleted
                        ? "bg-[#12221A] text-[#34D399] border border-[#10B981]/40"
                        : "bg-[#12221A] border border-[rgba(16,185,129,0.15)] text-[#A7F3D0]/40"
                    }`}
                  >
                    {isCompleted ? (
                      <svg className="w-4 h-4 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : isCurrent ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#050B07] animate-pulse" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* Step Label */}
                  <div className="space-y-0.5">
                    <p
                      className={`text-[11px] font-bold uppercase tracking-wide leading-tight ${
                        isCurrent
                          ? "text-[#34D399]"
                          : isCompleted
                          ? "text-[#ECFDF5]"
                          : "text-[#A7F3D0]/40"
                      }`}
                    >
                      {step.replaceAll("_", " ")}
                    </p>
                    <p className="text-[10px] text-[#A7F3D0]/60 font-medium">
                      {isCompleted ? "Completed" : isCurrent ? "Active Step" : "Pending"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

export default WasteStatus;