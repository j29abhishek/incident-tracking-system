import React, { useEffect, useState } from "react";
import "../../css/serviceManagement.css";
import api from "../../api/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";

const ServiceForm = () => {
  const [service, setService] = useState({
    name: "",
    description: "",
    currentStatus: "Healthy",
  });
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  const { id } = useParams(); // for edit
  const navigate = useNavigate();

  // Prefill form if editing
  useEffect(() => {
    if (id) fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      const res = await api.get(`/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setService({
        name: res.data.service.name,
        description: res.data.service.description,
        currentStatus: res.data.service.currentStatus,
      });
    } catch (err) {
      setMessage("Failed to load service");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!service.name || !service.description) {
      setMessage("All fields are required");
      return;
    }

    try {
      if (id) {
        await api.put(`/services/${id}`, service, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Service updated successfully");
      } else {
        await api.post("/services", service, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("Service added successfully");
        setService({ name: "", description: "", currentStatus: "Healthy" });
      }

    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to save service");
    }
  };

  return (
    <div className="service-form-page">
      <div className="service-form-card">
        <h2 className="service-form-title">{id ? "Edit Service" : "Add Service"}</h2>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="service-input-group">
            <label>Service Name</label>
            <input
              type="text"
              name="name"
              value={service.name}
              onChange={handleChange}
              placeholder="Enter service name..."
            />
          </div>

          {/* Description */}
          <div className="service-input-group">
            <label>Description</label>
            <textarea
              name="description"
              value={service.description}
              onChange={handleChange}
              placeholder="Enter service description..."
              rows={4}
            />
          </div>

          {/* Status */}
          <div className="service-input-group">
            <label>Status</label>
            <select
              name="currentStatus"
              value={service.currentStatus}
              onChange={handleChange}
            >
              <option value="Healthy">Healthy</option>
              <option value="Degraded">Degraded</option>
              <option value="Down">Down</option>
            </select>
          </div>

          <button type="submit" className="service-form-btn">
            {id ? "Update Service" : "Add Service"}
          </button>

          {message && <p className="service-message">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;