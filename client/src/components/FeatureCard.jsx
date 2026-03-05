import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="feature-card">
      <div className="feature-card-title">
        <div className="feature-icon">
          <FontAwesomeIcon icon={icon} />
        </div>

        <h3>{title}</h3>
      </div>

      <p>{description}</p>
    </div>
  );
};

export default FeatureCard;
