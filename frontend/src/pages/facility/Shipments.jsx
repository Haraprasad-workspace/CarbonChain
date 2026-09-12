import { useEffect, useRef } from "react";
import gsap from "gsap";
import ShipmentList from "../../components/shipment/ShipmentList";

const Shipments = () => {
  const containerRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current.children,
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#FFFBF5] font-['Montserrat',sans-serif] text-[#422D0B] p-4 sm:p-8 space-y-8 max-w-7xl mx-auto"
    >
      {/* Header Section */}
      <header
        ref={headerRef}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8DDCB] pb-6"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFA800] animate-pulse" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#967A53]">
              Facility Inbound Logistics
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#422D0B] tracking-tight">
            Incoming Shipments
          </h1>
          <p className="text-xs sm:text-sm font-medium text-[#967A53]">
            Track waste deliveries arriving at your facility and monitor incoming dispatch schedules.
          </p>
        </div>

        {/* Facility Context Badge */}
        <div className="flex items-center gap-3 bg-white border border-[#E8DDCB] px-4 py-2.5 rounded-2xl shadow-2xs self-start md:self-auto">
          <div className="w-8 h-8 rounded-xl bg-[#FFFBF5] border border-[#E8DDCB] flex items-center justify-center text-[#FFA800] font-black text-xs">
            🚛
          </div>
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-wider text-[#967A53]">
              Receiving Hub
            </span>
            <span className="text-xs font-black text-[#422D0B]">
              Inbound Operations
            </span>
          </div>
        </div>
      </header>

      {/* Main List Container */}
      <main className="bg-white border border-[#E8DDCB] rounded-3xl p-4 sm:p-6 shadow-2xs">
        <ShipmentList />
      </main>
    </div>
  );
};

export default Shipments;