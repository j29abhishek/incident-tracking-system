const IncidentHistory = require("../models/IncidentHistory");
const Incident = require("../models/Incident");
const User = require("../models/User");
const computePriority = require("../utils/computePriority");

const reportIncident = async (req, res) => {
  try {
    const { title, description, service } = req.body;
    const reporterId = req.user.id;

    if (!title || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // Create the incident
    const newIncident = await Incident.create({
      title,
      description,
      service,
      reportedBy: reporterId,
    });

    //Emit event to all admins

    const io = req.app.get("io");
    io.emit("new-incident", newIncident);

    //Create history record

    const incidentHistory = await IncidentHistory.create({
      incident: newIncident._id,
      actionType: "CREATED",
      actedBy: reporterId,
      oldValue: null,
      newValue: {
        title: newIncident.title,
        description: newIncident.description,
        service: newIncident.service,
        reportedBy: newIncident.reportedBy,
        status: newIncident.status,
      },
    });

    res.status(201).json({
      message: "Incident reported successfully",
      incident: newIncident,
      // history: incidentHistory,
    });
  } catch (error) {
    console.error("Error reporting incident:", error);
    res.status(500).json({ message: "Failed to report incident" });
  }
};

const assignIncident = async (req, res) => {
  try {
    const { assignedTo, impact, urgency } = req.body;
    const adminId = req.user.id;
    const incidentId = req.params.id;

    const incident = await Incident.findById(incidentId);
    if (!incident)
      return res.status(404).json({ message: "Incident not found" });

    // Compute priority
    const priority = computePriority(impact, urgency);

    const oldValue = {
      assignedTo: incident.assignedTo,
      impact: incident.impact,
      urgency: incident.urgency,
      priority: incident.priority,
      status: incident.status,
    };

    // Update incident
    incident.assignedTo = assignedTo;
    incident.impact = impact;
    incident.urgency = urgency;
    incident.priority = priority;
    if (incident.status === "new") incident.status = "in_progress";

    await incident.save();

    // Create history inline
    const incidentHistory = await IncidentHistory.create({
      incident: incident._id,
      actedBy: adminId,
      actionType: "ASSIGNED",
      oldValue,
      newValue: {
        assignedTo,
        impact,
        urgency,
        priority,
        status: incident.status,
      },
    });

    const io = req.app.get("io");

    // Notify assigned engineer only
    if (assignedTo) io.emit(`assigned-incident-${assignedTo}`, incident);

    // Optionally, notify all admins about update
    // io.emit("update-incident", incident);

    res.json({
      message: "Incident assigned successfully",
      incident,
      history: incidentHistory,
    });
  } catch (error) {
    console.error("Error assigning incident:", error);
    res.status(500).json({ message: "Failed to assign incident" });
  }
};

const engineerAction = async (req, res) => {
  try {
    const { status, resolutionSummary, comment } = req.body;
    const engineerId = req.user.id;
    const incidentId = req.params.id;

    const incident = await Incident.findById(incidentId);
    if (!incident)
      return res.status(404).json({ message: "Incident not found" });

    const oldValue = {
      status: incident.status,
      resolution: incident.resolution ? incident.resolution.summary : null,
    };

    // Update incident based on action
    incident.status = status;
    if (status === "resolved") {
      incident.resolution = {
        resolvedBy: engineerId,
        resolvedAt: new Date(),
        summary: resolutionSummary || "",
      };
    }

    await incident.save();

    // Create history record
    const incidentHistory = await IncidentHistory.create({
      incident: incident._id,
      actedBy: engineerId,
      actionType: status === "resolved" ? "RESOLVED" : "STATUS_CHANGED",
      oldValue,
      newValue: {
        status: incident.status,
        resolution: incident.resolution ? incident.resolution.summary : null,
      },
      comment: comment || "",
    });

    res.json({
      message: `Incident ${status} successfully`,
      incident,
      history: incidentHistory,
    });
  } catch (error) {
    console.error("Error performing engineer action:", error);
    res.status(500).json({ message: "Failed to update incident" });
  }
};

// GET /api/incidents/:id/history

const getIncidentHistory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(400).json({ message: "Incident ID is required" });

    // Fetch history
    const history = await IncidentHistory.find({ incident: id })
      .sort({ actedAt: -1 })
      .populate("actedBy", "name role")
      .populate({
        path: "incident",
        select: "title service description",
        populate: { path: "service", select: "name" },
      });

    if (!history || history.length === 0) {
      return res.json([]);
    }

    const formatted = history.map((h) => {
      const incidentTitle = h.incident?.title || "N/A";
      const incidentDesc = h.incident?.description || "N/A";
      const serviceName = h.incident?.service?.name || "N/A";

      let summary = "";

      switch (h.actionType) {
        case "CREATED":
          summary = `Incident "${incidentTitle}" reported for service ${serviceName}. Status: ${h.newValue?.status || "N/A"}.`;
          break;
        case "ASSIGNED":
          summary = `Assigned to ${h.newValue?.assignedTo?.name || "N/A"}. Impact: ${h.newValue?.impact || "N/A"}, Urgency: ${h.newValue?.urgency || "N/A"}, Priority: ${h.newValue?.priority || "N/A"}. Status: ${h.newValue?.status || "N/A"}.`;
          break;
        case "RESOLVED":
          summary = `Status changed to resolved. Resolution: ${h.newValue?.resolution || "N/A"}.`;
          break;
        default:
          summary = h.comment || "Updated.";
      }

      return {
        timestamp: h.actedAt,
        actionType: h.actionType,
        title: incidentTitle,
        description: incidentDesc,
        updatedBy: {
          id: h.actedBy?._id || "N/A",
          name: h.actedBy?.name || "N/A",
          role: h.actedBy?.role || "N/A",
        },
        changesSummary: summary,
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching incident history:", error);
    res.status(500).json({
      message: "Failed to fetch incident history",
      error: error.message,
    });
  }
};

const getIncidents = async (req, res) => {
  try {
    // read query parameters
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const safePage = page < 1 ? 1 : page;
    const skip = (safePage - 1) * limit;

    const incidents = await Incident.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("reportedBy", "name role")
      .populate("assignedTo", "name role")
      .populate("service", "name description")
      .lean();

    const total = await Incident.countDocuments();

    res.status(200).json({
      success: true,
      page: safePage,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      incidents,
    });
  } catch (error) {
    console.error("Error fetching incidents:", error);
    res.status(500).json({ message: "Failed to fetch incidents" });
  }
};

const getUserIncidents = async (req, res) => {
  try {
    const userId = req.user.id;
    const incidents = await Incident.find({ reportedBy: userId })
      .lean()
      .sort({ createdAt: -1 })
      .populate("assignedTo", "name role")
      .populate("service", "name description");

    if (!incidents.length) {
      return res.status(200).json({
        message: "User incidents fetched successfully",
        incidents: [],
      });
    }

    res.status(200).json({
      message: "User incidents fetched successfully",
      incidents,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user incidents" });
  }
};

const getIncidentById = async (req, res) => {
  try {
    const incidentId = req.params.id;
    const incidents = await Incident.find({ _id: incidentId })
      .lean()
      .populate("assignedTo", "name role")
      .populate("reportedBy", "name _id role")
      .populate("service", "name description");

    if (!incidents.length) {
      return res.status(404).json({ message: "No incidents found for user" });
    }

    res.status(200).json({
      message: "User incidents fetched successfully",
      incidents,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user incidents" });
  }
};

const getAssignedIncidents = async (req, res) => {
  try {
    const engId = req.user.id;
    // console.log(engId);
    // Fetch incidents assigned to this engineer
    const incidents = await Incident.find({ assignedTo: engId })
      .populate("assignedTo", "name role") // Engineer info
      .populate("reportedBy", "name _id role") // User info
      .populate("service", "name description") // Service info
      .lean(); // Return plain JS objects

    if (!incidents || incidents.length === 0) {
      return res.status(200).json({
        message: "Incidents fetched successfully",
        incidents: [],
      });
    }

    res.status(200).json({
      message: "Assigned incidents fetched successfully",
      incidents,
    });
  } catch (err) {
    console.error("Error fetching assigned incidents:", err);
    res.status(500).json({ message: "Failed to fetch assigned incidents" });
  }
};

module.exports = {
  reportIncident,
  assignIncident,
  engineerAction,
  getIncidentHistory,
  getIncidents,
  getUserIncidents,
  getIncidentById,
  getAssignedIncidents,
};
