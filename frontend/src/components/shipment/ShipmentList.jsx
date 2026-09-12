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
      <div className="bg-white border border-[#E6EDE8] rounded-2xl p-12 text-center space-y-4 shadow-[0px_1px_3px_rgba(0,0,0,0.03)] font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="w-10 h-10 border-4 border-[#E6EDE8] border-t-[#143B36] rounded-full animate-spin mx-auto" />
        <p className="text-xs font-bold uppercase tracking-widest text-[#63786E] animate-pulse">
          Fetching Live Logistics & Shipments...
        </p>
      </div>
    );
  }

  // Error State UI
  if (error) {
    return (
      <div className="bg-white border border-rose-200 rounded-2xl p-8 text-center space-y-4 shadow-[0px_1px_3px_rgba(0,0,0,0.03)] font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold">
          ✕
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-rose-900">
            Logistics Sync Error
          </h4>
          <p className="text-xs text-[#63786E] max-w-sm mx-auto">{error}</p>
        </div>
        <button
          type="button"
          onClick={fetchShipments}
          className="px-4 py-2 bg-[#143B36] hover:bg-[#0D2925] text-white font-semibold text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          Try Reloading
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif] text-[#1E332B]"
    >
      {/* Control Bar: Filter Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#E6EDE8] rounded-2xl p-4 shadow-[0px_1px_3px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#73A892]" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#1E332B]">
            Filter Shipments
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#F4F6F0] p-1.5 border border-[#E6EDE8] rounded-xl">
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterStatus === tab.id
                  ? "bg-[#143B36] text-white shadow-xs"
                  : "text-[#63786E] hover:text-[#1E332B] hover:bg-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Shipment Grid */}
      {filteredShipments.length === 0 ? (
        <div className="bg-white border border-[#E6EDE8] rounded-2xl p-12 text-center space-y-3 shadow-[0px_1px_3px_rgba(0,0,0,0.03)]">
          <div className="w-12 h-12 bg-[#F4F6F0] border border-[#E6EDE8] text-[#143B36] rounded-2xl flex items-center justify-center mx-auto text-lg shadow-xs">
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
            <h4 className="text-sm font-bold text-[#1E332B]">
              No Shipments Found
            </h4>
            <p className="text-xs text-[#63786E] max-w-sm mx-auto font-medium">
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