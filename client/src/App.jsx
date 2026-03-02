import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AdminDashboard from "./dashboards/AdminDashboard";
import AdminOverview from "./dashboards/admin/AdminOverview";
import EngineerDashboard from "./dashboards/EngineerDashboard";
import UserDashboard from "./dashboards/UserDashboard";
import AdminIncidents from "./dashboards/admin/AdminIncidents";
import AdminIncidentHistory from "./dashboards/admin/AdminIncidentsHistory";
// import Incident from "../../backend/src/models/Incident";
import IncidentList from "./dashboards/admin/IncidentList";
import ServicesPage from "./dashboards/admin/ServicesPage";
import ServiceManagement from "./dashboards/admin/ServiceManament";
import ServiceForm from "./dashboards/admin/ServiceForm";
import IncidentStatus from "./dashboards/admin/IncidentStatus";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<AdminOverview />} />
          <Route path="manage-services" element={<ServiceManagement/>} />
          <Route path="services" element={<ServicesPage/>} />
          <Route path="incidents" element={<IncidentList/>} />
          <Route path="admin-incidents" element={<AdminIncidents />} />
          <Route path="incidents/history/:incidentId" element={<AdminIncidentHistory/>} />
          <Route path="add-service" element ={<ServiceForm/>} />
          <Route path="update-service/:id" element={<ServiceForm/>} />
          <Route path="incidents-status" element={<IncidentStatus/>} />
        </Route>

        <Route path="/engineer" element={<EngineerDashboard />}></Route>

        <Route path="/user-dashboard" element={<UserDashboard />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
