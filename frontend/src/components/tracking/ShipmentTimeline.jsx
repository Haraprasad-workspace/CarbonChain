import { useEffect, useRef } from "react";
import gsap from "gsap";

const steps = [
  {
    status: "CREATED",
    title: "Shipment Created",
    description: "Shipment has been created for the waste batch.",
  },
  {
    status: "ASSIGNED",
    title: "Logistics Assigned",
    description: "A logistics provider has been assigned.",
  },
  {
    status: "PICKUP_SCHEDULED",
    title: "Pickup Scheduled",
    description: "Waste pickup has been scheduled.",
  },
  {
    status: "PICKED_UP",
    title: "Waste Picked Up",
    description: "Waste has been collected from the generator.",
  },
  {
    status: "IN_TRANSIT",
    title: "In Transit",
    description: "Waste is currently being transported.",
  },
  {
    status: "DELIVERED",
    title: "Delivered",
    description: "Waste has reached the processing facility.",
  },
  {
    status: "PROCESSED",
    title: "Processed",
    description: "Waste has been processed and carbon impact recorded.",
  },
];

const ShipmentTimeline = ({ shipment, passport }) => {
  const timelineRef = useRef(null);

  const getStepIndex = () => {
    const passportMap = {
      REGISTERED: 0,
      MATCHED: 1,
      NEGOTIATED: 1,
      PAID: 1,
      COLLECTED: 3,
      IN_TRANSIT: 4,
      RECEIVED: 5,
      PROCESSED: 6,
    };

    if (passport?.lifecycleStatus) {
      return passportMap[passport.lifecycleStatus] ?? 0;
    }

    return steps.findIndex((step) => step.status === shipment?.status);
  };

  const currentIndex = getStepIndex();

  useEffect(() => {
    if (!timelineRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        timelineRef.current.querySelectorAll(".timeline-item"),
        {
          opacity: 0,
          x: -15,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: "power2.out",
        }
      );
    }, timelineRef);

    return () => ctx.revert();
  }, [shipment?.status, passport?.lifecycleStatus]);

  return (
    <section
      ref={timelineRef}
      className="bg-[#0B1610] border border-[rgba(16,185,129,0.15)] rounded-2xl p-6 shadow-[0_4px_12px_-2px_rgba(2,44,34,0.5)] font-['Montserrat',sans-serif] text-[#ECFDF5] backdrop-blur-[16px]"
    >
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-[rgba(16,185,129,0.15)]">
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#065F46]">
          Live Tracking
        </p>

        <h2 className="text-xl font-bold text-[#ECFDF5] mt-1 tracking-tight">
          Shipment Timeline
        </h2>

        <p className="text-xs text-[#A7F3D0]/70 mt-1 font-medium">
          Follow the waste through every stage of its lifecycle journey.
        </p>
      </div>

      {/* Steps List */}
      <div className="relative">
        {steps.map((step, index) => {
          const completed = index <= currentIndex;
          const active = index === currentIndex;

          return (
            <div
              key={step.status}
              className="timeline-item relative flex gap-4 pb-7 last:pb-0 group"
            >
              {/* Vertical Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute left-[11px] top-6 w-0.5 h-full transition-colors duration-300 ${
                    index < currentIndex
                      ? "bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                      : "bg-[#12221A]"
                  }`}
                />
              )}

              {/* Status Indicator Badge */}
              <div
                className={`relative z-10 w-6 h-6 rounded-full shrink-0 flex items-center justify-center border transition-all duration-300 ${
                  completed
                    ? "bg-[#10B981] border-[#34D399] shadow-[0_0_12px_rgba(16,185,129,0.5)]"
                    : "bg-[#12221A] border-[rgba(16,185,129,0.15)] text-[#065F46]"
                } ${
                  active
                    ? "ring-4 ring-[#10B981]/30 bg-[#34D399] border-[#34D399] shadow-[0_0_16px_rgba(52,211,153,0.7)] animate-pulse"
                    : ""
                }`}
              >
                {completed && (
                  <span
                    className={`text-xs font-black ${
                      active ? "text-[#050B07]" : "text-[#050B07]"
                    }`}
                  >
                    ✓
                  </span>
                )}
              </div>

              {/* Content Body */}
              <div className="-mt-0.5 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3
                    className={`text-xs font-bold tracking-tight transition-colors ${
                      active
                        ? "text-[#34D399]"
                        : completed
                        ? "text-[#ECFDF5]"
                        : "text-[#065F46]"
                    }`}
                  >
                    {step.title}
                  </h3>

                  {active && (
                    <span className="px-2 py-0.5 rounded-full bg-[#10B981]/10 text-[#34D399] text-[10px] font-bold border border-[#10B981]/30 uppercase tracking-wider shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                      Current State
                    </span>
                  )}
                </div>

                <p
                  className={`text-xs leading-relaxed transition-colors ${
                    active
                      ? "text-[#ECFDF5] font-medium"
                      : completed
                      ? "text-[#A7F3D0]/80"
                      : "text-[#065F46]"
                  }`}
                >
                  {step.description}
                </p>

                {active && shipment?.updatedAt && (
                  <p className="text-[10px] text-[#065F46] pt-1 font-semibold">
                    Updated{" "}
                    {new Date(shipment.updatedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Route Info Section */}
      {shipment?.route && (
        <div className="mt-6 pt-5 border-t border-[rgba(16,185,129,0.15)] grid grid-cols-2 gap-4">
          <div className="bg-[#12221A] border border-[rgba(16,185,129,0.15)] rounded-xl p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#065F46]">
              Route Distance
            </p>
            <p className="font-extrabold text-sm text-[#ECFDF5] mt-0.5">
              {shipment.route.distance ?? "--"}{" "}
              <span className="text-xs text-[#10B981] font-semibold">km</span>
            </p>
          </div>

          <div className="bg-[#12221A] border border-[rgba(16,185,129,0.15)] rounded-xl p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#065F46]">
              Estimated Time
            </p>
            <p className="font-extrabold text-sm text-[#ECFDF5] mt-0.5">
              {shipment.route.estimatedTime ?? "--"}{" "}
              <span className="text-xs text-[#10B981] font-semibold">min</span>
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default ShipmentTimeline;