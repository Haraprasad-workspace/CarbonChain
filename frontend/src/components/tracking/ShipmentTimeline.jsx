import { useEffect, useRef } from "react";
import gsap from "gsap";

const steps = [
    {
        status: "CREATED",
        title: "Shipment Created",
        description: "Shipment has been created for the waste batch."
    },
    {
        status: "ASSIGNED",
        title: "Logistics Assigned",
        description: "A logistics provider has been assigned."
    },
    {
        status: "PICKUP_SCHEDULED",
        title: "Pickup Scheduled",
        description: "Waste pickup has been scheduled."
    },
    {
        status: "PICKED_UP",
        title: "Waste Picked Up",
        description: "Waste has been collected from the generator."
    },
    {
        status: "IN_TRANSIT",
        title: "In Transit",
        description: "Waste is currently being transported."
    },
    {
        status: "DELIVERED",
        title: "Delivered",
        description: "Waste has reached the processing facility."
    },
    {
        status: "PROCESSED",
        title: "Processed",
        description: "Waste has been processed and carbon impact recorded."
    }
];

const ShipmentTimeline = ({ shipment, passport }) => {
    const timelineRef = useRef(null);

    const currentStatus =
        passport?.lifecycleStatus ||
        shipment?.status ||
        "CREATED";

    const getStepIndex = () => {
        const passportMap = {
            REGISTERED: 0,
            MATCHED: 1,
            NEGOTIATED: 1,
            PAID: 1,
            COLLECTED: 3,
            IN_TRANSIT: 4,
            RECEIVED: 5,
            PROCESSED: 6
        };

        if (passport?.lifecycleStatus) {
            return passportMap[passport.lifecycleStatus] ?? 0;
        }

        return steps.findIndex(
            (step) => step.status === shipment?.status
        );
    };

    const currentIndex = getStepIndex();

    useEffect(() => {
        if (!timelineRef.current) return;

        gsap.fromTo(
            timelineRef.current.querySelectorAll(".timeline-item"),
            {
                opacity: 0,
                x: -15
            },
            {
                opacity: 1,
                x: 0,
                duration: 0.4,
                stagger: 0.08,
                ease: "power2.out"
            }
        );
    }, [shipment?.status, passport?.lifecycleStatus]);

    return (
        <section
            ref={timelineRef}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
        >
            <div className="mb-6">
                <p className="text-sm font-medium text-emerald-600">
                    LIVE TRACKING
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-1">
                    Shipment Timeline
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    Follow the waste through every stage of its journey.
                </p>
            </div>

            <div className="relative">
                {steps.map((step, index) => {
                    const completed = index <= currentIndex;
                    const active = index === currentIndex;

                    return (
                        <div
                            key={step.status}
                            className="timeline-item relative flex gap-4 pb-7 last:pb-0"
                        >
                            {/* Vertical line */}
                            {index < steps.length - 1 && (
                                <div
                                    className={`absolute left-[11px] top-6 w-0.5 h-full ${
                                        index < currentIndex
                                            ? "bg-emerald-500"
                                            : "bg-gray-200"
                                    }`}
                                />
                            )}

                            {/* Status circle */}
                            <div
                                className={`relative z-10 w-6 h-6 rounded-full shrink-0 flex items-center justify-center border-2 ${
                                    completed
                                        ? "bg-emerald-500 border-emerald-500"
                                        : "bg-white border-gray-300"
                                } ${
                                    active
                                        ? "ring-4 ring-emerald-100"
                                        : ""
                                }`}
                            >
                                {completed && (
                                    <span className="text-white text-xs font-bold">
                                        ✓
                                    </span>
                                )}
                            </div>

                            {/* Content */}
                            <div className="-mt-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3
                                        className={`font-semibold ${
                                            completed
                                                ? "text-gray-900"
                                                : "text-gray-400"
                                        }`}
                                    >
                                        {step.title}
                                    </h3>

                                    {active && (
                                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium">
                                            Current
                                        </span>
                                    )}
                                </div>

                                <p
                                    className={`text-sm mt-1 ${
                                        completed
                                            ? "text-gray-500"
                                            : "text-gray-400"
                                    }`}
                                >
                                    {step.description}
                                </p>

                                {active && shipment?.updatedAt && (
                                    <p className="text-xs text-gray-400 mt-2">
                                        Updated{" "}
                                        {new Date(
                                            shipment.updatedAt
                                        ).toLocaleString()}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Route information */}
            {shipment?.route && (
                <div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-gray-500">
                            Route Distance
                        </p>

                        <p className="font-semibold text-gray-900 mt-1">
                            {shipment.route.distance ?? "--"} km
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">
                            Estimated Time
                        </p>

                        <p className="font-semibold text-gray-900 mt-1">
                            {shipment.route.estimatedTime ?? "--"} min
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ShipmentTimeline;