import React, { useState, useEffect } from "react";
import api from "../../api/axiosInstance";
import ServiceCard from "./ServiceCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchServices = async () => {
    try {
      const res = await api.get("/services", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices(res.data.services);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?"))
      return;
    try {
      await api.delete(`/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="services-page">
      <div className="services-header">
        <h2>All Services</h2>
        <Link to="/admin/add-service">
          <button className="add-service-btn" >
            <FontAwesomeIcon icon={faPlus} className="icon" /> Add New Service
          </button>
        </Link>
      </div>

      {loading ? (
        <p>Loading services...</p>
      ) : services.length === 0 ? (
        <p>No services available</p>
      ) : (
        <div className="services-grid">
          {services.map((service) => (
            <div key={service._id} className="service-card-wrapper">
              <ServiceCard service={service} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
