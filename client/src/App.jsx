import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import RegisterPage from "./pages/RegisterPage";
import AdminLogin from "./pages/AdminLogin";

function AdminDashboardPlaceholder() {
  return (
    <div style={{ padding: "60px 24px", textAlign: "center", color: "#555" }}>
      <h2>Admin Dashboard</h2>
      <p style={{ marginTop: 8 }}>This page will be completed in Phase 6.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<RegisterPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPlaceholder />} />
      </Routes>
    </BrowserRouter>
  );
}
