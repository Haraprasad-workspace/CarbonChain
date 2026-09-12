import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { getMyShipments } from "../../services/shipmentService";
import ShipmentCard from "./ShipmentCard";

const ShipmentList = () => {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const containerRef = useRef(null);
  const gridRef = useRef(null);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyShipments();
      setShipments(data.shipments || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch shipments."
      );
    }finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  // Filter Shipments
  const filteredShipments = shipments.filter((s) => {
    if (filterStatus === "ALL") return true;
    if (filterStatus === "IN_TRANSIT")
      return s.status === "IN_TRANSIT" || s.status === "PICKED_UP";
    return s.status === filterStatus;
  });

  // GSAP Stagger Entrance Animation on Filter or Load
  useEffect(() => {
    if (!loading && !error && gridRef.current?.children?.length > 0) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0, y: 20, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.4,
            stagger: 0.08,
            ease: "power2.out",
          }
        );
      }, containerRef);

      return () => ctx.revert();
    }
  }, [loading, error, filterStatus, shipments]);

  // Loading State UI
  if (loading) {
    return (
      <div className="bg-[#0B1610] border border-[rgba(16,185,129,0.15)] rounded-2xl p-12 text-center space-y-4 shadow-[0_4px_12px_-2px_rgba(2,44,34,0.5)] font-['Montserrat',sans-serif] backdrop-blur-[16px]">
        <div className="w-10 h-10 border-4 border-[#12221A] border-t-[#10B981] rounded-full animate-spin mx-auto shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
        <p className="text-xs font-bold uppercase tracking-widest text-[#065F46] animate-pulse">
          Fetching Live Logistics & Shipments...
        </p>
      </div>
    );
  }

  // Error State UI
  if (error) {
    return (
      <div className="bg-[#0B1610] border border-rose-500/30 rounded-2xl p-8 text-center space-y-4 shadow-[0_4px_12px_-2px_rgba(2,44,34,0.5)] font-['Montserrat',sans-serif] backdrop-blur-[16px]">
        <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
          ✕
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-rose-300">
            Logistics Sync Error
          </h4>
          <p className="text-xs text-[#A7F3D0] max-w-sm mx-auto">{error}</p>
        </div>
        <button
          type="button"
          onClick={fetchShipments}
          className="px-4 py-2 bg-[#052E16] hover:bg-[#D97706] text-[#ECFDF5] hover:text-[#050B07] font-bold text-xs rounded-xl border border-[rgba(16,185,129,0.30)] hover:border-[#F59E0B] shadow-xs hover:shadow-[0_0_25px_rgba(16,185,129,0.25)] transition-all duration-300 active:scale-95 cursor-pointer"
        >
          Try Reloading
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="space-y-6 font-['Montserrat',sans-serif] text-[#ECFDF5]"
    >
      {/* Control Bar: Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0B1610] border border-[rgba(16,185,129,0.15)] rounded-2xl p-4 shadow-[0_4px_12px_-2px_rgba(2,44,34,0.5)] backdrop-blur-[16px]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#ECFDF5]">
            Filter Shipments
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#12221A] p-1.5 border border-[rgba(16,185,129,0.15)] rounded-xl">
          {[
            { id: "ALL", label: "All Orders" },
            { id: "IN_TRANSIT", label: "Active Transit" },
            { id: "DELIVERED", label: "Delivered" },
            { id: "CANCELLED", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                filterStatus === tab.id
                  ? "bg-[#10B981] text-[#050B07] shadow-[0_0_15px_rgba(16,185,129,0.4)] font-extrabold"
                  : "text-[#A7F3D0] hover:text-[#ECFDF5] hover:bg-[#0B1610]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Shipment Grid */}
      {filteredShipments.length === 0 ? (
        <div className="bg-[#0B1610] border border-[rgba(16,185,129,0.15)] rounded-2xl p-12 text-center space-y-3 shadow-[0_4px_12px_-2px_rgba(2,44,34,0.5)] backdrop-blur-[16px]">
          <div className="w-12 h-12 bg-[#12221A] border border-[rgba(16,185,129,0.30)] text-[#10B981] rounded-2xl flex items-center justify-center mx-auto text-lg shadow-xs">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2m-4-1v8m0 0l3-3m-3 3L9 8"
              />
            </svg>
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[#ECFDF5]">
              No Shipments Found
            </h4>
            <p className="text-xs text-[#065F46] max-w-sm mx-auto font-semibold">
              {filterStatus === "ALL"
                ? "There are currently no dispatch records active for your account."
                : `No shipments matching the filter "${filterStatus}".`}
            </p>
          </div>
        </div>
      ) : (
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filteredShipments.map((shipment) => (
            <ShipmentCard key={shipment._id} shipment={shipment} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ShipmentList;