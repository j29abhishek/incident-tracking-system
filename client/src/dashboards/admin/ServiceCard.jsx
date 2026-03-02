import React from "react";

const ServiceCard = ({ service }) => {
  const { name, description, currentStatus, createdAt } = service;

  const statusColor = {
    Healthy: "#28a745", // green
    Degraded: "#fd7e14", // orange
    Down: "#dc3545", // red
  };

  return (
    <div className="service-card">
      <div className="card-header">
        <h3>{name}</h3>
        <span
          className="status-dot"
          style={{ backgroundColor: statusColor[currentStatus] }}
        ></span>
      </div>
      <div className="card-description">{description}</div>
      <div className="card-footer">
        <small>Created: {new Date(createdAt).toLocaleDateString()}</small>
      </div>
    </div>
  );
};

export default ServiceCard;
