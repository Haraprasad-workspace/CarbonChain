import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import useAuth from "../../hooks/useAuth";

const FacilityDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // GSAP Animation Refs
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const profileCardRef = useRef(null);
  const actionsGridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Top Header Fade Down
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
      );

      // User Profile Card Scale Entrance
      gsap.fromTo(
        profileCardRef.current,
        { opacity: 0, scale: 0.95, y: 15 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, delay: 0.15, ease: "back.out(1.4)" }
      );

      // Quick Action Buttons Stagger Reveal
      if (actionsGridRef.current?.children) {
        gsap.fromTo(
          actionsGridRef.current.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.08,
            delay: 0.3,
            ease: "power2.out",
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleLogout = () => {
    // Smooth exit animation before logging out
    gsap.to(containerRef.current, {
      opacity: 0,
      y: -10,
      duration: 0.25,
      onComplete: () => {
        logout();
        navigate("/login");
      },
    });
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#FFFBF5] font-['Montserrat',sans-serif] text-[#422D0B] p-4 sm:p-8 selection:bg-[#FFA800] selection:text-white"
    >
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Navigation Bar / Top Header */}
        <header
          ref={headerRef}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDCB] pb-6"
        >
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#967A53]">
              Portal Management
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#422D0B] tracking-tight mt-0.5">
              Facility Dashboard
            </h1>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="self-start sm:self-auto px-4 py-2.5 bg-white hover:bg-red-50 text-red-600 border border-[#E8DDCB] hover:border-red-200 font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <svg
              className="w-4 h-4 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Logout</span>
          </button>
        </header>

        {/* User Profile Overview Card */}
        <section
          ref={profileCardRef}
          className="bg-white border border-[#E8DDCB] rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden space-y-6"
        >
          {/* Decorative Corner Glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#FFA800]/10 rounded-bl-full pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* User Avatar Circle */}
              <div className="w-14 h-14 rounded-2xl bg-[#FFFBF5] border-2 border-[#E8DDCB] flex items-center justify-center font-black text-xl text-[#FFA800] shrink-0 shadow-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#422D0B]">
                  Welcome, {user?.name || "Facility Manager"}
                </h2>
                <span className="text-xs font-bold text-[#967A53] block mt-0.5">
                  Facility Operator Account
                </span>
              </div>
            </div>

            <span className="self-start sm:self-center px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-extrabold rounded-full uppercase tracking-wider">
              System Active
            </span>
          </div>

          {/* User Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E8DDCB]/60 text-xs">
            <div className="bg-[#FFFBF5] p-3.5 rounded-xl border border-[#E8DDCB]/60 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FFA800]/15 flex items-center justify-center text-[#422D0B] shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H9" />
                </svg>
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase text-[#967A53] block">
                  Organization
                </span>
                <span className="font-extrabold text-[#422D0B] text-sm">
                  {user?.organization || "Not specified"}
                </span>
              </div>
            </div>

            <div className="bg-[#FFFBF5] p-3.5 rounded-xl border border-[#E8DDCB]/60 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#FFA800]/15 flex items-center justify-center text-[#422D0B] shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="truncate">
                <span className="text-[10px] font-extrabold uppercase text-[#967A53] block">
                  Email Address
                </span>
                <span className="font-extrabold text-[#422D0B] text-sm truncate block">
                  {user?.email || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Action Cards Grid */}
        <section className="space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-[#967A53]">
            Quick Actions
          </h3>

          <div
            ref={actionsGridRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {/* Action 1: Register Facility */}
            <div className="bg-white border border-[#E8DDCB] hover:border-[#FFA800] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#FFFBF5] border border-[#E8DDCB] flex items-center justify-center text-[#FFA800] group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-[#422D0B]">
                    Register Facility
                  </h4>
                  <p className="text-xs text-[#967A53] mt-1 leading-relaxed">
                    Add a new biomass or waste processing unit to your account.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/facility/register")}
                className="w-full py-2.5 px-4 bg-[#FFA800] hover:bg-[#FFC24A] text-[#422D0B] font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>Register New</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            {/* Action 2: My Facilities */}
            <div className="bg-white border border-[#E8DDCB] hover:border-[#FFA800] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#FFFBF5] border border-[#E8DDCB] flex items-center justify-center text-[#FFA800] group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H9" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-[#422D0B]">
                    My Facilities
                  </h4>
                  <p className="text-xs text-[#967A53] mt-1 leading-relaxed">
                    View, update capacities, and manage your registered plants.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/facility/my")}
                className="w-full py-2.5 px-4 bg-[#FFFBF5] border border-[#E8DDCB] hover:border-[#FFA800] text-[#422D0B] font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>Manage Facilities</span>
                <svg className="w-4 h-4 text-[#FFA800]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            {/* Action 3: Verification */}
            <div className="bg-white border border-[#E8DDCB] hover:border-[#FFA800] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#FFFBF5] border border-[#E8DDCB] flex items-center justify-center text-[#FFA800] group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-[#422D0B]">
                    Verification Center
                  </h4>
                  <p className="text-xs text-[#967A53] mt-1 leading-relaxed">
                    Submit compliance records and check your verification status.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/verification")}
                className="w-full py-2.5 px-4 bg-[#FFFBF5] border border-[#E8DDCB] hover:border-[#FFA800] text-[#422D0B] font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                <span>Check Verification</span>
                <svg className="w-4 h-4 text-[#FFA800]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default FacilityDashboard;