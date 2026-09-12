import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import gsap from "gsap";
import WastePassport from "../components/tracking/WastePassport";
import ShipmentTimeline from "../components/tracking/ShipmentTimeline";
import TrackingMap from "../components/tracking/TrackingMap";
import {
    getPassportByWaste,
    syncShipmentTracking,
    syncCarbonRecord
} from "../services/trackingService";
import { getShipment } from "../services/shipmentService";

const Tracking = () => {
    const [searchParams] = useSearchParams();
    const containerRef = useRef(null);

    const wasteBatchId = searchParams.get("waste");
    const shipmentId = searchParams.get("shipment");

    const [passport, setPassport] = useState(null);
    const [shipment, setShipment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [error, setError] = useState("");

    const fetchTrackingData = async () => {
        try {
            setLoading(true);
            setError("");

            let passportData = null;
            let shipmentData = null;

            if (wasteBatchId) {
                try {
                    const response =
                        await getPassportByWaste(wasteBatchId);

                    passportData = response?.passport || null;
                } catch (err) {
                    if (err.response?.status !== 404) {
                        throw err;
                    }
                }
            }

            if (shipmentId) {
                const response = await getShipment(shipmentId);

                shipmentData =
                    response?.shipment || null;

                if (shipmentData?.wasteBatch?._id) {
                    try {
                        const passportResponse =
                            await getPassportByWaste(
                                shipmentData.wasteBatch._id
                            );

                        passportData =
                            passportResponse?.passport || passportData;
                    } catch (err) {
                        // Passport may not exist yet
                    }
                }
            }

            setPassport(passportData);
            setShipment(shipmentData);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to load tracking information."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrackingData();
    }, [wasteBatchId, shipmentId]);

    useEffect(() => {
        if (!loading && containerRef.current) {
            gsap.fromTo(
                containerRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
            );
        }
    }, [loading]);

    const handleSync = async () => {
        try {
            setSyncing(true);
            setError("");

            if (shipmentId) {
                await syncShipmentTracking(shipmentId);
            }

            const batchId =
                wasteBatchId ||
                shipment?.wasteBatch?._id;

            if (batchId) {
                await syncCarbonRecord(batchId).catch(() => {});
            }

            await fetchTrackingData();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Failed to synchronize tracking data."
            );
        } finally {
            setSyncing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B1610] flex items-center justify-center font-['Montserrat',sans-serif]">
                <div className="text-center">
                    <div className="relative flex items-center justify-center mb-3">
                        <div className="w-10 h-10 border-4 border-[rgba(16,185,129,0.15)] border-t-[#10B981] rounded-full animate-spin shadow-[0_0_10px_rgba(16,185,129,0.2)] mx-auto" />
                        <div className="absolute w-4 h-4 bg-[#12221A] rounded-full" />
                    </div>
                    <p className="text-xs font-bold text-[#A7F3D0]/75 tracking-wider uppercase mt-2">
                        Loading tracking information...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div 
            ref={containerRef}
            className="min-h-screen bg-[#0B1610] text-[#ECFDF5] font-['Montserrat',sans-serif] p-4 md:p-8"
        >
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[rgba(16,185,129,0.15)] pb-5">
                    <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#065F46]">
                            CARBONCHAIN PORTAL
                        </span>

                        <h1 className="text-2xl md:text-3xl font-black text-[#ECFDF5] tracking-tight mt-0.5">
                            Waste Tracking
                        </h1>

                        <p className="text-xs text-[#A7F3D0]/70 mt-1 font-medium">
                            Track the complete journey and carbon lifecycle of your waste.
                        </p>
                    </div>

                    {(shipmentId || wasteBatchId) && (
                        <button
                            onClick={handleSync}
                            disabled={syncing}
                            className="px-5 py-2.5 rounded-xl bg-[#10B981] text-[#050B07] font-black text-xs hover:bg-[#059669] disabled:opacity-50 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {syncing ? (
                                <>
                                    <div className="w-3.5 h-3.5 border-2 border-[#050B07] border-t-transparent rounded-full animate-spin" />
                                    <span>Syncing...</span>
                                </>
                            ) : (
                                <span>↻ Sync Tracking</span>
                            )}
                        </button>
                    )}
                </div>

                {/* Error */}
                {error && (
                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold shadow-[0_0_10px_rgba(244,63,94,0.15)]">
                        {error}
                    </div>
                )}

                {/* No ID */}
                {!wasteBatchId && !shipmentId && (
                    <div className="bg-[#0B1610] rounded-2xl border border-[rgba(16,185,129,0.15)] p-10 text-center shadow-[0_4px_24px_-4px_rgba(2,44,34,0.6)] backdrop-blur-[16px]">
                        <div className="text-4xl mb-3">
                            ♻️
                        </div>

                        <h2 className="text-base font-bold text-[#ECFDF5]">
                            Select a Waste Batch
                        </h2>

                        <p className="text-xs text-[#A7F3D0]/70 mt-1 font-medium max-w-sm mx-auto">
                            Open tracking from a waste batch or shipment to view its digital passport.
                        </p>
                    </div>
                )}

                {/* Digital Passport */}
                {passport && (
                    <WastePassport
                        wasteBatch={
                            passport.wasteBatch || {
                                _id: wasteBatchId
                            }
                        }
                    />
                )}

                {/* Passport creation */}
                {!passport && wasteBatchId && (
                    <WastePassport
                        wasteBatch={{
                            _id: wasteBatchId
                        }}
                    />
                )}

                {/* Timeline */}
                {(shipment || passport) && (
                    <ShipmentTimeline
                        shipment={shipment}
                        passport={passport}
                    />
                )}

                {/* Map */}
                {(shipment || passport) && (
                    <TrackingMap
                        shipment={shipment}
                        passport={passport}
                    />
                )}

                {/* Tracking summary */}
                {(shipment || passport) && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        <div className="bg-[#0B1610] rounded-2xl border border-[rgba(16,185,129,0.15)] p-5 shadow-[0_4px_24px_-4px_rgba(2,44,34,0.6)] backdrop-blur-[16px]">
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#065F46]">
                                Status Metric
                            </p>
                            <p className="text-xs text-[#A7F3D0]/70 mt-1 font-medium">
                                Current Status
                            </p>

                            <p className="text-lg font-black text-[#34D399] mt-1">
                                {passport?.lifecycleStatus ||
                                    shipment?.status ||
                                    "REGISTERED"}
                            </p>
                        </div>

                        <div className="bg-[#0B1610] rounded-2xl border border-[rgba(16,185,129,0.15)] p-5 shadow-[0_4px_24px_-4px_rgba(2,44,34,0.6)] backdrop-blur-[16px]">
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#065F46]">
                                Distance Metric
                            </p>
                            <p className="text-xs text-[#A7F3D0]/70 mt-1 font-medium">
                                Route Distance
                            </p>

                            <p className="text-lg font-black text-[#ECFDF5] mt-1">
                                {shipment?.route?.distance
                                    ? `${shipment.route.distance} km`
                                    : "--"}
                            </p>
                        </div>

                        <div className="bg-[#0B1610] rounded-2xl border border-[rgba(16,185,129,0.15)] p-5 shadow-[0_4px_24px_-4px_rgba(2,44,34,0.6)] backdrop-blur-[16px]">
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#065F46]">
                                Impact Metric
                            </p>
                            <p className="text-xs text-[#A7F3D0]/70 mt-1 font-medium">
                                Carbon Avoided
                            </p>

                            <p className="text-lg font-black text-[#ECFDF5] mt-1">
                                {passport?.carbonImpact?.co2eAvoided !==
                                undefined
                                    ? `${passport.carbonImpact.co2eAvoided} tCO₂e`
                                    : "--"}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tracking;