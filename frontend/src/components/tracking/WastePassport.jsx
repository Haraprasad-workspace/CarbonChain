import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
    createWastePassport,
    getPassportByWaste
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

            const response = await getPassportByWaste(
                wasteBatch._id
            );

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
                    y: 20
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out"
                }
            );
        }
    }, [loading, passport]);

    const handleCreatePassport = async () => {
        try {
            setCreating(true);
            setError("");

            const response = await createWastePassport(
                wasteBatch._id
            );

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
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-10 bg-gray-200 rounded" />
                </div>
            </div>
        );
    }

    return (
        <section
            ref={cardRef}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
        >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <p className="text-sm font-medium text-emerald-600">
                        DIGITAL WASTE PASSPORT
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900 mt-1">
                        Waste Lifecycle Identity
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        Track this waste from registration to carbon processing.
                    </p>
                </div>

                {passport && (
                    <span className="px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold">
                        {passport.lifecycleStatus}
                    </span>
                )}
            </div>

            {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                    {error}
                </div>
            )}

            {!passport ? (
                <div className="border border-dashed border-gray-300 rounded-xl p-6 text-center">
                    <div className="text-4xl mb-3">♻️</div>

                    <h3 className="text-lg font-semibold text-gray-900">
                        No Digital Passport Yet
                    </h3>

                    <p className="text-sm text-gray-500 mt-1 mb-5">
                        Create a unique digital identity for this waste batch
                        and track its complete lifecycle.
                    </p>

                    <button
                        onClick={handleCreatePassport}
                        disabled={creating}
                        className="px-5 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50 transition"
                    >
                        {creating
                            ? "Creating Passport..."
                            : "Create Digital Passport"}
                    </button>
                </div>
            ) : (
                <div className="space-y-5">
                    {/* Passport ID */}
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                            Passport ID
                        </p>

                        <p className="text-lg font-bold text-gray-900 mt-1 break-all">
                            {passport.passportId}
                        </p>
                    </div>

                    {/* Waste information */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-gray-50">
                            <p className="text-xs text-gray-500">
                                Waste Type
                            </p>
                            <p className="font-semibold text-gray-900 mt-1">
                                {passport.wasteType}
                            </p>
                        </div>

                        <div className="p-4 rounded-xl bg-gray-50">
                            <p className="text-xs text-gray-500">
                                Quantity
                            </p>
                            <p className="font-semibold text-gray-900 mt-1">
                                {passport.quantity?.value}{" "}
                                {passport.quantity?.unit}
                            </p>
                        </div>

                        <div className="p-4 rounded-xl bg-gray-50">
                            <p className="text-xs text-gray-500">
                                Lifecycle Status
                            </p>
                            <p className="font-semibold text-emerald-600 mt-1">
                                {passport.lifecycleStatus}
                            </p>
                        </div>
                    </div>

                    {/* Origin / Destination */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-gray-200">
                            <p className="text-xs uppercase text-gray-500">
                                Origin
                            </p>

                            <p className="font-medium text-gray-900 mt-2">
                                {passport.origin?.address ||
                                    passport.origin?.city ||
                                    "Not available"}
                            </p>
                        </div>

                        <div className="p-4 rounded-xl border border-gray-200">
                            <p className="text-xs uppercase text-gray-500">
                                Destination
                            </p>

                            <p className="font-medium text-gray-900 mt-2">
                                {passport.destination?.address ||
                                    passport.destination?.city ||
                                    "Not assigned"}
                            </p>
                        </div>
                    </div>

                    {/* Carbon Impact */}
                    {passport.carbonImpact?.co2eAvoided !== undefined && (
                        <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-100">
                            <p className="text-sm font-medium text-emerald-700">
                                Carbon Impact
                            </p>

                            <p className="text-3xl font-bold text-emerald-800 mt-1">
                                {passport.carbonImpact.co2eAvoided} tCO₂e
                            </p>

                            <p className="text-sm text-emerald-600 mt-1">
                                CO₂ equivalent emissions avoided
                            </p>
                        </div>
                    )}

                    {/* Events */}
                    {passport.events?.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Lifecycle Events
                            </h3>

                            <div className="space-y-3">
                                {passport.events
                                    .slice()
                                    .reverse()
                                    .map((event, index) => (
                                        <div
                                            key={`${event.timestamp}-${index}`}
                                            className="flex gap-3"
                                        >
                                            <div className="w-3 h-3 mt-2 rounded-full bg-emerald-500 shrink-0" />

                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {event.status}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    {event.description}
                                                </p>

                                                <p className="text-xs text-gray-400 mt-1">
                                                    {event.timestamp
                                                        ? new Date(
                                                              event.timestamp
                                                          ).toLocaleString()
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