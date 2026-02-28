const IncidentHistory = require("../models/IncidentHistory");
const Incident = require("../models/Incident");
const computePriority=require("../utils/computePriority");

const reportIncident = async (req, res) => {
  try {
    const { title, description, service } = req.body;
    const reporterId = req.user.id;

    // Create the incident
    const newIncident = await Incident.create({
      title,
      description,
      service,
      reportedBy: reporterId,
    });

    //Create history record
    // Create history record
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

    console.log("Loggin history: ", incidentHistory);

    res.status(201).json({
      message: "Incident reported successfully",
      incident: newIncident,
      history: incidentHistory,
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
    const incidentId=req.params.id;

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
    const { status,resolutionSummary, comment } = req.body;
    const engineerId = req.user.id;
    const incidentId = req.params.id;

    const incident = await Incident.findById(incidentId);
    if (!incident) return res.status(404).json({ message: "Incident not found" });

    const oldValue = {
      status: incident.status,
      resolution: incident.resolution ? incident.resolution.summary : null
    };

    // Update incident based on action
    incident.status = status;
    if (status === "resolved") {
      incident.resolution = {
        resolvedBy: engineerId,
        resolvedAt: new Date(),
        summary: resolutionSummary || ""
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
        resolution: incident.resolution ? incident.resolution.summary : null
      },
      comment: comment || ""
    });

    res.json({
      message: `Incident ${status} successfully`,
      incident,
      history: incidentHistory
    });
  } catch (error) {
    console.error("Error performing engineer action:", error);
    res.status(500).json({ message: "Failed to update incident" });
  }
};

module.exports = { reportIncident ,assignIncident,engineerAction};
