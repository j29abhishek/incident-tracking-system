import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faUser,
  faInfoCircle,
  faCalendarAlt,
  faExclamationCircle,
  faThLarge,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";

const UserDashOverview = () => {
  const navigate = useNavigate();
  //   only need the incident with status !resolved
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await api.get("/incidents/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setIncidents(res.data.incidents);
    } catch (error) {
      console.error("Error in fetching incidents", error);
    }
  };

  const activeIncidents = incidents.filter(
    (incident) =>
      incident.status.toLowerCase() !== "resolved" &&
      incident.status.toLowerCase() !== "closed",
  );

  return (
    <div className="user-dashboard-index">
      <h2>Your Active Incidents</h2>
      {activeIncidents.length === 0 ? (
        <div className="no-incidents">
          <FontAwesomeIcon icon={faInfoCircle} /> No Active incidents reported
          by you, for older incident check on old incidents.
        </div>
      ) : (
        <div className="incident-table-wrapper">
        <table className="incident-table">
          <thead>
            <tr>
              <th>
                <FontAwesomeIcon className="ud-icon" icon={faFileAlt} /> Incident
              </th>
              <th>
                <FontAwesomeIcon className="ud-icon" icon={faUser} /> Assigned To
              </th>
              <th>
                <FontAwesomeIcon className="ud-icon" icon={faInfoCircle} /> Status
              </th>
              <th>
                <FontAwesomeIcon className="ud-icon" icon={faCalendarAlt} /> Date
              </th>
              <th>
                <FontAwesomeIcon className="ud-icon" icon={faExclamationCircle} /> Priority
              </th>
            </tr>
          </thead>
          <tbody>
            {activeIncidents.map((incident) => (
              <tr key={incident._id}>
                <td>{incident.title}</td>
                <td>{incident.assignedTo?.name || 'N/A'}</td>
                <td className={`status ${incident.status.toLowerCase()}`}>
                  {incident.status}
                </td>
                <td>{new Date(incident.createdAt).toLocaleDateString()}</td>
                <td>{incident.priority}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
      <button
        className="explore-services-btn"
        onClick={() => navigate("/explore-services")}
      >
        <FontAwesomeIcon className="ud-btn-icon" icon={faThLarge} /> Explore Services
      </button>
    </div>
  );
};

export default UserDashOverview;
