import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Verification from "../pages/auth/Verification";

import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Ecosystem Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/verification" element={<Verification />} />
          
          {/* Main Dashboard Placeholder / Landing */}
          <Route
            path="/"
            element={
              <div className="min-h-screen bg-[#FFFBF5] text-[#422D0B] font-['Montserrat',sans-serif] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#FFA800] flex items-center justify-center shadow-lg mb-4">
                  <svg className="w-8 h-8 text-[#422D0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold tracking-tight mb-2">CarbonChain Dashboard</h1>
                <p className="text-xs text-[#967A53] max-w-sm">
                  Welcome to the ecosystem. Your verified trading dashboard and asset tracker views go here.
                </p>
              </div>
            }
          />
        </Route>

        {/* Fallback Catch-All Route */}
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;