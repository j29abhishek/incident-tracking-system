import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faUsers,
  faTools,
  faTriangleExclamation,
  faChartBar,
  faRightFromBracket,
  faClockRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import "../css/dashboard.css";

const EngineerDashboard = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

    const handleNavClick = () => {
    if (window.innerWidth <= 900) {
      setOpenMenu(false);
    }
  };

  return (
    <div className="dash-wrapper">
      {/* NAVBAR */}
      <header className="dash-nav">
        <div className="dash-brand">
          <button
            className="toggle-menu"
            onClick={() => setOpenMenu(!openMenu)}
          >
            <FontAwesomeIcon icon={openMenu ? faTimes : faBars} />
          </button>
          Incident Engineer
        </div>

        {/* <div className="dash-user">Engineer</div> */}
      </header>

      <div className="dash-container">
        {/* SIDEBAR */}
        <aside className={`dash-sidebar ${openMenu ? "open" : ""}`}>
          <div className="dash-group-title">Dashboard</div>

          {/* <NavLink to="" end className="dash-menu-item" onClick={handleNavClick}>
            <FontAwesomeIcon icon={faChartBar} className="menu-icon" />
            <span>Overview</span>
          </NavLink> */}

          {/* <div className="dash-group-title">Management</div> */}

          <NavLink to="" end className="dash-menu-item" onClick={handleNavClick}>
            <FontAwesomeIcon icon={faTriangleExclamation} className="menu-icon" />
            <span>Assigned Incidents</span>
          </NavLink>

          <NavLink to="incident-history" className="dash-menu-item" onClick={handleNavClick}>
            <FontAwesomeIcon
              icon={faClockRotateLeft}
              className="menu-icon"
            />
            <span>Incidents Logs</span>
          </NavLink>

          <div className="dash-group-title">Actions</div>

          <div className="dash-menu-item" onClick={handleLogout}>
            <FontAwesomeIcon icon={faRightFromBracket} className="menu-icon" />
            <span>Logout</span>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="dash-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EngineerDashboard;
