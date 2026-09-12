import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const TrackingMap = ({ shipment, passport }) => {
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const origin = passport?.origin || shipment?.pickupLocation;
    const destination = passport?.destination || shipment?.deliveryLocation;

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

    const map = L.map(containerRef.current, {
      zoomControl: false, // Customized controls can be placed or default disabled for clean UI
    }).setView([origin.latitude, origin.longitude], 7);

    mapRef.current = map;

    // Add Zoom Control on top right
    L.control.zoom({ position: "topright" }).addTo(map);

    // Dark Mode Tile Layer (CartoDB Dark Matter) for seamless integration with Dark Forest design system
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(map);

    // Custom Glowing Green Leaflet Marker Icons
    const createCustomIcon = (label, color = "#10B981") => {
      return L.divIcon({
        className: "custom-map-pin",
        html: `
          <div style="
            background-color: ${color};
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 3px solid #050B07;
            box-shadow: 0 0 15px ${color};
          "></div>
        `,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
    };

    // Origin marker
    const originMarker = L.marker([origin.latitude, origin.longitude], {
      icon: createCustomIcon("Origin", "#10B981"),
    }).addTo(map);

    originMarker.bindPopup(`
      <div style="font-family: 'Montserrat', sans-serif; color: #050B07; padding: 2px;">
        <strong style="color: #065F46; font-size: 11px; text-transform: uppercase;">Waste Origin</strong><br/>
        <span style="font-size: 12px; font-weight: 700;">${
          origin.address || origin.city || "Generator Location"
        }</span>
      </div>
    `);

    // Destination marker
    const destinationMarker = L.marker(
      [destination.latitude, destination.longitude],
      {
        icon: createCustomIcon("Destination", "#34D399"),
      }
    ).addTo(map);

    destinationMarker.bindPopup(`
      <div style="font-family: 'Montserrat', sans-serif; color: #050B07; padding: 2px;">
        <strong style="color: #065F46; font-size: 11px; text-transform: uppercase;">Processing Facility</strong><br/>
        <span style="font-size: 12px; font-weight: 700;">${
          destination.address || destination.city || "Facility Location"
        }</span>
      </div>
    `);

    // Route line (Emerald Glow Polyline)
    const routeLine = L.polyline(
      [
        [origin.latitude, origin.longitude],
        [destination.latitude, destination.longitude],
      ],
      {
        color: "#10B981",
        weight: 3,
        dashArray: "8, 8",
        opacity: 0.9,
      }
    ).addTo(map);

    // Fit map to route with padding
    map.fitBounds(routeLine.getBounds(), {
      padding: [50, 50],
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [shipment, passport]);

  const origin = passport?.origin || shipment?.pickupLocation;
  const destination = passport?.destination || shipment?.deliveryLocation;

  const hasCoordinates =
    origin?.latitude &&
    origin?.longitude &&
    destination?.latitude &&
    destination?.longitude;

  return (
    <section className="bg-[#0B1610] border border-[rgba(16,185,129,0.15)] rounded-2xl p-6 shadow-[0_4px_12px_-2px_rgba(2,44,34,0.5)] font-['Montserrat',sans-serif] text-[#ECFDF5] backdrop-blur-[16px]">
      {/* Header */}
      <div className="mb-5 pb-4 border-b border-[rgba(16,185,129,0.15)]">
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#065F46]">
          Route Tracking
        </p>

        <h2 className="text-xl font-bold text-[#ECFDF5] mt-1 tracking-tight">
          Waste Journey
        </h2>

        <p className="text-xs text-[#A7F3D0]/70 mt-1 font-medium">
          Track real-time movement from generator source to designated
          processing facility.
        </p>
      </div>

      {/* Map or Empty State */}
      {!hasCoordinates ? (
        <div className="h-72 rounded-xl bg-[#12221A] border border-dashed border-[rgba(16,185,129,0.25)] flex items-center justify-center text-center p-6">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-[#0B1610] border border-[rgba(16,185,129,0.30)] text-[#10B981] rounded-2xl flex items-center justify-center mx-auto text-xl shadow-xs">
              📍
            </div>

            <h3 className="font-bold text-sm text-[#ECFDF5]">
              Route Coordinates Not Available
            </h3>

            <p className="text-xs text-[#065F46] max-w-xs mx-auto font-semibold">
              Location GPS metrics will render automatically once pickup &
              facility destinations are assigned.
            </p>
          </div>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="w-full h-80 md:h-[420px] rounded-xl overflow-hidden border border-[rgba(16,185,129,0.20)] shadow-inner"
        />
      )}

      {/* Location Details Footer Grid */}
      {hasCoordinates && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <div className="p-4 rounded-xl bg-[#12221A] border border-[rgba(16,185,129,0.15)] space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#065F46]">
                Pickup Point
              </p>
            </div>

            <p className="font-bold text-xs text-[#ECFDF5] truncate">
              {origin.address || origin.city || "Origin Location"}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#12221A] border border-[rgba(16,185,129,0.15)] space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#34D399] shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-[#065F46]">
                Delivery Facility
              </p>
            </div>

            <p className="font-bold text-xs text-[#ECFDF5] truncate">
              {destination.address || destination.city || "Facility Location"}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default TrackingMap;