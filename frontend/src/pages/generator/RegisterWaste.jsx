import { useNavigate } from "react-router-dom";
import WasteForm from "../../components/waste/WasteForm";

const RegisterWaste = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 font-['Plus_Jakarta_Sans',sans-serif] text-[#1E332B] selection:bg-[#143B36] selection:text-white">
      {/* Navigation & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8EFEA] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E332B] tracking-tight">
            Register New Waste
          </h1>
          <p className="text-xs text-[#63786E] mt-1">
            Fill out the details below to list a new biomass or waste batch for processing.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/generator")}
          className="self-start sm:self-auto px-4 py-2.5 bg-white hover:bg-[#F4F6F0] text-[#1E332B] border border-[#E6EDE8] hover:border-[#73A892] font-semibold text-xs rounded-xl shadow-[0px_1px_3px_rgba(0,0,0,0.03)] transition-all flex items-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4 text-[#73A892]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Main Form Container */}
      <div className="bg-white border border-[#E6EDE8] rounded-2xl p-6 sm:p-8 shadow-[0px_1px_3px_rgba(0,0,0,0.03),0px_4px_12px_rgba(22,41,37,0.03)]">
        <WasteForm />
      </div>
    </div>
  );
};

export default RegisterWaste;