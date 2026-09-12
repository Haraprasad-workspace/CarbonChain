import { useNavigate } from "react-router-dom";
import WasteForm from "../../components/waste/WasteForm";

const RegisterWaste = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 font-['Montserrat',sans-serif] text-[#422D0B] selection:bg-[#FFA800] selection:text-white">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDCB] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#422D0B] tracking-tight">
            Register New Waste
          </h1>
          <p className="text-xs text-[#967A53] mt-1">
            Fill out the details below to list a new biomass or waste batch for processing.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/generator")}
          className="self-start sm:self-auto px-4 py-2.5 bg-white hover:bg-[#FFFBF5] text-[#422D0B] border border-[#E8DDCB] hover:border-[#FFA800] font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4 text-[#FFA800]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Main Form Container */}
      <div className="bg-white border border-[#E8DDCB] rounded-2xl p-6 sm:p-8 shadow-sm">
        <WasteForm />
      </div>
    </div>
  );
};

export default RegisterWaste;