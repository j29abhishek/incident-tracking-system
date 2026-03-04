require("dotenv").config();
const cors = require("cors");
const express = require("express");
const connectDB = require("./src/config/db");

// routes
const authRoutes = require("./src/routes/authRoutes");
const serviceRoutes = require("./src/routes/serviceRoutes");
const incidentRoutes = require("./src/routes/incidentRoutes");
const dashboardRoutes=require("./src/routes/dashboardRoutes");

const app = express();
const http=require('http').createServer(app);
const PORT = process.env.PORT || 3000;

// connected database
connectDB();

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/dashboard",dashboardRoutes);
//cron-job for incident escalation.
require("./src/cron-job/escalateIncident");

// ---------- SOCKET.IO SETUP ----------
const { Server } = require("socket.io");
const io = new Server(http, {
  cors: { origin: "http://localhost:5173" }, 
});

//accessible in controllers
app.set("io", io);

io.on("connection", (socket) => {
  // console.log("A client connected:", socket.id);

  socket.on("disconnect", () => {
    // console.log("Client disconnected:", socket.id);
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
