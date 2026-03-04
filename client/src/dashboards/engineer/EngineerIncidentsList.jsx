import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import "../../css/dashboard.css";

const EngineerIncidentList = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const fetchAssignedIncidents = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/incidents/assignedto", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIncidents(res.data.incidents || []);
    } catch (err) {
      setError("Failed to fetch assigned incidents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedIncidents();
  }, []);

  const handleViewHistory = (incidentId) => {
    if (!incidentId) return;
    navigate(incidentId);
  };

  if (loading) {
    return <p className="loading-state">Loading incidents...</p>;
  }

  if (error) {
    return <p className="error-state">{error}</p>;
  }

  if (!incidents.length) {
    return <p className="empty-state">No assigned incidents</p>;
  }

  return (
    <div className="incident-page">
      <div className="incident-header">
        <h2>Assigned Incidents</h2>
        <p>All incidents that are assinged to you, click on view history to see timeline of an incident.</p>
      </div>

      <div className="incident-table-wrapper">
        <table className="incident-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Reported By</th>
              <th>Service</th>
              <th>Status</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {incidents.map((incident) => (
              <tr key={incident._id}>
                <td className="title-cell">{incident.title}</td>

                <td>{incident.reportedBy?.name || "—"}</td>

                <td>{incident.service?.name || "—"}</td>

                <td>
                  <span className={`status ${incident.status}`}>
                    {incident.status.replace("_", " ")}
                  </span>
                </td>

                <td>
                  {new Date(incident.createdAt).toLocaleDateString()}
                </td>

                <td>
                  <button
                    className="view-btn"
                    onClick={() => handleViewHistory(incident._id)}
                  >
                    View History
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EngineerIncidentList;