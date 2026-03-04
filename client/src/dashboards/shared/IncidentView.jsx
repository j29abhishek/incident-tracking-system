import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axiosInstance";
import IncidentManageForm from "./IncidentManageForm";

const IncidentView = () => {
  const { id } = useParams();
  const [incident, setIncident] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [incidentRes, userRes] = await Promise.all([
          api.get(`/incidents/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setIncident(incidentRes.data.incidents); 
        setUser(userRes.data.user);
      } catch (err) {
        console.error("Failed to load data", err);
        setError("Failed to load incident or user info");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!incident) return <p>Incident not found</p>;
  if (!user) return <p>User info not found</p>;

  return <IncidentManageForm mode={user.role} incident={incident[0]} />;
};

export default IncidentView;
