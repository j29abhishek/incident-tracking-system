import React from "react";
import { Link } from "react-router-dom";
import {
  faLayerGroup,
  faUserShield,
  faClockRotateLeft,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import "../css/home.css";

import FeatureCard from "../components/FeatureCard";
import Footer from "../components/Footer";
const Home = () => {
  return (
    <div className="home-page">
      <div className="navbar">
        <div className="navbar-brand">
          <img src="/itslogo.png" alt="" />
        </div>
        <div className="login">
          <Link to="/login" className="login-link">
            Login
          </Link>
        </div>
      </div>

      <div className="homepage-main">
        <div className="service-introduction">
          <h2>
            <span>Incident Tracking </span> System for modern organization
          </h2>
          <p>
            A centralized system to report, assign, track, and resolve service
            incidents with role-based access, accountability, and complete audit
            history.
          </p>
          <div className="create-account">
            <Link to="signup">
              <button>Create Account</button>
            </Link>
          </div>
        </div>
        <div className="features-grid">
          <FeatureCard
            icon={faLayerGroup}
            title="Centralized Reporting"
            description="All incidents are logged and tracked in one unified platform."
          />

          <FeatureCard
            icon={faUserShield}
            title="Role-Based Workflow"
            description="Users, engineers, and admins interact based on clear responsibilities."
          />

          <FeatureCard
            icon={faClockRotateLeft}
            title="Status & History"
            description="Track lifecycle changes with complete incident timelines."
          />

          <FeatureCard
            icon={faEye}
            title="Admin Oversight"
            description="Monitor incidents, manage services, and handle escalations."
          />
        </div>
      </div>

      <section className="features-section">
        <h3 className="features-title">Key Capabilities</h3>

        <ul className="features-list">
          <li>
            <span className="feature-sec-icon">✔</span>
            Users can report incidents through a centralized self-service portal
            with structured inputs.
          </li>

          <li>
            <span className="feature-sec-icon">✔</span>
            Incidents capture complete and consistent information using
            predefined templates and priorities.
          </li>

          <li>
            <span className="feature-sec-icon">✔</span>
            Role-based workflows ensure incidents are reviewed, assigned, and
            resolved with clear accountability.
          </li>

          <li>
            <span className="feature-sec-icon">✔</span>
            Real-time status updates and notifications keep users informed
            throughout the incident lifecycle.
          </li>
        </ul>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
