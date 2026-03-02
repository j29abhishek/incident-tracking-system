import React, { useEffect, useState } from "react";
import IncidentTable from "../shared/IncidentTable";
import api from "../../api/axiosInstance";

const AdminIncidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  return (
    <div className="incident-page">
      <div className="incident-header">
        <h2>Incidents</h2>
        <p>Overview of all reported incidents</p>
      </div>

      <IncidentTable incidents={incidents} />

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

export default AdminIncidents;
