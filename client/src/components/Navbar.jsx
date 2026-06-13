import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <Link to="/" className="brand-logo">
            <img src="/logo.png" alt="NayePankh Foundation" className="brand-logo-img" />
          </Link>
        </div>
        <div className="navbar-links">
          {isAdminPage ? (
            <Link to="/" className="admin-link">
              ← Back to Registration
            </Link>
          ) : (
            <Link to="/admin/dashboard" className="admin-link">
              Admin Access
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
