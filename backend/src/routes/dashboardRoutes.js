const express = require("express");
const { getDashboardStats } = require("../controllers/dashboardController");
const verifyToken = require("../middleware/verifyToken");
const checkRole = require("../middleware/checkRole");
const router = express.Router();

router.get("/stats", verifyToken, checkRole(["admin"]), getDashboardStats);
module.exports = router;
