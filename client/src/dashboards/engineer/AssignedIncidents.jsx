import React, { useEffect, useState } from "react";
import { socket } from "../../socket/socket";
import api from "../../api/axiosInstance";
// import IncidentTable from "../shared/IncidentTable";
import { useNavigate } from "react-router-dom";

// const socket = io("http://localhost:4000");

const AssignedIncidents = () => {
  const [incidents, setIncidents] = useState([]);
  const token = localStorage.getItem("token");

  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  const getUserId = async () => {
    if (!token) return;
    try {
      const res = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserId(res.data.user._id);
      // console.log(res.data.user._id);
    } catch (error) {
      console.log("Error fetching details");
    }
  };

  const getIncidents = async () => {
    try {
      const res = await api.get("/incidents/assignedto", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIncidents(res.data.incidents);
      console.log(res.data.incidents);
    } catch (error) {
      console.log("Failed to fetch incidents");
    }
  };

  useEffect(() => {
    const init = async () => {
      await getUserId();
      await getIncidents();
    };
    init();
  }, []);

  useEffect(() => {
    if (!userId) return; // wait until userId is fetched

    socket.on(`assigned-incident-${userId}`, (incident) => {
      setIncidents((prev) => [incident, ...prev]);
      // console.log("Socket connected.");
    });

    return () => socket.off(`assigned-incident-${userId}`);
  }, [userId]);

  if (!incidents.length) {
    return <p className="empty-state">No incidents found</p>;
  }

  // console.log(incidents[0].reportedBy.name,"reported by");

  return (
    <div className="incident-page">
      <div className="incident-header">
        <h2>Incidents</h2>
        <p>Overview of all reported incidents that are assinged to you. click on view to manage</p>
      </div>

      <div className="incident-table-wrapper">
        <table className="incident-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Reported By</th>
              <th>Service</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {incidents.map((incident) => (
              <tr key={incident._id}>
                <td className="title-cell">{incident.title}</td>

                <td>{incident.reportedBy.name || "—"}</td>

                <td>{incident.service?.name || "—"}</td>

                <td>
                  <span className={`status ${incident.status}`}>
                    {incident.status.replace("_", " ")}
                  </span>
                </td>

                <td>
                  <span className={`priority ${incident.priority}`}>
                    {incident.priority}
                  </span>
                </td>

                <td>{new Date(incident.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="view-btn"
                    onClick={() => {
                      navigate(`/engineer/report/${incident._id}`);
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* <IncidentTable incidents={incidents} showAdminColumns  /> */}
    </div>
  );
};

export default AssignedIncidents;
