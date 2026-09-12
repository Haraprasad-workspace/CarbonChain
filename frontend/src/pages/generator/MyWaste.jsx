import { useNavigate } from "react-router-dom";
import WasteList from "../../components/waste/WasteList";

const MyWaste = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 font-['Montserrat',sans-serif] text-[#422D0B] selection:bg-[#FFA800] selection:text-white">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDCB] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#422D0B] tracking-tight">
            My Waste Inventory
          </h1>
          <p className="text-xs text-[#967A53] mt-1">
            Track, manage, and register your listed biomass and waste batches.
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => navigate("/generator/register-waste")}
          className="self-start sm:self-auto px-5 py-2.5 bg-[#FFA800] hover:bg-[#FFC24A] text-[#422D0B] font-bold text-xs rounded-xl shadow transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Register New Waste</span>
        </button>
      </div>

      {/* Main Waste List View */}
      <div className="bg-white border border-[#E8DDCB] rounded-2xl p-6 sm:p-8 shadow-sm">
        <WasteList />
      </div>

      {/* Footer Navigation */}
      <div className="pt-2 flex justify-start">
        <button
          type="button"
          onClick={() => navigate("/generator")}
          className="px-4 py-2.5 bg-white hover:bg-[#FFFBF5] text-[#422D0B] border border-[#E8DDCB] hover:border-[#FFA800] font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4 text-[#FFA800]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Dashboard</span>
        </button>
      </div>
    </div>
  );
};

export default MyWaste;