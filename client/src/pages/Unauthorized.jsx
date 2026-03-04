import { Link } from "react-router-dom";
import "../css/auth.css";

const Unauthorized = () => {
  return (
    <div className="unauth-page">
      <div className="unauth-card">
        <h1>Access Denied</h1>
        <p className="unauth-subtitle">
          You do not have permission to view this page.
        </p>

        <div className="unauth-instructions">
          <p>
            This area is restricted based on your account role or permissions.
          </p>
          <p>
            If you believe this is a mistake, please contact your system
            administrator.
          </p>
        </div>

        <Link to="/" className="unauth-home-link">
          ← Go back to Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;