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
    <div className="w-full bg-white border border-[#E8DDCB] rounded-2xl p-6 shadow-sm font-['Montserrat',sans-serif] text-[#422D0B] space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E8DDCB] pb-4">
        <div>
          <h3 className="text-base font-extrabold text-[#422D0B] tracking-tight">
            Waste Lifecycle Status
          </h3>
          <p className="text-xs text-[#967A53] mt-0.5">
            Real-time tracking of waste batch progression
          </p>
        </div>

        {isCancelled && (
          <span className="px-3 py-1 bg-red-100 text-red-800 border border-red-300 rounded-full text-xs font-bold tracking-wider uppercase">
            Batch Cancelled
          </span>
        )}
      </div>

      {/* Cancelled State Banner */}
      {isCancelled ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-800 text-xs">
          <div className="w-8 h-8 rounded-full bg-red-200 flex items-center justify-center font-bold text-red-700 shrink-0">
            ✕
          </div>
          <div>
            <p className="font-bold">This batch has been cancelled</p>
            <p className="text-red-600">
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
                        ? "bg-[#FFA800] text-[#422D0B] ring-4 ring-[#FFA800]/20 shadow-md scale-110"
                        : isCompleted
                        ? "bg-[#422D0B] text-[#FFFBF5]"
                        : "bg-[#FFFBF5] border border-[#E8DDCB] text-[#967A53]"
                    }`}
                  >
                    {isCompleted ? (
                      <svg className="w-4 h-4 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : isCurrent ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#422D0B] animate-pulse" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* Step Label */}
                  <div className="space-y-0.5">
                    <p
                      className={`text-[11px] font-extrabold uppercase leading-tight ${
                        isCurrent
                          ? "text-[#FFA800]"
                          : isCompleted
                          ? "text-[#422D0B]"
                          : "text-[#967A53]"
                      }`}
                    >
                      {step.replaceAll("_", " ")}
                    </p>
                    <p className="text-[10px] text-[#967A53]">
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