import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const TrackingMap = ({ shipment, passport }) => {
    const mapRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const origin =
            passport?.origin || shipment?.pickupLocation;

        const destination =
            passport?.destination || shipment?.deliveryLocation;

        if (
            !origin?.latitude ||
            !origin?.longitude ||
            !destination?.latitude ||
            !destination?.longitude
        ) {
            return;
        }

        // Prevent duplicate map initialization
        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
        }

        const map = L.map(containerRef.current).setView(
            [
                origin.latitude,
                origin.longitude
            ],
            7
        );

        mapRef.current = map;

        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution:
                    '&copy; OpenStreetMap contributors'
            }
        ).addTo(map);

        // Origin marker
        const originMarker = L.marker([
            origin.latitude,
            origin.longitude
        ]).addTo(map);

        originMarker.bindPopup(`
            <strong>Waste Origin</strong><br/>
            ${origin.address || origin.city || "Generator Location"}
        `);

        // Destination marker
        const destinationMarker = L.marker([
            destination.latitude,
            destination.longitude
        ]).addTo(map);

        destinationMarker.bindPopup(`
            <strong>Processing Facility</strong><br/>
            ${destination.address || destination.city || "Facility Location"}
        `);

        // Route line
        const routeLine = L.polyline(
            [
                [
                    origin.latitude,
                    origin.longitude
                ],
                [
                    destination.latitude,
                    destination.longitude
                ]
            ],
            {
                weight: 4,
                dashArray: "8 8"
            }
        ).addTo(map);

        // Fit map to route
        map.fitBounds(routeLine.getBounds(), {
            padding: [40, 40]
        });

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, [
        shipment,
        passport
    ]);

    const origin =
        passport?.origin || shipment?.pickupLocation;

    const destination =
        passport?.destination || shipment?.deliveryLocation;

    const hasCoordinates =
        origin?.latitude &&
        origin?.longitude &&
        destination?.latitude &&
        destination?.longitude;

    return (
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="mb-5">
                <p className="text-sm font-medium text-emerald-600">
                    ROUTE TRACKING
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-1">
                    Waste Journey
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    Track the movement from the waste generator to
                    the processing facility.
                </p>
            </div>

            {!hasCoordinates ? (
                <div className="h-72 rounded-xl bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center text-center p-6">
                    <div>
                        <div className="text-4xl mb-3">
                            📍
                        </div>

                        <h3 className="font-semibold text-gray-900">
                            Route Not Available
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                            Location coordinates will appear once
                            pickup and delivery locations are available.
                        </p>
                    </div>
                </div>
            ) : (
                <div
                    ref={containerRef}
                    className="w-full h-80 md:h-[420px] rounded-xl overflow-hidden border border-gray-200"
                />
            )}

            {hasCoordinates && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                    <div className="p-4 rounded-xl bg-gray-50">
                        <p className="text-xs uppercase text-gray-500">
                            Pickup
                        </p>

                        <p className="font-medium text-gray-900 mt-1">
                            {origin.address ||
                                origin.city ||
                                "Origin"}
                        </p>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-50">
                        <p className="text-xs uppercase text-gray-500">
                            Delivery
                        </p>

                        <p className="font-medium text-gray-900 mt-1">
                            {destination.address ||
                                destination.city ||
                                "Facility"}
                        </p>
                    </div>
                </div>
            )}
        </section>
    );
};

export default TrackingMap;