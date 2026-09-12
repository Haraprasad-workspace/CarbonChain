import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react"
import gsap from "gsap";

import api from "../../services/api";
import FacilityDetails from "../../components/facility/FacilityDetails";

const FacilityDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const pageRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchFacility = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/facilities/${id}`);
        setFacility(response.data.facility);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load facility details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFacility();
    }
  }, [id]);

  // GSAP Entrance Animation
  useEffect(() => {
    if (!loading && !error && facility && contentRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          }
        );
      }, pageRef);

      return () => ctx.revert();
    }
  }, [loading, error, facility]);

  // Loading Skeleton State
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6 font-['Montserrat',sans-serif]">
        {/* Navigation Skeleton */}
        <div className="h-4 w-20 bg-[#E8DDCB]/60 rounded-full animate-pulse" />

        {/* Content Card Skeleton */}
        <div className="bg-white border border-[#E8DDCB] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-[#E8DDCB] pb-6">
            <div className="space-y-3 w-full sm:w-2/3">
              <div className="h-4 w-28 bg-[#FFA800]/20 rounded-full animate-pulse" />
              <div className="h-8 w-3/4 bg-[#E8DDCB] rounded-xl animate-pulse" />
              <div className="h-4 w-1/2 bg-[#E8DDCB]/60 rounded-lg animate-pulse" />
            </div>
            <div className="h-10 w-32 bg-[#E8DDCB]/70 rounded-xl animate-pulse" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="h-28 bg-[#FFFBF5] border border-[#E8DDCB]/60 rounded-2xl animate-pulse" />
            <div className="h-28 bg-[#FFFBF5] border border-[#E8DDCB]/60 rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 font-['Montserrat',sans-serif]">
        <div className="bg-[#FFFBF5] border border-rose-200 rounded-3xl p-8 text-center space-y-4 shadow-2xs">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <div className="space-y-1">
            <h2 className="text-base font-black text-[#422D0B]">
              Unable to Load Facility
            </h2>
            <p className="text-xs text-[#967A53] max-w-sm mx-auto leading-relaxed">
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 bg-[#FFA800] hover:bg-[#FFC24A] text-[#422D0B] rounded-xl text-xs font-black transition-all active:scale-95 shadow-2xs cursor-pointer inline-flex items-center gap-2"
          >
            <span>Go Back</span>
          </button>
        </div>
      </div>
    );
  }

  // Empty State (Facility Not Found)
  if (!facility) {
    return (
      <div className="max-w-2xl mx-auto p-4 sm:p-6 font-['Montserrat',sans-serif]">
        <div className="bg-[#FFFBF5] border border-[#E8DDCB] border-dashed rounded-3xl p-8 sm:p-12 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-white border border-[#E8DDCB] flex items-center justify-center text-[#967A53] shadow-2xs">
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
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>

          <div className="space-y-1">
            <h2 className="text-base font-black text-[#422D0B]">
              Facility Not Found
            </h2>
            <p className="text-xs text-[#967A53] max-w-xs mx-auto leading-relaxed">
              The facility you are looking for does not exist or has been removed.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 bg-[#FFA800] hover:bg-[#FFC24A] text-[#422D0B] rounded-xl text-xs font-black transition-all active:scale-95 shadow-2xs cursor-pointer inline-flex items-center gap-2"
          >
            <span>Return Previous Page</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={pageRef}
      className="max-w-5xl mx-auto p-4 sm:p-6 font-['Montserrat',sans-serif] text-[#422D0B]"
    >
      {/* Back Navigation Button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="group mb-5 text-xs font-extrabold text-[#967A53] hover:text-[#422D0B] transition-colors cursor-pointer inline-flex items-center gap-1.5"
      >
        <span className="text-sm transition-transform group-hover:-translate-x-1">
          ←
        </span>
        <span>Back</span>
      </button>

      {/* Main Content Details */}
      <div ref={contentRef}>
        <FacilityDetails facility={facility} />
      </div>
    </div>
  );
};

export default FacilityDetailsPage;