import { useNavigate } from "react-router-dom";
import WasteList from "../../components/waste/WasteList";

const MyWaste = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 font-['Plus_Jakarta_Sans',sans-serif] text-[#1E332B] selection:bg-[#143B36] selection:text-white">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8EFEA] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E332B] tracking-tight">
            My Waste Inventory
          </h1>
          <p className="text-xs text-[#63786E] mt-1">
            Track, manage, and register your listed biomass and waste batches.
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => navigate("/generator/register-waste")}
          className="self-start sm:self-auto px-5 py-2.5 bg-[#143B36] hover:bg-[#0D2925] text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Register New Waste</span>
        </button>
      </div>

      {/* Main Waste List View */}
      <div className="bg-white border border-[#E6EDE8] rounded-2xl p-6 sm:p-8 shadow-[0px_1px_3px_rgba(0,0,0,0.03),0px_4px_12px_rgba(22,41,37,0.03)]">
        <WasteList />
      </div>

      {/* Footer Navigation */}
      <div className="pt-2 flex justify-start">
        <button
          type="button"
          onClick={() => navigate("/generator")}
          className="px-4 py-2.5 bg-white hover:bg-[#F4F6F0] text-[#1E332B] border border-[#E6EDE8] hover:border-[#73A892] font-semibold text-xs rounded-xl shadow-[0px_1px_3px_rgba(0,0,0,0.03)] transition-all flex items-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4 text-[#73A892]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Dashboard</span>
        </button>
      </div>
    </div>
  );
};

export default MyWaste;