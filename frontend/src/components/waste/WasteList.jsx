import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WasteCard from "./WasteCard";
import { getMyWasteBatches } from "../../services/wasteService";

const WasteList = () => {
  const navigate = useNavigate();
  const [wasteBatches, setWasteBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchWasteBatches = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyWasteBatches();
      setWasteBatches(data.wasteBatches || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Failed to fetch waste batches."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWasteBatches();
  }, []);

  // Loading State
  if (loading) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="relative flex items-center justify-center mb-3">
          <div className="w-10 h-10 border-4 border-[#E6EDE8] border-t-[#143B36] rounded-full animate-spin" />
          <div className="absolute w-4 h-4 bg-[#DCE9DF] rounded-full" />
        </div>
        <p className="text-xs font-semibold text-[#63786E] tracking-wider uppercase">
          Loading Waste Batches...
        </p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="w-full p-6 bg-red-50 border border-red-200 rounded-2xl text-center font-['Plus_Jakarta_Sans',sans-serif]">
        <p className="text-xs font-semibold text-red-700 mb-3">{error}</p>
        <button
          onClick={fetchWasteBatches}
          className="px-4 py-2 bg-[#143B36] hover:bg-[#0D2925] text-white font-semibold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8EFEA] pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E332B] tracking-tight">
            My Waste Batches
          </h2>
          <p className="text-xs text-[#63786E] mt-0.5">
            Manage your registered waste inventory, track status, or cancel active listings.
          </p>
        </div>

        <button
          onClick={() => navigate("/generator/waste/new")}
          className="self-start sm:self-auto px-4 py-2.5 bg-[#143B36] hover:bg-[#0D2925] text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Register New Batch</span>
        </button>
      </div>

      {/* Empty Inventory State */}
      {wasteBatches.length === 0 ? (
        <div className="w-full bg-white border border-[#E6EDE8] rounded-2xl p-10 text-center space-y-3 shadow-[0px_1px_3px_rgba(0,0,0,0.03)]">
          <div className="w-12 h-12 rounded-2xl bg-[#DCE9DF] flex items-center justify-center mx-auto text-[#1E3B30]">
            <svg className="w-6 h-6 text-[#143B36]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-base font-bold text-[#1E332B]">No Waste Batches Registered</h3>
          <p className="text-xs text-[#63786E] max-w-sm mx-auto">
            You haven't listed any biomass or waste batches yet. Start by registering your first batch to participate in carbon credit tracking.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate("/generator/waste/new")}
              className="px-5 py-2.5 bg-[#143B36] hover:bg-[#0D2925] text-white font-semibold text-xs rounded-xl shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Create First Listing</span>
            </button>
          </div>
        </div>
      ) : (
        /* Responsive Grid of Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wasteBatches.map((waste) => (
            <WasteCard
              key={waste._id}
              waste={waste}
              onUpdate={fetchWasteBatches}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WasteList;