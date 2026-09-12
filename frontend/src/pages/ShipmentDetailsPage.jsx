import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import gsap from "gsap";

import {
  getShipment,
  updateShipmentStatus,
} from "../services/shipmentService";

import { syncShipmentTracking } from "../services/trackingService";

import ShipmentDetails from "../components/shipment/ShipmentDetails";
import useAuth from "../hooks/useAuth";

const ShipmentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");

  const pageRef = useRef(null);

  const canManageShipment =
    user?.role === "LOGISTICS_PROVIDER" ||
    user?.role === "ADMIN";

  const canAssignLogistics =
    ["WASTE_GENERATOR", "FACILITY", "ADMIN"].includes(user?.role) &&
    !shipment?.logisticsProvider &&
    !["DELIVERED", "CANCELLED"].includes(shipment?.status);

  const fetchShipment = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getShipment(id);
      setShipment(data.shipment);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch shipment details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipment();
  }, [id]);

  useEffect(() => {
    if (!loading && shipment && pageRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          pageRef.current,
          {
            opacity: 0,
            y: 15,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
          }
        );
      }, pageRef);

      return () => ctx.revert();
    }
  }, [loading, shipment]);

  const handleStatusUpdate = async (status) => {
    if (!canManageShipment) return;

    try {
      setUpdating(true);
      setError("");

      await updateShipmentStatus(id, status);

      // Sync digital waste passport
      try {
        await syncShipmentTracking(id);
      } catch (syncError) {
        console.warn(
          "Tracking sync failed:",
          syncError.response?.data?.message ||
            syncError.message
        );
      }

      await fetchShipment();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update shipment status."
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleTrackingSync = async () => {
    try {
      setSyncing(true);
      setError("");

      await syncShipmentTracking(id);

      await fetchShipment();

    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to synchronize tracking."
      );
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1610] font-['Montserrat',sans-serif] p-6 flex flex-col items-center justify-center space-y-4">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[rgba(16,185,129,0.15)] border-t-[#10B981] rounded-full animate-spin shadow-[0_0_10px_rgba(16,185,129,0.2)]" />
          <div className="absolute w-4 h-4 bg-[#12221A] rounded-full" />
        </div>

        <p className="text-xs font-bold uppercase tracking-widest text-[#A7F3D0]/70 animate-pulse">
          Loading Shipment Context...
        </p>
      </div>
    );
  }

  if (error && !shipment) {
    return (
      <div className="min-h-screen bg-[#0B1610] font-['Montserrat',sans-serif] p-6 flex items-center justify-center">
        <div className="bg-[#0B1610] border border-rose-500/30 rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-[0_4px_24px_-4px_rgba(2,44,34,0.6)] backdrop-blur-[16px]">

          <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold border border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.15)]">
            ✕
          </div>

          <div className="space-y-1">
            <h4 className="text-base font-black text-rose-300 tracking-tight">
              Unable to Load Shipment
            </h4>

            <p className="text-xs text-[#A7F3D0]/70 font-medium">
              {error}
            </p>
          </div>

          <div className="flex gap-3 justify-center pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-[#12221A] border border-[rgba(16,185,129,0.15)] text-[#ECFDF5] font-semibold text-xs rounded-xl hover:bg-[rgba(16,185,129,0.1)] transition-all cursor-pointer"
            >
              Back
            </button>

            <button
              type="button"
              onClick={fetchShipment}
              className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-[#050B07] font-black text-xs rounded-xl cursor-pointer transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="min-h-screen bg-[#0B1610] font-['Montserrat',sans-serif] p-6 flex items-center justify-center">
        <div className="bg-[#0B1610] border border-[rgba(16,185,129,0.15)] rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-[0_4px_24px_-4px_rgba(2,44,34,0.6)] backdrop-blur-[16px]">

          <p className="text-xs font-bold text-[#A7F3D0]/70 uppercase tracking-wider">
            Shipment Record Not Found
          </p>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-[#050B07] font-black text-xs rounded-xl transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            Return to Shipments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#0B1610] font-['Montserrat',sans-serif] text-[#ECFDF5] p-4 sm:p-[28px] space-y-6 max-w-7xl mx-auto selection:bg-[#10B981]/30 selection:text-[#ECFDF5]"
    >

      {/* Navigation */}
      <div className="flex items-center justify-between border-b border-[rgba(16,185,129,0.15)] pb-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#A7F3D0]/70 hover:text-[#ECFDF5] transition-colors cursor-pointer group"
        >
          <svg
            className="w-4 h-4 text-[#10B981] group-hover:-translate-x-0.5 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>

          <span>Back to Shipments</span>
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex items-center justify-between gap-4 text-xs text-rose-400 font-semibold shadow-[0_0_10px_rgba(244,63,94,0.15)]">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            className="text-rose-300 font-bold hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Shipment Details */}
      <ShipmentDetails shipment={shipment} />

      {/* Tracking / Digital Passport */}
      <div className="bg-[#0B1610] border border-[rgba(16,185,129,0.15)] rounded-2xl p-5 shadow-[0_4px_24px_-4px_rgba(2,44,34,0.6)] backdrop-blur-[16px]">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#12221A] border border-[#10B981]/40 text-[#10B981] flex items-center justify-center shrink-0 text-lg shadow-[0_0_10px_rgba(16,185,129,0.15)]">
              📍
            </div>

            <div>
              <span className="block text-[10px] font-extrabold uppercase tracking-widest text-[#065F46]">
                Digital Waste Passport
              </span>

              <p className="mt-1 text-sm font-black text-[#ECFDF5] tracking-tight">
                Track the complete waste journey
              </p>

              <p className="mt-0.5 text-xs text-[#A7F3D0]/70 font-medium">
                View shipment timeline, route, lifecycle events and carbon impact.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">

            <button
              type="button"
              onClick={() =>
                navigate(`/tracking?shipment=${shipment._id}`)
              }
              className="w-full sm:w-auto px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-[#050B07] font-black text-xs rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Track Shipment</span>
              <span>→</span>
            </button>

            <button
              type="button"
              disabled={syncing}
              onClick={handleTrackingSync}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#12221A] hover:bg-[#12221A]/80 border border-[rgba(16,185,129,0.15)] text-[#ECFDF5] font-bold text-xs rounded-xl transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {syncing && (
                <span className="w-3.5 h-3.5 border-2 border-[#ECFDF5] border-t-transparent rounded-full animate-spin" />
              )}

              <span>
                {syncing ? "Syncing..." : "Sync Tracking"}
              </span>
            </button>

          </div>
        </div>

        {/* Current status */}
        <div className="mt-5 pt-4 border-t border-[rgba(16,185,129,0.15)] flex flex-wrap items-center gap-3">

          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#065F46]">
            Current Status
          </span>

          <span className="px-3 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[#34D399] text-[10px] font-bold shadow-[0_0_10px_rgba(16,185,129,0.15)]">
            {shipment.status}
          </span>

          {shipment.route?.distance && (
            <span className="text-[10px] font-semibold text-[#A7F3D0]/70">
              {shipment.route.distance} km
            </span>
          )}

          {shipment.route?.estimatedTime && (
            <span className="text-[10px] font-semibold text-[#A7F3D0]/70">
              ~{shipment.route.estimatedTime} min
            </span>
          )}

        </div>
      </div>

      {/* Assign Logistics Provider */}
      {canAssignLogistics && (
        <div className="bg-[#0B1610] border border-[rgba(16,185,129,0.15)] rounded-2xl p-5 shadow-[0_4px_24px_-4px_rgba(2,44,34,0.6)] backdrop-blur-[16px] flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#12221A] border border-[#10B981]/40 text-[#10B981] flex items-center justify-center shrink-0 text-lg shadow-[0_0_10px_rgba(16,185,129,0.15)]">
              🚛
            </div>

            <div>
              <span className="block text-[10px] font-extrabold uppercase tracking-widest text-[#065F46]">
                Transport Assignment
              </span>

              <p className="mt-1 text-sm font-black text-[#ECFDF5] tracking-tight">
                No logistics provider assigned
              </p>

              <p className="mt-0.5 text-xs text-[#A7F3D0]/70 font-medium">
                Assign a transport partner to begin the shipment workflow.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate(`/shipments/${id}/assign`)
            }
            className="w-full sm:w-auto px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-[#050B07] font-black text-xs rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Assign Logistics Provider</span>
            <span>→</span>
          </button>
        </div>
      )}

      {/* Assigned Provider Info */}
      {shipment.logisticsProvider && (
        <div className="bg-[#12221A] border border-[#10B981]/30 rounded-2xl p-4 flex items-center gap-3 shadow-[0_0_15px_rgba(16,185,129,0.1)]">

          <div className="w-9 h-9 rounded-xl bg-[#10B981] text-[#050B07] flex items-center justify-center font-black shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
            ✓
          </div>

          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-widest text-[#34D399]">
              Logistics Assigned
            </span>

            <p className="text-sm font-black text-[#ECFDF5] tracking-tight mt-0.5">
              {shipment.logisticsProvider.organization ||
                shipment.logisticsProvider.name}
            </p>

            {shipment.vehicleNumber && (
              <p className="text-xs text-[#A7F3D0]/70 font-medium mt-0.5">
                Vehicle: {shipment.vehicleNumber}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Operational Actions */}
      {canManageShipment &&
        [
          "ASSIGNED",
          "PICKUP_SCHEDULED",
          "PICKED_UP",
          "IN_TRANSIT",
        ].includes(shipment.status) && (
          <div className="bg-[#0B1610] border border-[rgba(16,185,129,0.15)] rounded-2xl p-4 shadow-[0_8px_32px_rgba(2,44,34,0.7)] backdrop-blur-[16px] flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky bottom-6 z-10">

            <div className="space-y-0.5">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#065F46]">
                Logistics Provider Action
              </span>

              <p className="text-xs font-bold text-[#ECFDF5]">
                Advance shipment workflow
              </p>
            </div>

            <div className="flex items-center gap-3">

              {/* Schedule Pickup */}
              {shipment.status === "ASSIGNED" && (
                <button
                  type="button"
                  disabled={updating}
                  onClick={() =>
                    handleStatusUpdate("PICKUP_SCHEDULED")
                  }
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] active:bg-[#047857] disabled:opacity-50 text-[#050B07] font-black text-xs rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  {updating && (
                    <span className="w-3.5 h-3.5 border-2 border-[#050B07] border-t-transparent rounded-full animate-spin" />
                  )}

                  <span>Schedule Pickup</span>
                </button>
              )}

              {/* Picked Up */}
              {shipment.status === "PICKUP_SCHEDULED" && (
                <button
                  type="button"
                  disabled={updating}
                  onClick={() =>
                    handleStatusUpdate("PICKED_UP")
                  }
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] active:bg-[#047857] disabled:opacity-50 text-[#050B07] font-black text-xs rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  {updating && (
                    <span className="w-3.5 h-3.5 border-2 border-[#050B07] border-t-transparent rounded-full animate-spin" />
                  )}

                  <span>Mark Picked Up</span>
                </button>
              )}

              {/* Start Transit */}
              {shipment.status === "PICKED_UP" && (
                <button
                  type="button"
                  disabled={updating}
                  onClick={() =>
                    handleStatusUpdate("IN_TRANSIT")
                  }
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] active:bg-[#047857] disabled:opacity-50 text-[#050B07] font-black text-xs rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  {updating && (
                    <span className="w-3.5 h-3.5 border-2 border-[#050B07] border-t-transparent rounded-full animate-spin" />
                  )}

                  <span>Start Transit</span>
                </button>
              )}

              {/* Delivered */}
              {shipment.status === "IN_TRANSIT" && (
                <button
                  type="button"
                  disabled={updating}
                  onClick={() =>
                    handleStatusUpdate("DELIVERED")
                  }
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] active:bg-[#047857] disabled:opacity-50 text-[#050B07] font-black text-xs rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  {updating && (
                    <span className="w-3.5 h-3.5 border-2 border-[#050B07] border-t-transparent rounded-full animate-spin" />
                  )}

                  <span>Mark Delivered</span>
                </button>
              )}

            </div>
          </div>
        )}

    </div>
  );
};

export default ShipmentDetailsPage;