import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "60px 24px", color: "#555" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
