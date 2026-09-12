import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // Branded Morning Marigold Loading State
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#FFFBF5] flex flex-col items-center justify-center font-['Montserrat',sans-serif]">
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-12 h-12 border-4 border-[#E8DDCB] border-t-[#FFA800] rounded-full animate-spin" />
          <div className="absolute w-6 h-6 bg-[#FFA800]/20 rounded-full" />
        </div>
        <p className="text-xs font-semibold text-[#422D0B] tracking-wider uppercase">
          Verifying Ecosystem Access...
        </p>
      </div>
    );
  }

  // Redirect Unauthenticated Users to Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render Child Routes
  return <Outlet />;
};

export default ProtectedRoute;