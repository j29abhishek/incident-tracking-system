import { useState, useEffect } from "react";
import api from "../../api/axiosInstance";
import "../../css/forms.css"; // isolated CSS
import { calculatePriority } from "../../utils/calculatePriority";

const IncidentManageForm = ({ mode, incident }) => {
  const [form, setForm] = useState({
    assignedTo: incident.assignedTo?._id || "",
    impact: incident.impact || "",
    urgency: incident.urgency || "",
    status: incident.status || "new",
    priority: incident.priority || "low",
    resolutionSummary: incident.resolution?.summary || "",
  });

  const [engineers, setEngineers] = useState([]);
  const token = localStorage.getItem("token");

  // Auto-calculate priority when impact or urgency changes
  useEffect(() => {
    if (mode === "admin") {
      const newPriority = calculatePriority(form.impact, form.urgency);
      setForm((prev) => ({ ...prev, priority: newPriority }));
    }
  }, [form.impact, form.urgency, mode]);

  // Fetch engineers for admin dropdown
  useEffect(() => {
    if (mode === "admin") {
      const fetchEngineers = async () => {
        try {
          const res = await api.get("/auth/engineers", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setEngineers(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
          console.error("Failed to fetch engineers:", err);
          setEngineers([]);
        }
      };
      fetchEngineers();
    }
  }, [mode, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "admin") {
        await api.put(
          `/incidents/assign/${incident._id}`,
          {
            assignedTo: form.assignedTo,
            impact: form.impact,
            urgency: form.urgency,
            priority: form.priority,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      } else if (mode === "engineer") {
        await api.put(
          `/incidents/engineer-action/${incident._id}`,
          {
            status: form.status,
            resolutionSummary: form.resolutionSummary,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      }

      alert("Incident updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update incident");
    }
  };

  return (
    <form className="incident-form-container" onSubmit={handleSubmit}>
      <h2 className="incident-form-title">Incident Details</h2>

      <div className="incident-form-grid">
        {/* User-reported fields */}
        <div className="incident-field">
          <label>Title</label>
          <input value={incident.title} disabled />
        </div>

        <div className="incident-field">
          <label>Description</label>
          <textarea value={incident.description} disabled />
        </div>

        <div className="incident-field">
          <label>Service</label>
          <input value={incident.service?.name || incident.service} disabled />
        </div>

        <div className="incident-field">
          <label>Reported By</label>
          <input
            value={incident.reportedBy?.name || incident.reportedBy}
            disabled
          />
        </div>

        <div className="incident-field">
          <label>Status</label>
          <input value={incident.status} disabled />
        </div>

        {/* Admin editable fields */}
        {mode === "admin" && (
          <>
            <div className="incident-field">
              <label>Assign Engineer</label>
              <select
                name="assignedTo"
                value={form.assignedTo}
                onChange={handleChange}
              >
                <option value="">Select Engineer</option>
                {engineers.map((eng) => (
                  <option key={eng._id} value={eng._id}>
                    {eng.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="incident-field">
              <label>Impact</label>
              <select name="impact" value={form.impact} onChange={handleChange}>
                <option value="">Select</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="incident-field">
              <label>Urgency</label>
              <select
                name="urgency"
                value={form.urgency}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="incident-field">
              <label>Priority (auto-calculated)</label>
              <input value={form.priority} disabled />
            </div>
          </>
        )}

        {/* Engineer sees admin fields but read-only */}
        {mode === "engineer" && (
          <>
            <div className="incident-field">
              <label>Assigned To</label>
              <input value={form.assignedTo} disabled />
            </div>

            <div className="incident-field">
              <label>Impact</label>
              <input value={form.impact} disabled />
            </div>

            <div className="incident-field">
              <label>Urgency</label>
              <input value={form.urgency} disabled />
            </div>

            <div className="incident-field">
              <label>Priority</label>
              <input value={form.priority} disabled />
            </div>
          </>
        )}

        {/* Engineer editable fields */}
        {mode === "engineer" && (
          <>
            <div className="incident-field">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="new">New</option>
                <option value="in_progress">In Progress</option>
                <option value="on_hold">On Hold</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {form.status === "resolved" && (
              <div className="incident-field">
                <label>Resolution Summary</label>
                <textarea
                  name="resolutionSummary"
                  value={form.resolutionSummary}
                  onChange={handleChange}
                />
              </div>
            )}
          </>
        )}
      </div>

      <button type="submit" className="incident-submit-btn">
        Save
      </button>
    </form>
  );
};

export default IncidentManageForm;
