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
      className="min-h-screen bg-[#F4F6F0] font-['Plus_Jakarta_Sans',sans-serif] text-[#1E332B] p-4 sm:p-[28px] space-y-8 max-w-7xl mx-auto selection:bg-[#143B36] selection:text-white"
    >
      {/* Page Header */}
      <header
        ref={headerRef}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8EFEA] pb-6"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#73A892] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#63786E]">
              Logistics Overview
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E332B] tracking-tight">
            My Shipments
          </h1>
          <p className="text-xs sm:text-sm font-medium text-[#63786E]">
            Track and monitor your waste collection and delivery dispatch
            pipeline in real time.
          </p>
        </div>

        {/* Quick Context Summary Pill */}
        <div className="flex items-center gap-3 bg-white border border-[#E6EDE8] px-4 py-2.5 rounded-2xl shadow-[0px_1px_3px_rgba(0,0,0,0.03)] self-start md:self-auto">
          <div className="w-8 h-8 rounded-xl bg-[#DCE9DF] border border-[#DCE9DF] flex items-center justify-center text-[#1E3B30] font-bold text-xs">
            📦
          </div>
          <div>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#8EA097]">
              Active Dashboard
            </span>
            <span className="text-xs font-bold text-[#1E332B]">
              Waste Logistics Portal
            </span>
          </div>
        </div>
      </header>

      {/* Main List Section Wrapped in Elevated Container */}
      <main className="bg-white border border-[#E6EDE8] rounded-2xl p-4 sm:p-6 shadow-[0px_1px_3px_rgba(0,0,0,0.03),0px_4px_12px_rgba(22,41,37,0.03)]">
        <ShipmentList />
      </main>
    </div>
  );
};

export default Shipments;