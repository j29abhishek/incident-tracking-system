require("dotenv").config();
const cors = require("cors");
const express = require("express");
const connectDB = require("./src/config/db");

// routes
const authRoutes = require("./src/routes/authRoutes");
const serviceRoutes = require("./src/routes/serviceRoutes");
const incidentRoutes = require("./src/routes/incidentRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// connected database
connectDB();

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/incidents", incidentRoutes);

//cron-job for incident escalation.
require("./src/cron-job/escalateIncident");

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
