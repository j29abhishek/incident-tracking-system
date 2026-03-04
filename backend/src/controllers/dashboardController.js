
const User = require("../models/User");
const Incident = require("../models/Incident");
const Service = require("../models/Service");

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      activeIncidents,
      totalServices,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }), // ✅ only end users
      Incident.countDocuments({
        status: { $nin: ["resolved", "closed"] },
      }),
      Service.countDocuments(),
    ]);

    res.status(200).json({
      totalUsers,
      activeIncidents,
      totalServices,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load dashboard stats" });
  }
};


module.exports = { getDashboardStats };