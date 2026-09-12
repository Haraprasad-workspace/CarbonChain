import { useEffect, useRef } from "react";
import gsap from "gsap";
import NegotiationList from "../../components/negotiation/NegotiationList";

const Negotiations = () => {
  const pageRef = useRef(null);

  // GSAP Entrance Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (pageRef.current) {
        gsap.fromTo(
          pageRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
        );
      }
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#0C1C18] font-['Plus_Jakarta_Sans',sans-serif] text-[#F4F6F0] py-8 px-4 sm:px-6 lg:px-[28px] selection:bg-[#2D6B4E] selection:text-white relative"
    >
      {/* Background Decorative Ambient Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#2D6B4E]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-[#143B36]/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Page Banner Header */}
        <div className="bg-[#143B36] border border-[#235349] rounded-2xl p-6 sm:p-8 shadow-[0px_4px_24px_rgba(10,28,24,0.4)] relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Decorative Background Blur */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#1E5247]/40 rounded-bl-full pointer-events-none blur-xl" />

          {/* Left Content */}
          <div className="space-y-2 max-w-2xl relative z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#73A892] animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8EA097]">
                Facility Intake & Offers
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4F6F0] tracking-tight">
              Incoming Negotiations
            </h1>
            <p className="text-xs sm:text-sm text-[#8EA097] font-medium leading-relaxed">
              Review, accept, or counter price offers submitted by waste generators looking to process material at your facility.
            </p>
          </div>

          {/* Right Quick Info Badge */}
          <div className="shrink-0 relative z-10">
            <div className="inline-flex items-center gap-3 bg-[#0C1C18] border border-[#235349] px-4 py-3 rounded-xl shadow-sm">
              <div className="w-9 h-9 bg-[#1E5247] border border-[#2D6B4E] rounded-xl flex items-center justify-center text-[#73A892]">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div className="space-y-0.5">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-[#8EA097]">
                  Intake Role
                </span>
                <span className="block text-xs font-bold text-[#F4F6F0]">
                  Processing Facility
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Negotiation List Component */}
        <main className="relative z-10">
          <NegotiationList />
        </main>
      </div>
    </div>
  );
};

export default Negotiations;