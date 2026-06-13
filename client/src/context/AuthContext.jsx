import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await api.get("/api/auth/me");
        setAdmin(response.data.admin);
      } catch (error) {
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  const logout = async () => {
    try {
      await api.get("/api/auth/logout");
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      setAdmin(null);
      navigate("/admin/login");
    }
  };

  return (
    <AuthContext.Provider value={{ admin, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
