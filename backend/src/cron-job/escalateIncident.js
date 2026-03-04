const cron = require("node-cron");
const Incident = require("../models/Incident");
const IncidentHistory = require("../models/IncidentHistory");
const User = require("../models/User");

//Running every every hour
cron.schedule("0 * * * *", async () => {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

    const incidentsToEscalate = await Incident.find({
      status: { $nin: ["resolved", "closed"] },
      updatedAt: { $lte: oneHourAgo },
      escalationTriggered: { $ne: true },
    });

    for (const incident of incidentsToEscalate) {
      if (incident.priority === "critical") continue;

      const oldPriority = incident.priority;

      if (incident.priority === "medium") incident.priority = "high";
      else if (incident.priority === "high") incident.priority = "critical";

      incident.escalationTriggered = true;
      await incident.save();

      await IncidentHistory.create({
        incident: incident._id,
        actedBy: null,
        actionType: "PRIORITY_ESCALATED",
        oldValue: { priority: oldPriority },
        newValue: {
          priority: incident.priority,
          escalationTriggered: true,
        },
        comment:
          "Incident escalated automatically due to inactivity for 1 hour",
      });
    }

    console.log(`[Cron] Escalated ${incidentsToEscalate.length} incidents`);
  } catch (error) {
    console.error("Error running escalation cron job:", error);
  }
});
