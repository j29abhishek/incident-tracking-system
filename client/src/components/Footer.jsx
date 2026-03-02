import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        {/* Brand */}
        <div className="footer-section">
          <h3>Incident Tracking System</h3>
          <p>
            A centralized platform to report, assign, track, and resolve service
            incidents with role-based access and full audit history.
          </p>
        </div>

        {/* Product */}
        <div className="footer-section">
          <h4>Product</h4>
          <ul>
            <li className="disabled">Features</li>
            <li className="disabled">Workflow</li>
            <li className="disabled">Security</li>
          </ul>
        </div>

        {/* Support */}
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li className="disabled">Documentation</li>
            <li className="disabled">Contact</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} Incident Tracking System. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;