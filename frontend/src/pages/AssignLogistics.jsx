import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import gsap from "gsap";

import { getShipment } from "../services/shipmentService";
import AssignLogisticsForm from "../components/shipment/AssignLogisticsForm";

const AssignLogistics = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const pageRef = useRef(null);

  // ==================== FETCH SHIPMENT ====================

  const fetchShipment = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getShipment(id);

      setShipment(data.shipment);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to load shipment details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipment();
  }, [id]);

  // ==================== ANIMATION ====================

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
            duration: 0.45,
            ease: "power2.out",
          }
        );
      }, pageRef);

      return () => ctx.revert();
    }
  }, [loading, shipment]);

  // ==================== ASSIGNED ====================

  const handleAssigned = () => {
    navigate(`/shipments/${id}`);
  };

  // ==================== LOADING ====================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] font-['Montserrat',sans-serif] p-4 sm:p-8 max-w-5xl mx-auto space-y-6">

        <div className="h-4 w-32 bg-[#E8DDCB]/60 rounded-full animate-pulse mb-4" />

        <div className="bg-white border border-[#E8DDCB] rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xs">

          <div className="flex justify-between items-start">
            <div className="space-y-2 w-2/3">
              <div className="h-3 w-28 bg-[#FFA800]/20 rounded-full animate-pulse" />

              <div className="h-7 w-3/4 bg-[#E8DDCB] rounded-xl animate-pulse" />

              <div className="h-4 w-1/2 bg-[#E8DDCB]/60 rounded-lg animate-pulse" />
            </div>

            <div className="h-10 w-28 bg-[#E8DDCB]/40 rounded-xl animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white border border-[#E8DDCB] rounded-2xl p-5 space-y-2 animate-pulse"
            >
              <div className="h-3 w-20 bg-[#E8DDCB]/60 rounded-md" />

              <div className="h-5 w-32 bg-[#E8DDCB] rounded-lg" />
            </div>
          ))}
        </div>

      </div>
    );
  }

  // ==================== ERROR ====================

  if (error || !shipment) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] font-['Montserrat',sans-serif] flex items-center justify-center p-6">

        <div className="bg-white border border-rose-200 rounded-3xl p-8 max-w-md w-full text-center space-y-5 shadow-2xs">

          <div className="w-14 h-14 bg-rose-50 text-rose-600 border border-rose-200 rounded-2xl flex items-center justify-center mx-auto text-xl font-black">
            ✕
          </div>

          <div className="space-y-1">
            <h2 className="text-base font-black text-[#422D0B]">
              Unable to Load Shipment
            </h2>

            <p className="text-xs font-medium text-[#967A53] leading-relaxed">
              {error || "Shipment record was not found."}
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-2">

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 bg-[#FFFBF5] border border-[#E8DDCB] text-[#422D0B] hover:bg-[#E8DDCB]/30 font-black text-xs rounded-xl transition-all active:scale-95 cursor-pointer"
            >
              Go Back
            </button>

            <button
              type="button"
              onClick={fetchShipment}
              className="px-5 py-2.5 bg-[#422D0B] hover:bg-[#2F2008] text-white font-black text-xs rounded-xl transition-all active:scale-95 shadow-2xs cursor-pointer"
            >
              Retry
            </button>

          </div>
        </div>
      </div>
    );
  }

  // ==================== ASSIGNMENT VALIDATION ====================

  const cannotAssign =
    shipment.logisticsProvider ||
    ["DELIVERED", "CANCELLED"].includes(
      shipment.status
    );

  if (cannotAssign) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] font-['Montserrat',sans-serif] text-[#422D0B] p-4 sm:p-8 max-w-5xl mx-auto">

        <button
          type="button"
          onClick={() => navigate(`/shipments/${id}`)}
          className="group inline-flex items-center gap-2 text-xs font-extrabold text-[#967A53] hover:text-[#422D0B] transition-colors cursor-pointer mb-6"
        >
          <span className="text-sm transition-transform group-hover:-translate-x-1">
            ←
          </span>

          <span>Back to Shipment</span>
        </button>

        <div className="bg-white border border-[#E8DDCB] rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-2xs">

          <div className="w-16 h-16 bg-[#FFFBF5] border border-[#E8DDCB] rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-2xs">
            🚛
          </div>

          <div className="space-y-1">

            <h2 className="text-lg font-black text-[#422D0B]">
              Logistics Assignment Unavailable
            </h2>

            <p className="text-xs font-medium text-[#967A53] max-w-md mx-auto leading-relaxed">
              {shipment.logisticsProvider
                ? "A logistics provider has already been assigned to this shipment."
                : "This shipment has already been delivered or cancelled."}
            </p>

          </div>

          <div className="flex justify-center gap-3 pt-2">

            <button
              type="button"
              onClick={() =>
                navigate(`/shipments/${id}`)
              }
              className="px-6 py-2.5 bg-[#422D0B] hover:bg-[#2F2008] text-white font-black text-xs rounded-xl transition-all active:scale-95 shadow-2xs cursor-pointer inline-flex items-center gap-2"
            >
              <span>View Shipment Details</span>
              <span>→</span>
            </button>

          </div>
        </div>
      </div>
    );
  }

  // ==================== MAIN PAGE ====================

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#FFFBF5] font-['Montserrat',sans-serif] text-[#422D0B] p-4 sm:p-8 max-w-5xl mx-auto space-y-6"
    >

      {/* Back Navigation */}
      <div>
        <button
          type="button"
          onClick={() =>
            navigate(`/shipments/${id}`)
          }
          className="group inline-flex items-center gap-1.5 text-xs font-extrabold text-[#967A53] hover:text-[#422D0B] transition-colors cursor-pointer"
        >
          <span className="text-sm transition-transform group-hover:-translate-x-1">
            ←
          </span>

          <span>Back to Shipment</span>
        </button>
      </div>

      {/* Page Header */}
      <header className="bg-white border border-[#E8DDCB] rounded-3xl p-6 sm:p-8 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">

        <div className="space-y-2">

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFA800] animate-pulse" />

            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#967A53]">
              Transport Management
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Assign Logistics Provider
          </h1>

          <p className="text-xs font-medium text-[#967A53] leading-relaxed max-w-xl">
            Assign a verified transport partner to collect and
            deliver this waste shipment safely to its target facility.
          </p>

        </div>

        <div className="bg-[#FFFBF5] border border-[#E8DDCB] px-4 py-3 rounded-2xl self-start sm:self-center text-left sm:text-right min-w-[130px]">

          <span className="block text-[9px] font-extrabold uppercase tracking-widest text-[#967A53]">
            Shipment ID
          </span>

          <span className="text-sm font-black text-[#422D0B] tracking-tight">
            #{shipment._id?.slice(-8) || "N/A"}
          </span>

        </div>

      </header>

      {/* Shipment Status */}
      <section className="bg-white border border-[#E8DDCB] rounded-3xl p-5 sm:p-6 shadow-2xs">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div>
            <span className="block text-[9px] font-extrabold uppercase tracking-widest text-[#967A53]">
              Current Shipment Status
            </span>

            <p className="mt-1 text-sm font-black text-[#422D0B]">
              {shipment.status}
            </p>
          </div>

          <span className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-bold w-fit">
            READY FOR ASSIGNMENT
          </span>

        </div>
      </section>

      {/* Shipment Summary */}
      <section className="bg-white border border-[#E8DDCB] rounded-3xl p-6 sm:p-8 shadow-2xs space-y-5">

        <div className="flex items-center gap-2 border-b border-[#E8DDCB] pb-4">

          <span className="w-2 h-2 rounded-full bg-[#FFA800]" />

          <h2 className="text-xs font-extrabold uppercase tracking-widest text-[#967A53]">
            Shipment Summary
          </h2>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <SummaryItem
            label="Waste Type"
            value={shipment.wasteBatch?.wasteType}
          />

          <SummaryItem
            label="Quantity"
            value={
              shipment.wasteBatch?.quantity?.value != null
                ? `${shipment.wasteBatch.quantity.value} ${
                    shipment.wasteBatch.quantity.unit || ""
                  }`
                : "Not specified"
            }
          />

          <SummaryItem
            label="Destination"
            value={shipment.facility?.facilityName}
          />

        </div>
      </section>

      {/* Assignment Form */}
      <div className="bg-white border border-[#E8DDCB] rounded-3xl p-6 sm:p-8 shadow-2xs">

        <AssignLogisticsForm
          shipment={shipment}
          onAssigned={handleAssigned}
        />

      </div>

    </div>
  );
};

// ==================== SUMMARY ITEM ====================

const SummaryItem = ({ label, value }) => {
  return (
    <div className="bg-[#FFFBF5] border border-[#E8DDCB] rounded-2xl p-4 transition-colors">

      <span className="block text-[9px] font-extrabold uppercase tracking-wider text-[#967A53]">
        {label}
      </span>

      <span className="block mt-1.5 text-sm font-black text-[#422D0B] truncate">
        {value || "Not specified"}
      </span>

    </div>
  );
};

export default AssignLogistics;