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
    } finally {
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
      <div className="bg-white border border-[#E8DDCB] rounded-2xl p-12 text-center space-y-4 shadow-xs font-['Montserrat',sans-serif]">
        <div className="w-10 h-10 border-4 border-[#E8DDCB] border-t-[#FFA800] rounded-full animate-spin mx-auto" />
        <p className="text-xs font-extrabold uppercase tracking-widest text-[#967A53] animate-pulse">
          Fetching Live Logistics & Shipments...
        </p>
      </div>
    );
  }

  // Error State UI
  if (error) {
    return (
      <div className="bg-white border border-rose-200 rounded-2xl p-8 text-center space-y-4 shadow-xs font-['Montserrat',sans-serif]">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto text-xl font-black">
          ✕
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-extrabold text-rose-900">
            Logistics Sync Error
          </h4>
          <p className="text-xs text-[#967A53] max-w-sm mx-auto">{error}</p>
        </div>
        <button
          type="button"
          onClick={fetchShipments}
          className="px-4 py-2 bg-[#FFA800] hover:bg-[#FFC24A] text-[#422D0B] font-extrabold text-xs rounded-xl shadow-2xs transition-all active:scale-95 cursor-pointer"
        >
          Try Reloading
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="space-y-6 font-['Montserrat',sans-serif] text-[#422D0B]"
    >
      {/* Control Bar: Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E8DDCB] rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFA800]" />
          <span className="text-xs font-black uppercase tracking-wider text-[#422D0B]">
            Filter Shipments
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#FFFBF5] p-1.5 border border-[#E8DDCB] rounded-xl">
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
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                filterStatus === tab.id
                  ? "bg-[#FFA800] text-[#422D0B] shadow-2xs"
                  : "text-[#967A53] hover:text-[#422D0B] hover:bg-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Shipment Grid */}
      {filteredShipments.length === 0 ? (
        <div className="bg-white border border-[#E8DDCB] rounded-2xl p-12 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 bg-[#FFFBF5] border border-[#E8DDCB] text-[#FFA800] rounded-2xl flex items-center justify-center mx-auto text-lg shadow-2xs">
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
            <h4 className="text-sm font-extrabold text-[#422D0B]">
              No Shipments Found
            </h4>
            <p className="text-xs text-[#967A53] max-w-sm mx-auto">
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