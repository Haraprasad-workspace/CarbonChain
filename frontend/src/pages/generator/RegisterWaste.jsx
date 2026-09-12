import { useNavigate } from "react-router-dom";
import WasteForm from "../../components/waste/WasteForm";

const RegisterWaste = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0C1C18] p-4 sm:p-8 w-full max-w-4xl mx-auto space-y-6 font-['Plus_Jakarta_Sans',sans-serif] text-[#F4F6F0] selection:bg-[#2D6B4E] selection:text-white">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#143B36] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#73A892] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8EA097]">
              Batch Registration
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F4F6F0] tracking-tight">
            Register New Waste
          </h1>
          <p className="text-xs text-[#8EA097] mt-1">
            Fill out the details below to list a new biomass or waste batch for processing.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/generator")}
          className="self-start sm:self-auto px-4 py-2.5 bg-[#143B36] hover:bg-[#1E5247] text-[#F4F6F0] border border-[#235349] hover:border-[#2D6B4E] font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4 text-[#73A892]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Main Form Container */}
      <div className="bg-[#143B36] border border-[#235349] rounded-2xl p-6 sm:p-8 shadow-[0px_4px_24px_rgba(10,28,24,0.4)]">
        <WasteForm />
      </div>
    </div>
  );
};

export default RegisterWaste;