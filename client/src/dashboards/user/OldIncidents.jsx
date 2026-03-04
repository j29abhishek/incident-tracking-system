import React from "react";
import IncidentTable from "../shared/IncidentTable";
import { useState,useEffect } from "react";
import api from "../../api/axiosInstance";
const OldIncidents = () => {
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
  return (
    <div className="incident-page">
      <div className="incident-header">
        <h2>Incidents</h2>
        <p>Overview of all reported incidents</p>
      </div>

      <IncidentTable incidents={incidents} />
    </div>
  );
};

export default OldIncidents;
