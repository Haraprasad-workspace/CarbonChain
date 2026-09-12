import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import gsap from "gsap";

import FacilityDetails from "../../components/facility/FacilityDetails";
import FacilityStatus from "../../components/facility/FacilityStatus";
import { getFacility } from "../../services/facilityService";

const FacilityDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Animation Refs
  const pageRef = useRef(null);
  const headerRef = useRef(null);
  const mainContentRef = useRef(null);

  useEffect(() => {
    const fetchFacility = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getFacility(id);
        setFacility(data.facility);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to fetch facility details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFacility();
  }, [id]);

  // GSAP Entrance Effect on Data Load
  useEffect(() => {
    if (!loading && !error && facility) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: -15 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
        );

        if (mainContentRef.current?.children) {
          gsap.fromTo(
            mainContentRef.current.children,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.15,
              ease: "power2.out",
              delay: 0.1,
            }
          );
        }
      }, pageRef);

      return () => ctx.revert();
    }
  }, [loading, error, facility]);

  const handleBack = () => {
    gsap.to(pageRef.current, {
      opacity: 0,
      y: 10,
      duration: 0.2,
      onComplete: () => navigate("/facility/my-facilities"),
    });
  };

  // Loading State UI
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] font-['Montserrat',sans-serif] flex flex-col items-center justify-center p-6 text-[#422D0B]">
        <div className="w-12 h-12 border-4 border-[#E8DDCB] border-t-[#FFA800] rounded-full animate-spin mb-4" />
        <p className="text-xs font-extrabold uppercase tracking-widest text-[#967A53] animate-pulse">
          Retrieving Facility Profile...
        </p>
      </div>
    );
  }

  // Error State UI
  if (error) {
    return (
      <div className="min-h-screen bg-[#FFFBF5] font-['Montserrat',sans-serif] flex items-center justify-center p-6 text-[#422D0B]">
        <div className="max-w-md w-full bg-white border border-red-200 rounded-2xl p-6 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto text-xl font-black">
            ✕
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-extrabold text-red-900">
              Unable to Load Facility
            </h3>
            <p className="text-xs text-[#967A53] leading-relaxed">{error}</p>
          </div>
          <button
            type="button"
            onClick={handleBack}
            className="w-full py-2.5 px-4 bg-[#FFA800] hover:bg-[#FFC24A] text-[#422D0B] font-extrabold text-xs rounded-xl transition-all shadow-xs active:scale-95 cursor-pointer"
          >
            Back to My Facilities
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#FFFBF5] font-['Montserrat',sans-serif] text-[#422D0B] p-4 sm:p-8 selection:bg-[#FFA800] selection:text-white"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Bar */}
        <header
          ref={headerRef}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDCB] pb-5"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleBack}
                className="text-[#967A53] hover:text-[#422D0B] text-xs font-bold transition-colors flex items-center gap-1 group cursor-pointer"
              >
                <svg
                  className="w-4 h-4 text-[#FFA800] group-hover:-translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span>My Facilities</span>
              </button>
              <span className="text-[#E8DDCB]">•</span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#967A53]">
                Facility Details
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#422D0B] tracking-tight">
              {facility?.facilityName || "Facility Overview"}
            </h1>
          </div>

          <button
            type="button"
            onClick={handleBack}
            className="self-start sm:self-auto px-4 py-2.5 bg-white hover:bg-[#FFFBF5] text-[#422D0B] border border-[#E8DDCB] hover:border-[#FFA800] font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
          >
            <svg
              className="w-3.5 h-3.5 text-[#967A53]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Back to Directory</span>
          </button>
        </header>

        {/* Main Content Sections */}
        <main ref={mainContentRef} className="space-y-6">
          {/* Status Bar */}
          <FacilityStatus
            operationalStatus={facility?.operationalStatus}
            verificationStatus={facility?.verificationStatus}
          />

          {/* Facility Specification Card */}
          <div className="bg-white border border-[#E8DDCB] rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFA800]/5 rounded-bl-full pointer-events-none" />
            <FacilityDetails facility={facility} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default FacilityDetailsPage;