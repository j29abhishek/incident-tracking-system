import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCogs,
  faFileAlt,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import "../css/home.css";
import Footer from "../components/Footer";

const PublicServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchServices = async () => {
    try {
      const res = await api.get("/services");
      setServices(res.data.services);
    } catch (error) {
      console.error("Error fetching services", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  if (loading) {
    return <div className="public-loading">Loading services...</div>;
  }

  return (
    <div className="public-services-page">
      {/* Header */}
      <div className="public-header">
        <button className="public-back-btn" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} /> Back
        </button>
        <div className="public-header-text">
          <h2>Explore Our Services</h2>
          <p>
            Browse available services and see what we offer. Sign up to request
            a service.
          </p>
        </div>
      </div>

      {/* Services Grid */}
      {services.length === 0 ? (
        <div className="public-no-services">
          <FontAwesomeIcon icon={faCogs} /> No services available at the moment.
        </div>
      ) : (
        <div className="public-services-grid">
          {services.map((service) => (
            <div key={service._id} className="public-service-card">
              <div className="public-service-icon">
                <FontAwesomeIcon icon={faFileAlt} size="2x" />
              </div>
              <h3 className="public-service-name">{service.name}</h3>
              <p className="public-service-desc">
                {service.description || "No description provided."}
              </p>
              <button className="public-btn-request" disabled>
                Request Service
              </button>
            </div>
          ))}
        </div>
      )}

      {/* <Footer/> */}
    </div>
  );
};

export default PublicServices;
