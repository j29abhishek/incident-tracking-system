import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import PublicServices from "./pages/PublicServices";
import Unauthorized from "./pages/Unauthorized";

// Dashboards
import AdminDashboard from "./dashboards/AdminDashboard";
import EngineerDashboard from "./dashboards/EngineerDashboard";
import UserDashboard from "./dashboards/UserDashboard";

// Admin pages
import AdminOverview from "./dashboards/admin/AdminOverview";
import AdminIncidents from "./dashboards/admin/AdminIncidents";
import AdminIncidentHistory from "./dashboards/admin/AdminIncidentsHistory";
import IncidentList from "./dashboards/admin/IncidentList";
import ServicesPage from "./dashboards/admin/ServicesPage";
import ServiceManagement from "./dashboards/admin/ServiceManament";
import ServiceForm from "./dashboards/admin/ServiceForm";
import IncidentStatus from "./dashboards/admin/IncidentStatus";

// User pages
import UserDashOverview from "./dashboards/user/UserDashOverview";
import CurrentIncident from "./dashboards/user/CurrentIncident";
import OldIncidents from "./dashboards/user/OldIncidents";
import ReportIncident from "./dashboards/user/ReportIncident";

// Engineer pages
import AssignedIncidents from "./dashboards/engineer/AssignedIncidents";

// Shared
import IncidentView from "./dashboards/shared/IncidentView";

// Protected route
import ProtectedRoute from "./components/ProtectedRoute";
import EngineerIncidentList from "./dashboards/engineer/EngineerIncidentsList";
import EngineerIncidentHistory from "./dashboards/engineer/EngineerIncidentHistory";

function App() {
  return (
    <Router>
      <Routes>
        {/* ---------- Public Routes ---------- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/explore-services" element={<PublicServices />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* ---------- Admin Routes ---------- */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<AdminOverview />} />
            <Route path="manage-services" element={<ServiceManagement />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="incidents" element={<IncidentList />} />
            <Route path="admin-incidents" element={<AdminIncidents />} />
            <Route
              path="incidents/history/:incidentId"
              element={<AdminIncidentHistory />}
            />
            <Route path="add-service" element={<ServiceForm />} />
            <Route path="update-service/:id" element={<ServiceForm />} />
            <Route path="incidents-status" element={<IncidentStatus />} />
            <Route path="report/:id" element={<IncidentView />} />
          </Route>
        </Route>

        {/* ---------- Engineer Routes ---------- */}
        <Route element={<ProtectedRoute allowedRoles={["engineer"]} />}>
          <Route path="/engineer" element={<EngineerDashboard />}>
            <Route index element={<AssignedIncidents />} />
            <Route path="incident-history" element={<EngineerIncidentList />} />
            <Route path="report/:id" element={<IncidentView />} />
            <Route
              path="incident-history/:incidentId"
              element={<EngineerIncidentHistory />}
            />
          </Route>
        </Route>

        {/* ---------- User Routes ---------- */}
        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route path="/user-dashboard" element={<UserDashboard />}>
            <Route index element={<UserDashOverview />} />
            <Route path="current-incident" element={<CurrentIncident />} />
            <Route path="old-incidents" element={<OldIncidents />} />
            <Route path="report-incident" element={<ReportIncident />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
