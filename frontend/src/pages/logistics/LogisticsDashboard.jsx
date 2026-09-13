import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import {
  Truck,
  Package,
  Clock,
  Navigation,
  CheckCircle,
  ArrowRight,
  RefreshCw
} from "lucide-react";
import { getMyShipments } from "../../services/shipmentService";

const LogisticsDashboard = () => {
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const statsRef = useRef(null);
  const actionsRef = useRef(null);
  const shipmentsRef = useRef(null);

  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const data = await getMyShipments();
      setShipments(data.shipments || []);
    } catch (error) {
      console.error("Failed to fetch shipments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header Animation
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current.children,
          { opacity: 0, y: -15 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
        );
      }

      // Stats Animation
      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current.children,
          { opacity: 0, y: 20, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            delay: 0.2,
            ease: "power2.out",
          }
        );
      }

      // Quick Actions Animation
      if (actionsRef.current) {
        gsap.fromTo(
          actionsRef.current.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            delay: 0.35,
            ease: "power2.out",
          }
        );
      }

      // Shipments List Container Animation
      if (shipmentsRef.current) {
        gsap.fromTo(
          shipmentsRef.current,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.5,
            ease: "power2.out",
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [loading]);

  const getCount = (status) => {
    return shipments.filter(
      (shipment) => shipment.status === status
    ).length;
  };

  const stats = [
    {
      title: "Assigned",
      value: getCount("ASSIGNED"),
      icon: Truck
    },
    {
      title: "Pickup Scheduled",
      value: getCount("PICKUP_SCHEDULED"),
      icon: Clock
    },
    {
      title: "In Transit",
      value: getCount("IN_TRANSIT"),
      icon: Navigation
    },
    {
      title: "Delivered",
      value: getCount("DELIVERED"),
      icon: CheckCircle
    }
  ];

  const activeShipments = shipments.filter(
    (shipment) =>
      !["DELIVERED", "CANCELLED"].includes(shipment.status)
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#0C1C18] font-['Plus_Jakarta_Sans',sans-serif] text-[#F4F6F0] selection:bg-[#2D6B4E] selection:text-white relative overflow-hidden"
    >
      {/* Background Decorative Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#2D6B4E]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#143B36]/30 rounded-full blur-3xl" />
      </div>

      {/* HEADER */}
      <div className="relative z-10 border-b border-[#143B36] bg-[#0C1C18]/80 backdrop-blur-xl">
        <div ref={headerRef} className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#143B36] border border-[#235349] rounded-xl shadow-xs">
              <Truck className="w-7 h-7 text-[#73A892]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#73A892] animate-pulse" />
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8EA097]">
                  Logistics Network
                </span>
              </div>
              <h1 className="text-3xl font-black text-[#F4F6F0] tracking-tight">
                Logistics Dashboard
              </h1>
              <p className="text-xs sm:text-sm text-[#8EA097] mt-1 font-medium">
                Manage your assigned waste transportation and active dispatch routes
              </p>
            </div>
          </div>

          <button
            onClick={fetchShipments}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#143B36] hover:bg-[#1E5247] text-[#F4F6F0] border border-[#235349] hover:border-[#2D6B4E] font-extrabold text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <RefreshCw
              className={`w-4 h-4 text-[#8EA097] ${
                loading ? "animate-spin" : ""
              }`}
            />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* STAT CARDS */}
        <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="bg-[#143B36] rounded-2xl border border-[#235349] p-5 shadow-[0px_4px_24px_rgba(10,28,24,0.4)] relative overflow-hidden group hover:border-[#2D6B4E] transition-all"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#1E5247]/30 rounded-bl-full pointer-events-none blur-xl" />
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#8EA097]">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-black text-[#F4F6F0] mt-2">
                      {stat.value}
                    </p>
                  </div>

                  <div className="p-3 bg-[#0C1C18] border border-[#235349] rounded-xl text-[#73A892]">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* QUICK ACTION */}
        <div ref={actionsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate("/logistics/shipments")}
            className="bg-[#143B36] hover:bg-[#1E5247] text-[#F4F6F0] border border-[#235349] hover:border-[#2D6B4E] rounded-2xl p-6 text-left shadow-[0px_4px_24px_rgba(10,28,24,0.4)] transition-all group cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#1E5247]/30 rounded-bl-full pointer-events-none blur-2xl" />
            <div className="flex items-center justify-between relative z-10">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#0C1C18] border border-[#235349] flex items-center justify-center text-[#73A892]">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#F4F6F0]">
                    View Assigned Shipments
                  </h2>
                  <p className="text-xs text-[#8EA097] mt-1 font-medium">
                    View and manage all shipments assigned to your transport company.
                  </p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#0C1C18] border border-[#235349] flex items-center justify-center text-[#73A892] group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate("/logistics/shipments")}
            className="bg-[#143B36] hover:bg-[#1E5247] text-[#F4F6F0] border border-[#235349] hover:border-[#2D6B4E] rounded-2xl p-6 text-left shadow-[0px_4px_24px_rgba(10,28,24,0.4)] transition-all group cursor-pointer relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#1E5247]/30 rounded-bl-full pointer-events-none blur-2xl" />
            <div className="flex items-center justify-between relative z-10">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#0C1C18] border border-[#235349] flex items-center justify-center text-[#73A892]">
                  <Navigation className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#F4F6F0]">
                    Active Deliveries
                  </h2>
                  <p className="text-xs text-[#8EA097] mt-1 font-medium">
                    Track shipments currently being transported across routes.
                  </p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#0C1C18] border border-[#235349] flex items-center justify-center text-[#73A892] group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </button>
        </div>

        {/* ACTIVE SHIPMENTS */}
        <div
          ref={shipmentsRef}
          className="bg-[#143B36] rounded-3xl border border-[#235349] shadow-[0px_4px_24px_rgba(10,28,24,0.4)] overflow-hidden"
        >
          <div className="p-6 border-b border-[#235349] flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-[#F4F6F0]">
                Active Shipments
              </h2>
              <p className="text-xs text-[#8EA097] mt-1 font-medium">
                Shipments currently assigned to your fleet
              </p>
            </div>

            <span className="px-3.5 py-1 bg-[#0C1C18] border border-[#235349] text-[#73A892] rounded-full text-xs font-bold">
              {activeShipments.length} Active
            </span>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <RefreshCw className="w-7 h-7 animate-spin mx-auto mb-3 text-[#73A892]" />
              <p className="text-xs font-bold text-[#8EA097]">
                Loading shipments...
              </p>
            </div>
          ) : activeShipments.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <Truck className="w-12 h-12 mx-auto text-[#8EA097] mb-2" />
              <h3 className="text-base font-black text-[#F4F6F0]">
                No active shipments
              </h3>
              <p className="text-xs text-[#8EA097]">
                New assigned shipments will appear here when dispatched.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#235349]">
              {activeShipments.slice(0, 5).map((shipment) => (
                <div
                  key={shipment._id}
                  className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#1E5247]/20 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#0C1C18] border border-[#235349] rounded-xl text-[#73A892]">
                      <Truck className="w-6 h-6" />
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-black text-sm text-[#F4F6F0]">
                        {shipment.wasteBatch?.wasteType || "Waste Shipment"}
                      </h3>

                      <p className="text-xs font-medium text-[#8EA097]">
                        {shipment.wasteBatch?.quantity?.value || "-"}{" "}
                        {shipment.wasteBatch?.quantity?.unit || ""}
                      </p>

                      <p className="text-xs font-medium text-[#8EA097]">
                        {shipment.pickupLocation?.city || "-"}
                        {" → "}
                        {shipment.deliveryLocation?.city || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-auto">
                    <span className="px-3 py-1 rounded-full bg-[#0C1C18] border border-[#235349] text-[#73A892] text-xs font-bold tracking-wide">
                      {shipment.status.replaceAll("_", " ")}
                    </span>

                    <button
                      onClick={() =>
                        navigate(`/shipments/${shipment._id}`)
                      }
                      className="flex items-center gap-2 px-4 py-2 bg-[#73A892] hover:bg-[#86B8A2] text-[#0C1C18] font-black text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer"
                    >
                      <span>View</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogisticsDashboard;