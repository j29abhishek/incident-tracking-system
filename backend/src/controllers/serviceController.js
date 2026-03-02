const Service = require("../models/Service");

const createService = async (req, res) => {
  const { name, description } = req.body;
  const adminId = req.user.id;
  console.log("user id : ", adminId);

  if (!name) {
    return res.status(400).json({ message: "Service name is required" });
  }

  try {
    const existingService = await Service.findOne({ name });
    if (existingService) {
      return res.status(400).json({ message: "Service already exists" });
    }

    const service = await Service.create({
      name,
      description,
      createdBy: adminId,
    });

    res.status(201).json({ message: "Service created", service });
  } catch (error) {
    // Mongoose duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ message: "Service name already exists" });
    }

    res.status(500).json({ message: "Server error", error });
  }
};

const getServices = async (req, res) => {
  try {
    const services = await Service.find();

    if (!services || services.length === 0) {
      return res.status(200).json({
        services: [],
        message: "No service available",
      });
    }

    res.status(200).json({
      services: services,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching services",
      error: error.message,
    });
  }
};

const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(404).json({ message: "Service not found" });
    }

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({
      service,
    });
  } catch (error) {
    console.error("Error fetching service:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching service",
      error: error.message,
    });
  }
};

const updateService = async (req, res) => {
  const serviceId = req.params.id;
  const { name, description, currentStatus } = req.body;

  try {
    const updatedService = await Service.findByIdAndUpdate(
      serviceId,
      { name, description, currentStatus },
      { new: true, runValidators: true },
    );

    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({
      message: "Service updated successfully",
      service: updatedService,
    });
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({
      message: "Failed to update service",
      error: error.message,
    });
  }
};

const deleteService = async (req, res) => {
  const serviceId = req.params.id;
  try {
    const service = await Service.findByIdAndDelete(serviceId);
    if (!service)
      return res.status(400).json({
        message: "Service not found",
      });

    res.status(200).json({
      message: "Service deleted successfully.",
      service: service,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to delete service",
      error: error.message,
    });
  }
};
module.exports = {
  createService,
  getServices,
  updateService,
  deleteService,
  getServiceById,
};
