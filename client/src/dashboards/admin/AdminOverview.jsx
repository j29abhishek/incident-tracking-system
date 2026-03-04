import React, { useState ,useEffect} from "react";
import api from "../../api/axiosInstance";
import { Link } from "react-router-dom";

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeIncidents: 0,
    totalServices: 0,
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    getStats();
  }, []);

  const getStats = async () => {
    if (!token) return;
    try {
      const res = await api.get("/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStats(res.data);
    } catch (error) {
      console.log("Error in fetching stats");
    }
  };
  return (
    <div>
      <h2 className="dash-main-title">Dashboard Overview</h2>

      <div className="dash-card-grid">
        <div className="dash-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>

        <div className="dash-card">
          <h3>Active Incidents</h3>
          <p>{stats.activeIncidents}</p>
          {/* <Link to="">Go to Incidents</Link> */}
        </div>

        <div className="dash-card">
          <h3>Services</h3>
          <p>{stats.totalServices}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
