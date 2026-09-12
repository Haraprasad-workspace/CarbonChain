import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import useAuth from "../../hooks/useAuth";

import {
  getMyCarbonRecords,
  getFacilityCarbonRecords,
} from "../../services/carbonService";

import CarbonCard from "./CarbonCard";

const CarbonList = () => {
  const { user } = useAuth();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const gridRef = useRef(null);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError("");

      let data;

      if (user?.role === "WASTE_GENERATOR") {
        data = await getMyCarbonRecords();
      } else if (user?.role === "FACILITY") {
        data = await getFacilityCarbonRecords();
      } else {
        setRecords([]);
        return;
      }

      setRecords(data.carbonRecords || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch carbon records."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role) {
      fetchRecords();
    }
  }, [user?.role]);

  // Entrance animation for grid cards
  useEffect(() => {
    if (!loading && records.length > 0 && gridRef.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          gridRef.current.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.08,
            ease: "power2.out",
          }
        );
      }, gridRef);

      return () => ctx.revert();
    }
  }, [loading, records]);

  // Skeleton Loading Grid
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 font-['Plus_Jakarta_Sans',sans-serif]">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="bg-[#FAFBF9] border border-[#E1E6DE] rounded-2xl p-6 space-y-4 animate-pulse shadow-sm"
          >
            <div className="flex justify-between items-center">
              <div className="h-4 w-28 bg-[#E1E6DE] rounded-full" />
              <div className="h-4 w-16 bg-[#E1E6DE]/60 rounded-full" />
            </div>
            <div className="h-16 bg-[#F4F6F0] border border-[#E1E6DE] rounded-xl" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-10 bg-[#E1E6DE]/50 rounded-xl" />
              <div className="h-10 bg-[#E1E6DE]/50 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error Banner State
  if (error) {
    return (
      <div className="bg-[#FDF2F2] border border-[#F8D7DA] rounded-2xl p-6 font-['Plus_Jakarta_Sans',sans-serif] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="space-y-1">
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#A94442]">
            Error Fetching Logs
          </h4>
          <p className="text-xs text-[#A94442]/80">{error}</p>
        </div>
        <button
          type="button"
          onClick={fetchRecords}
          className="px-4 py-2 bg-[#143B36] hover:bg-[#0E2C28] text-[#FAFBF9] font-black text-xs rounded-xl transition-all cursor-pointer shadow-sm hover:shadow"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty State
  if (records.length === 0) {
    return (
      <div className="bg-[#FAFBF9] border border-[#E1E6DE] border-dashed rounded-3xl p-10 font-['Plus_Jakarta_Sans',sans-serif] text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-white border border-[#E1E6DE] flex items-center justify-center text-[#204E4A] text-xl font-black mx-auto shadow-sm">
          🌱
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-black text-[#162925]">
            No Carbon Records Available
          </h3>
          <p className="text-xs font-medium text-[#6B7D76] max-w-sm mx-auto">
            Once waste batches are processed and offsets calculated, your carbon impact metrics will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 font-['Plus_Jakarta_Sans',sans-serif]"
    >
      {records.map((record) => (
        <CarbonCard key={record._id} record={record} />
      ))}
    </div>
  );
};

export default CarbonList;