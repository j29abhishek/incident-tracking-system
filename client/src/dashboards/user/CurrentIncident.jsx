import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faFileAlt,
  faUser,
  faCogs,
} from "@fortawesome/free-solid-svg-icons";
import api from "../../api/axiosInstance";
import "../../css/userdashboard.css";

const CurrentIncident = () => {
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchIncident = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await api.get("/incidents/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const incidents = Array.isArray(res.data?.incidents)
        ? res.data.incidents
        : [];

      // 1️⃣ keep only active incidents
      const activeIncidents = incidents.filter(
        (inc) =>
          inc?.status &&
          inc.status.toLowerCase() !== "resolved" &&
          inc.status.toLowerCase() !== "closed"
      );

      // 2️⃣ sort by latest createdAt
      activeIncidents.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      // 3️⃣ take the latest one
      setIncident(activeIncidents[0] || null);
    } catch (err) {
      console.error("Error fetching incidents", err);
      setIncident(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncident();
  }, []);

  if (loading) {
    return (
      <div className="current-loading">
        Loading current incident...
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="current-no-incident">
        <FontAwesomeIcon icon={faInfoCircle} /> No active incidents reported by you.
      </div>
    );
  }

  return (
    <div className="current-incident-page">
      <div className="current-incident-card">
        <h3 className="current-title">
          {incident.title || "Untitled Incident"}
        </h3>

        <div className="current-details">
          <p>
            <FontAwesomeIcon icon={faFileAlt} />
            <span>
              <strong>Incident:</strong>{" "}
              {incident.description || "No description available"}
            </span>
          </p>

          <p>
            <FontAwesomeIcon icon={faCogs} />
            <span>
              <strong>Service:</strong>{" "}
              {incident.service?.name || "N/A"}
            </span>
          </p>

          <p>
            <FontAwesomeIcon icon={faInfoCircle} />
            <span>
              <strong>Status:</strong>{" "}
              {incident.status || "Unknown"}
            </span>
          </p>

          <p>
            <FontAwesomeIcon icon={faUser} />
            <span>
              <strong>Assigned To:</strong>{" "}
              {incident.assignedTo?.name || "Not Assigned"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurrentIncident;