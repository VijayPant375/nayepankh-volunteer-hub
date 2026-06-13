import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <div className="brand-logo">
            <span className="brand-leaf" aria-hidden="true">🌿</span>
            <div className="brand-text">
              <span className="brand-name">NayePankh Foundation</span>
              <span className="brand-tagline">Giving Wings to Dreams</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
