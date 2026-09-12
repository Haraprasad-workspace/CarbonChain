import { useEffect, useRef } from "react";
import gsap from "gsap";
import NegotiationList from "../../components/negotiation/NegotiationList";

const Negotiations = () => {
  const pageRef = useRef(null);

  // GSAP Entrance Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        pageRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#F4F6F0] font-['Plus_Jakarta_Sans',sans-serif] text-[#1E332B] py-8 px-4 sm:px-6 lg:px-[28px] selection:bg-[#143B36] selection:text-white"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Page Banner Header */}
        <div className="bg-white border border-[#E6EDE8] rounded-2xl p-6 sm:p-8 shadow-[0px_1px_3px_rgba(0,0,0,0.03),0px_4px_12px_rgba(22,41,37,0.03)] relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Decorative Background Blur */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#E4EFE9]/60 rounded-bl-full pointer-events-none blur-xl" />

          {/* Left Content */}
          <div className="space-y-2 max-w-2xl relative z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#73A892] animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#63786E]">
                Facility Intake & Offers
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E332B] tracking-tight">
              Incoming Negotiations
            </h1>
            <p className="text-xs sm:text-sm text-[#63786E] font-medium leading-relaxed">
              Review, accept, or counter price offers submitted by waste generators looking to process material at your facility.
            </p>
          </div>

          {/* Right Quick Info Badge */}
          <div className="shrink-0 relative z-10">
            <div className="inline-flex items-center gap-3 bg-[#F4F6F0] border border-[#E6EDE8] px-4 py-3 rounded-xl shadow-xs">
              <div className="w-9 h-9 bg-[#DCE9DF] border border-[#DCE9DF] rounded-xl flex items-center justify-center text-[#1E3B30]">
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
                <span className="block text-xs font-bold text-[#1E332B]">
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