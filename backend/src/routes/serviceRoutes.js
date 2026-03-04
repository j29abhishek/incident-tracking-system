const express = require("express");
const {
  createService,
  getServices,
  updateService,
  deleteService,
  getServiceById,
} = require("../controllers/serviceController");
const verifyToken = require("../middleware/verifyToken");
const checkRole = require("../middleware/checkRole");

const router = express.Router();

// POST /create-service → get-service
router.post("/", verifyToken, checkRole(["admin"]), createService);
router.get("/", getServices);
router.put("/:id", verifyToken, checkRole(["admin"]), updateService);
router.delete("/:id", verifyToken, checkRole(["admin"]), deleteService);

//get service by id
router.get("/:id", verifyToken, checkRole(["admin"]), getServiceById);
module.exports = router;
