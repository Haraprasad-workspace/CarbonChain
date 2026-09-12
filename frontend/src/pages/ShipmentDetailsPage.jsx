import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import gsap from "gsap";

import {
  getShipment,
  updateShipmentStatus,
} from "../services/shipmentService";

import ShipmentDetails from "../components/shipment/ShipmentDetails";

const ShipmentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const pageRef = useRef(null);

  const fetchShipment = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getShipment(id);
      setShipment(data.shipment);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch shipment details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipment();
  }, [id]);

  // Entrance animation on data load
  useEffect(() => {
    if (!loading && shipment && pageRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          pageRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
        );
      }, pageRef);

      return () => ctx.revert();
    }
  }, [loading, shipment]);

  const handleStatusUpdate = async (status) => {
    try {
      setUpdating(true);
      setError("");
      await updateShipmentStatus(id, status);
      await fetchShipment();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update shipment status."
      );
    } finally {
      setUpdating(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] font-['Montserrat',sans-serif] p-6 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#E8DDCB] border-t-[#FFA800] rounded-full animate-spin" />
        <p className="text-xs font-extrabold uppercase tracking-widest text-[#967A53] animate-pulse">
          Loading Shipment Context...
        </p>
      </div>
    );
  }

  // Error State
  if (error && !shipment) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] font-['Montserrat',sans-serif] p-6 flex items-center justify-center">
        <div className="bg-white border border-rose-200 rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto text-xl font-black">
            ✕
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-extrabold text-rose-900">
              Unable to Load Shipment
            </h4>
            <p className="text-xs text-[#967A53]">{error}</p>
          </div>
          <div className="flex gap-3 justify-center pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-[#FFFBF5] border border-[#E8DDCB] text-[#422D0B] font-extrabold text-xs rounded-xl hover:bg-white transition-all cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              onClick={fetchShipment}
              className="px-4 py-2 bg-[#FFA800] hover:bg-[#FFC24A] text-[#422D0B] font-extrabold text-xs rounded-xl shadow-2xs transition-all cursor-pointer"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!shipment) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] font-['Montserrat',sans-serif] p-6 flex items-center justify-center">
        <div className="bg-white border border-[#E8DDCB] rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-sm">
          <p className="text-xs font-extrabold text-[#967A53] uppercase tracking-wider">
            Shipment Record Not Found
          </p>
          <button
            type="button"
            onClick={() => navigate("/shipments")}
            className="px-4 py-2 bg-[#FFA800] hover:bg-[#FFC24A] text-[#422D0B] font-extrabold text-xs rounded-xl transition-all cursor-pointer"
          >
            Return to All Shipments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#FFFBF5] font-['Montserrat',sans-serif] text-[#422D0B] p-4 sm:p-8 space-y-6 max-w-7xl mx-auto"
    >
      {/* Top Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-extrabold text-[#967A53] hover:text-[#422D0B] transition-colors cursor-pointer group"
        >
          <svg
            className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
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

      {/* Action Error Banner (If update fails inline) */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center justify-between text-xs text-rose-800 font-semibold">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError("")}
            className="text-rose-600 font-bold hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Details Component */}
      <ShipmentDetails shipment={shipment} />

      {/* Sticky Bottom Operational Actions Bar */}
      {["ASSIGNED", "PICKUP_SCHEDULED", "PICKED_UP", "IN_TRANSIT"].includes(
        shipment.status
      ) && (
        <div className="bg-white border border-[#E8DDCB] rounded-2xl p-4 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky bottom-6">
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#967A53]">
              Workflow Action
            </span>
            <p className="text-xs font-black text-[#422D0B]">
              Advance logistics pipeline status
            </p>
          </div>

          <div className="flex items-center gap-3">
            {shipment.status === "ASSIGNED" && (
              <button
                type="button"
                disabled={updating}
                onClick={() => handleStatusUpdate("PICKUP_SCHEDULED")}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#FFA800] hover:bg-[#FFC24A] disabled:opacity-50 text-[#422D0B] font-black text-xs rounded-xl shadow-2xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                {updating && (
                  <span className="w-3.5 h-3.5 border-2 border-[#422D0B] border-t-transparent rounded-full animate-spin" />
                )}
                <span>Schedule Pickup</span>
              </button>
            )}

            {shipment.status === "PICKUP_SCHEDULED" && (
              <button
                type="button"
                disabled={updating}
                onClick={() => handleStatusUpdate("PICKED_UP")}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#FFA800] hover:bg-[#FFC24A] disabled:opacity-50 text-[#422D0B] font-black text-xs rounded-xl shadow-2xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                {updating && (
                  <span className="w-3.5 h-3.5 border-2 border-[#422D0B] border-t-transparent rounded-full animate-spin" />
                )}
                <span>Mark Picked Up</span>
              </button>
            )}

            {shipment.status === "PICKED_UP" && (
              <button
                type="button"
                disabled={updating}
                onClick={() => handleStatusUpdate("IN_TRANSIT")}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#FFA800] hover:bg-[#FFC24A] disabled:opacity-50 text-[#422D0B] font-black text-xs rounded-xl shadow-2xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                {updating && (
                  <span className="w-3.5 h-3.5 border-2 border-[#422D0B] border-t-transparent rounded-full animate-spin" />
                )}
                <span>Start Transit</span>
              </button>
            )}

            {shipment.status === "IN_TRANSIT" && (
              <button
                type="button"
                disabled={updating}
                onClick={() => handleStatusUpdate("DELIVERED")}
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-2xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                {updating && (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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