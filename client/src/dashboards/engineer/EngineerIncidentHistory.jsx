import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { useParams } from "react-router-dom";
import "../../css/dashboard.css";

const EngineerIncidentHistory = () => {
  const { incidentId } = useParams();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      setError(null);

      const res = await api.get(`/incidents/history/${incidentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setHistory(res.data || []);
    } catch (err) {
      setError("Failed to fetch incident history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (incidentId) fetchHistory();
  }, [incidentId]);

  if (loading) return <p className="loading-state">Loading history...</p>;
  if (error) return <p className="error-state">{error}</p>;
  if (!history.length) return <p className="empty-state">No history found</p>;

  const incidentTitle = history[0]?.title || "N/A";
  const incidentDesc = history[0]?.description || "N/A";

  return (
    <div className="incident-history-section">
      <div className="incident-header">
        <h2>Incident History Log</h2>
        <p>
          This table shows all actions and updates made on this incident,
          including status changes, assignments, resolutions, and comments.
        </p>
      </div>

      <div className="incident-details">
        <p>
          Title: <span>{incidentTitle}</span>
        </p>
        <p>
          Description: <span>{incidentDesc}</span>
        </p>
      </div>

      <div className="incident-table-wrapper">
        <table className="incident-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>Updated By</th>
              <th>Summary of Changes</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h, idx) => (
              <tr key={idx}>
                <td>{new Date(h.timestamp).toLocaleString()}</td>
                <td>
                  <span className={`status ${h.actionType.toLowerCase()}`}>
                    {h.actionType.replace("_", " ")}
                  </span>
                </td>
                <td>{h.updatedBy?.name || "—"}</td>
                <td>{h.changesSummary || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EngineerIncidentHistory;