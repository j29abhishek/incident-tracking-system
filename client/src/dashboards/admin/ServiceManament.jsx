import React, { useEffect, useState } from "react";
import "../../css/serviceManagement.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import api from "../../api/axiosInstance";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get("/services", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(res.data.services || []);
    } catch (error) {
      console.error("Failed to fetch services", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch (error) {
      console.error("Failed to delete service", error);
    }
  };

  const handleUpdate = (id) => {
    if (!id) return;
    navigate(`/admin/update-service/${id}`);
  };

  return (
    <div className="service-management-page">
      <div className="service-header">
        <h2>Service Management</h2>
      </div>

      {loading ? (
        <p>Loading services...</p>
      ) : services.length === 0 ? (
        <p>No services available</p>
      ) : (
        <div className="incident-table-wrapper"> 
        <table className="service-table">
          <thead>
            <tr>
              <th>S. No</th>
              <th>Name</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={service._id}>
                <td>{index + 1}</td>
                <td>{service.name}</td>

                <td>{service.currentStatus}</td>
                <td>{service.createdAt}</td>
                <td>
                  <button
                    className="icon-btn edit-btn"
                    onClick={() => {
                      handleUpdate(service._id);
                    }}
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    className="icon-btn delete-btn"
                    onClick={() => {
                      handleDelete(service._id);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
};

export default ServiceManagement;
