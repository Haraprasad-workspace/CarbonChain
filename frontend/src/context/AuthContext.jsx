import { createContext, useEffect, useState } from "react";
import {
  registerUser,
  loginUser,
  getCurrentUser
} from "../services/authService";
import {
  setAuthData,
  getToken,
  getUser,
  clearAuthData
} from "../utils/storage";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUser());
  const [loading, setLoading] = useState(true);

  // Restore login session
  useEffect(() => {
    const restoreSession = async () => {
      const token = getToken();

      if (!token) {
        console.log("[AuthContext Debug] No session token found. User unauthenticated.");
        setLoading(false);
        return;
      }

      console.log("[AuthContext Debug] Token found, validating active session...");
      try {
        const data = await getCurrentUser();
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("[AuthContext Debug] Session restored successfully for user:", data.user?.email || data.user?.id);
      } catch (error) {
        console.error("[AuthContext Debug Error] Session restoration failed:", error.message || error);
        clearAuthData();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const register = async (userData) => {
    console.log("[AuthContext Debug] Attempting user registration with payload:", userData);
    try {
      const data = await registerUser(userData);
      console.log("[AuthContext Debug] Registration successful.");
      return data;
    } catch (error) {
      console.error("[AuthContext Debug Error] Registration failed:", error);
      throw error;
    }
  };

  const login = async (credentials) => {
    console.log("[AuthContext Debug] Attempting user login...");
    try {
      const data = await loginUser(credentials);
      setAuthData(data.token, data.user);
      setUser(data.user);
      console.log("[AuthContext Debug] Login successful for user:", data.user?.email);
      return data;
    } catch (error) {
      console.error("[AuthContext Debug Error] Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    console.log("[AuthContext Debug] Logging out current user...");
    clearAuthData();
    setUser(null);
  };

  const isAuthenticated = !!user;

  // High-End Loading Screen using Tailwind v4 inline hex styling
  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FFFBF5] text-[#422D0B] font-['Montserrat',sans-serif] selection:bg-[#FFA800] selection:text-white">
        <div className="relative flex items-center justify-center">
          {/* Outer Pulsing Glow */}
          <div className="absolute w-20 h-20 rounded-full bg-[#FFA800]/20 animate-ping" />
          
          {/* Ring Spinner */}
          <div className="w-12 h-12 border-4 border-[#E8DDCB] border-t-[#FFA800] rounded-full animate-spin" />
          
          {/* Inner Brand Dot */}
          <div className="absolute w-3 h-3 bg-[#FFA800] rounded-full shadow-[0_0_10px_#FFA800]" />
        </div>
        
        <div className="mt-8 flex flex-col items-center gap-1.5 text-center">
          <span className="font-bold text-xl tracking-wider text-[#422D0B] uppercase">
            CarbonChain
          </span>
          <span className="text-xs font-medium tracking-wide text-[#967A53] animate-pulse">
            Verifying Session & Carbon Ledger...
          </span>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};