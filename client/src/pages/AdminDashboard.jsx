import { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import "./AdminDashboard.css";

const AREAS = [
  "Education", "Environment", "Healthcare", "Animal Welfare",
  "Elderly Care", "Women Empowerment", "Child Welfare", "Disaster Relief",
];

export default function AdminDashboard() {
  const { admin, logout } = useContext(AuthContext);
  const [volunteers, setVolunteers] = useState([]);
  const [total, setTotal] = useState(0);
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Stats (calculated client-side as requested)
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch volunteers
  const fetchVolunteers = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);
      if (areaFilter) params.append("areaOfInterest", areaFilter);
      if (debouncedSearch) params.append("search", debouncedSearch);

      const res = await api.get(`/api/volunteers?${params.toString()}`);
      setVolunteers(res.data.volunteers);
      setTotal(res.data.total);
    } catch (error) {
      console.error("Failed to fetch volunteers", error);
    }
  }, [statusFilter, areaFilter, debouncedSearch]);

  useEffect(() => {
    fetchVolunteers();
  }, [fetchVolunteers]);

  // Calculate stats on volunteers array change
  // Note: Since the backend returns a filtered list, we should calculate overall stats
  // from a separate call or just calculate from the currently fetched list.
  // The spec says: "Calculate these from the volunteers array on the frontend, no separate API call"
  // So stats reflect the CURRENT filtered view. If that's not intended, we'd need a separate endpoint.
  // Given the instruction, I'll calculate from `volunteers` array.
  useEffect(() => {
    const s = { total: volunteers.length, pending: 0, approved: 0, rejected: 0 };
    volunteers.forEach(v => {
      if (v.status === "pending") s.pending++;
      if (v.status === "approved") s.approved++;
      if (v.status === "rejected") s.rejected++;
    });
    setStats(s);
  }, [volunteers]);

  // Handle status update
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/api/volunteers/${id}/status`, { status: newStatus });
      fetchVolunteers(); // refresh
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Failed to update status");
    }
  };

  // Export CSV
  const handleExport = async () => {
    try {
      const res = await api.get("/api/volunteers/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "volunteers.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Failed to export", error);
      alert("Failed to export CSV");
    }
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, '0');
    const month = d.toLocaleString('default', { month: 'short' });
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <div className="admin-dashboard">
      {/* HEADER BAR */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Volunteer Management Dashboard</h1>
        </div>
        <div className="header-right">
          <span className="admin-name">Welcome, {admin?.name}</span>
          <button className="btn-logout" onClick={logout}>Logout</button>
        </div>
      </header>

      <main className="dashboard-content">
        {/* STATS ROW */}
        <div className="stats-row">
          <div className="stat-card">
            <h3>Total Volunteers</h3>
            <p className="stat-value">{stats.total}</p>
          </div>
          <div className="stat-card stat-pending">
            <h3>Pending</h3>
            <p className="stat-value">{stats.pending}</p>
          </div>
          <div className="stat-card stat-approved">
            <h3>Approved</h3>
            <p className="stat-value">{stats.approved}</p>
          </div>
          <div className="stat-card stat-rejected">
            <h3>Rejected</h3>
            <p className="stat-value">{stats.rejected}</p>
          </div>
        </div>

        {/* FILTERS ROW */}
        <div className="filters-row">
          <input
            type="text"
            className="filter-search"
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            className="filter-select"
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
          >
            <option value="">All Areas of Interest</option>
            {AREAS.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
          <button className="btn-export" onClick={handleExport}>
            Export CSV
          </button>
        </div>

        {/* VOLUNTEERS TABLE */}
        <div className="table-container">
          <table className="volunteers-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Skills</th>
                <th>Area of Interest</th>
                <th>Availability</th>
                <th>Status</th>
                <th>Registered At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.length === 0 ? (
                <tr>
                  <td colSpan="9" className="no-data">No volunteers found.</td>
                </tr>
              ) : (
                volunteers.map(v => (
                  <tr key={v._id}>
                    <td>{v.name}</td>
                    <td>{v.email}</td>
                    <td>{v.phone}</td>
                    <td className="skills-cell">
                      {v.skills.map(s => <span key={s} className="small-pill">{s}</span>)}
                    </td>
                    <td>{v.areaOfInterest}</td>
                    <td>{v.availability}</td>
                    <td>
                      <span className={`status-badge status-${v.status}`}>
                        {v.status}
                      </span>
                    </td>
                    <td>{formatDate(v.registeredAt)}</td>
                    <td className="actions-cell">
                      <button
                        className="btn-action btn-approve"
                        disabled={v.status === "approved"}
                        onClick={() => handleUpdateStatus(v._id, "approved")}
                      >
                        Approve
                      </button>
                      <button
                        className="btn-action btn-reject"
                        disabled={v.status === "rejected"}
                        onClick={() => handleUpdateStatus(v._id, "rejected")}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
