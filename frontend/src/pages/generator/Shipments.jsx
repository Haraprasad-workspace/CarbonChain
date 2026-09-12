import { useEffect, useRef } from "react";
import gsap from "gsap";
import ShipmentList from "../../components/shipment/ShipmentList";

const Shipments = () => {
  const containerRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
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
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#0C1C18] font-['Plus_Jakarta_Sans',sans-serif] text-[#F4F6F0] p-4 sm:p-[28px] space-y-8 max-w-7xl mx-auto selection:bg-[#2D6B4E] selection:text-white relative"
    >
      {/* Background Decorative Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#2D6B4E]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#143B36]/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 space-y-8">
        {/* Page Header */}
        <header
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#143B36] pb-6"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#73A892] animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8EA097]">
                Logistics Overview
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4F6F0] tracking-tight">
              My Shipments
            </h1>
            <p className="text-xs sm:text-sm font-medium text-[#8EA097]">
              Track and monitor your waste collection and delivery dispatch
              pipeline in real time.
            </p>
          </div>

          {/* Quick Context Summary Pill */}
          <div className="flex items-center gap-3 bg-[#143B36] border border-[#235349] px-4 py-2.5 rounded-2xl shadow-[0px_4px_24px_rgba(10,28,24,0.4)] self-start md:self-auto">
            <div className="w-8 h-8 rounded-xl bg-[#1E5247] border border-[#2D6B4E] flex items-center justify-center text-[#73A892] font-bold text-xs">
              📦
            </div>
            <div>
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#8EA097]">
                Active Dashboard
              </span>
              <span className="text-xs font-bold text-[#F4F6F0]">
                Waste Logistics Portal
              </span>
            </div>
          </div>
        </header>

        {/* Main List Section Wrapped in Elevated Container */}
        <main className="bg-[#143B36] border border-[#235349] rounded-2xl p-4 sm:p-6 shadow-[0px_4px_24px_rgba(10,28,24,0.4)]">
          <ShipmentList />
        </main>
      </div>
    </div>
  );
};

export default Shipments;