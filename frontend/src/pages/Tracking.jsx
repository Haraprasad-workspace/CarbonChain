import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto" />

                    <p className="text-gray-500 mt-4">
                        Loading tracking information...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-emerald-600">
                            CARBONCHAIN
                        </p>

                        <h1 className="text-3xl font-bold text-gray-900 mt-1">
                            Waste Tracking
                        </h1>

                        <p className="text-gray-500 mt-1">
                            Track the complete journey and carbon lifecycle
                            of your waste.
                        </p>
                    </div>

                    {(shipmentId || wasteBatchId) && (
                        <button
                            onClick={handleSync}
                            disabled={syncing}
                            className="px-5 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50 transition"
                        >
                            {syncing
                                ? "Syncing..."
                                : "↻ Sync Tracking"}
                        </button>
                    )}
                </div>

                {/* Error */}
                {error && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600">
                        {error}
                    </div>
                )}

                {/* No ID */}
                {!wasteBatchId && !shipmentId && (
                    <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
                        <div className="text-5xl mb-4">
                            ♻️
                        </div>

                        <h2 className="text-xl font-bold text-gray-900">
                            Select a Waste Batch
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Open tracking from a waste batch or shipment
                            to view its digital passport.
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

                        <div className="bg-white rounded-2xl border border-gray-200 p-5">
                            <p className="text-sm text-gray-500">
                                Current Status
                            </p>

                            <p className="text-xl font-bold text-emerald-600 mt-2">
                                {passport?.lifecycleStatus ||
                                    shipment?.status ||
                                    "REGISTERED"}
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-5">
                            <p className="text-sm text-gray-500">
                                Route Distance
                            </p>

                            <p className="text-xl font-bold text-gray-900 mt-2">
                                {shipment?.route?.distance
                                    ? `${shipment.route.distance} km`
                                    : "--"}
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-5">
                            <p className="text-sm text-gray-500">
                                Carbon Avoided
                            </p>

                            <p className="text-xl font-bold text-gray-900 mt-2">
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