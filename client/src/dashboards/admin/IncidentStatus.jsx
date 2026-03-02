// src/components/IncidentStatusTable.jsx
import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "../../css/dashboard.css"; // adjust path to your CSS

const IncidentStatus = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/incidents?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIncidents(res.data.incidents || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      setError("Failed to fetch incidents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [page]);

  if (loading) return <p className="loading-state">Loading incidents...</p>;
  if (error) return <p className="error-state">{error}</p>;
  if (!incidents.length)
    return <p className="empty-state">No incidents available</p>;

  return (
    <div className="incident-page">
      <div className="incident-header">
        <h2>Incident Status</h2>
        <p>Overview of all reported incidents and their current status</p>
      </div>

      <div className="incident-table-wrapper">
        <table className="incident-table">
          <thead>
            <tr>
              <th>S. No</th>
              <th>Title</th>
              <th>Reported By</th>
              <th>Service</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((incident, index) => (
              <tr key={incident._id}>
                <td>{index + 1}</td>
                <td>{incident.title}</td>
                <td>{incident.reportedBy?.name || "N/A"}</td>
                <td>{incident.service?.name || "-"}</td>
                <td>
                  <span className={`status ${incident.status?.toLowerCase()}`}>
                    {incident.status || "N/A"}
                  </span>
                </td>
                <td>{incident.priority || "N/A"}</td>
                <td>{new Date(incident.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default IncidentStatus;
