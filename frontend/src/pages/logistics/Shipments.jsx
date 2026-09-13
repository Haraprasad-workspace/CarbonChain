import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { Truck, RefreshCw, MapPin, ArrowRight } from "lucide-react";
import { getMyShipments } from "../../services/shipmentService";

const LogisticsShipments = () => {
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const listRef = useRef(null);

  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchShipments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyShipments();
      setShipments(data.shipments || []);
    } catch (err) {
      console.error("Failed to fetch shipments:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load shipments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: -15 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
        );
      }

      if (listRef.current) {
        gsap.fromTo(
          listRef.current.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            delay: 0.2,
            ease: "power2.out",
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [loading, shipments]);

  const getStatusClass = (status) => {
    switch (status) {
      case "CREATED":
        return "bg-[#0C1C18] text-[#8EA097] border-[#235349]";
      case "ASSIGNED":
        return "bg-[#143B36] text-[#73A892] border-[#235349]";
      case "PICKUP_SCHEDULED":
        return "bg-[#143B36] text-[#FFC24A] border-[#235349]";
      case "PICKED_UP":
        return "bg-[#143B36] text-[#73A892] border-[#235349]";
      case "IN_TRANSIT":
        return "bg-[#1E5247] text-[#FFC24A] border-[#2D6B4E]";
      case "DELIVERED":
        return "bg-[#143B36] text-[#73A892] border-[#235349]";
      case "CANCELLED":
        return "bg-[#1C1212] text-[#E8A5A5] border-[#5A2D2D]";
      default:
        return "bg-[#0C1C18] text-[#8EA097] border-[#235349]";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0C1C18] flex items-center justify-center font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-[#73A892]" />
          <p className="text-xs font-bold uppercase tracking-wider text-[#8EA097]">
            Loading shipments...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#0C1C18] font-['Plus_Jakarta_Sans',sans-serif] text-[#F4F6F0] selection:bg-[#2D6B4E] selection:text-white relative overflow-hidden p-6"
    >
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#2D6B4E]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#143B36]/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        
        {/* HEADER */}
        <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#143B36] pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#143B36] border border-[#235349] rounded-xl shadow-xs text-[#73A892]">
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#73A892] animate-pulse" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8EA097]">
                  Fleet Logistics
                </span>
              </div>
              <h1 className="text-3xl font-black text-[#F4F6F0] tracking-tight">
                Assigned Shipments
              </h1>
              <p className="text-xs sm:text-sm text-[#8EA097] mt-1 font-medium">
                Manage shipments assigned to your transport company
              </p>
            </div>
          </div>

          <button
            onClick={fetchShipments}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#143B36] hover:bg-[#1E5247] text-[#F4F6F0] border border-[#235349] hover:border-[#2D6B4E] font-extrabold text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className={`w-4 h-4 text-[#8EA097] ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="p-4 bg-[#1C1212] border border-[#5A2D2D] text-[#E8A5A5] rounded-xl text-xs font-bold">
            {error}
          </div>
        )}

        {/* EMPTY */}
        {shipments.length === 0 && !error && (
          <div className="bg-[#143B36] rounded-3xl border border-[#235349] p-12 text-center shadow-[0px_4px_24px_rgba(10,28,24,0.4)]">
            <Truck className="w-16 h-16 mx-auto text-[#8EA097] mb-4" />
            <h2 className="text-xl font-black text-[#F4F6F0] mb-2">
              No Assigned Shipments
            </h2>
            <p className="text-xs text-[#8EA097] font-medium">
              Shipments assigned to your transport company will appear here.
            </p>
          </div>
        )}

        {/* SHIPMENTS GRID */}
        <div ref={listRef} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {shipments.map((shipment) => (
            <div
              key={shipment._id}
              className="bg-[#143B36] rounded-2xl border border-[#235349] p-6 shadow-[0px_4px_24px_rgba(10,28,24,0.4)] hover:border-[#2D6B4E] transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#1E5247]/30 rounded-bl-full pointer-events-none blur-2xl" />

              <div>
                {/* TOP */}
                <div className="flex items-start justify-between mb-5 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-[#0C1C18] border border-[#235349] rounded-xl text-[#73A892]">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#8EA097] uppercase tracking-wider">
                        Shipment
                      </p>
                      <p className="text-xs font-black text-[#F4F6F0]">
                        #{shipment._id.slice(-8)}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusClass(
                      shipment.status
                    )}`}
                  >
                    {shipment.status.replaceAll("_", " ")}
                  </span>
                </div>

                {/* WASTE */}
                <div className="mb-5 relative z-10 bg-[#0C1C18] border border-[#235349] p-4 rounded-xl">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#8EA097]">
                    Waste Details
                  </p>
                  <p className="font-black text-base text-[#F4F6F0] mt-0.5">
                    {shipment.wasteBatch?.wasteType || "Waste"}
                  </p>
                  <p className="text-xs text-[#73A892] font-bold mt-1">
                    {shipment.wasteBatch?.quantity?.value || "-"}{" "}
                    {shipment.wasteBatch?.quantity?.unit || ""}
                  </p>
                </div>

                {/* ROUTE */}
                <div className="space-y-3 mb-5 relative z-10">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#73A892] mt-0.5" />
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#8EA097]">
                        Pickup
                      </p>
                      <p className="text-xs font-bold text-[#F4F6F0]">
                        {shipment.pickupLocation?.city || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[#FFC24A] mt-0.5" />
                    <div>
                      <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#8EA097]">
                        Delivery
                      </p>
                      <p className="text-xs font-bold text-[#F4F6F0]">
                        {shipment.deliveryLocation?.city || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* VEHICLE & DRIVER */}
                <div className="border-t border-[#235349] pt-4 mb-5 relative z-10">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-[#8EA097] font-bold">Vehicle</p>
                      <p className="font-black text-[#F4F6F0] mt-0.5">
                        {shipment.vehicleNumber || "Not assigned"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[#8EA097] font-bold">Driver</p>
                      <p className="font-black text-[#F4F6F0] mt-0.5">
                        {shipment.driverName || "Not assigned"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* BUTTON */}
              <button
                onClick={() => navigate(`/shipments/${shipment._id}`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#73A892] hover:bg-[#86B8A2] text-[#0C1C18] font-black text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer relative z-10"
              >
                <span>View Shipment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogisticsShipments;