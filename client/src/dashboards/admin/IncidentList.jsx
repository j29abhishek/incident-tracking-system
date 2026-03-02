// incident list for history

import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";

const IncidentList = () => {
  const [incidents, setIncidents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate=useNavigate();

  const limit = 10;

  const fetchIncidents = async () => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/incidents?page=${page}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIncidents(res.data.incidents);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setError("Failed to fetch incidents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, [page]);

  if (loading) {
    return <p className="loading-state">Loading incidents...</p>;
  }

  if (error) {
    return <p className="error-state">{error}</p>;
  }

  const handleViewHistory=(incidentId)=>{
    if(!incidentId) return ;
    navigate(`history/${incidentId}`);
  }

  return (
    <div className="incident-page">
      <div className="incident-header">
        <h2>Incidents</h2>
        <p>Overview of all reported incidents</p>
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


                <td>{new Date(incident.createdAt).toLocaleDateString()}</td>

                <td>
                  <button className="view-btn" onClick={()=>{
                    handleViewHistory(incident._id);
                  }}>View History</button>
                </td>
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

export default IncidentList;
