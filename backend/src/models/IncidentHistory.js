const mongoose = require("mongoose");

const incidentHistorySchema = new mongoose.Schema(
  {
    incident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Incident",
      required: true,
      index: true,
    },

    actionType: {
      type: String,
      enum: [
        "CREATED",
        "ASSIGNED",
        "STATUS_CHANGED",
        "PRIORITY_ESCALATED",
        "RESOLVED",
        "CLOSED",
      ],
      required: true,
    },

    oldValue: { type: mongoose.Schema.Types.Mixed },
    newValue: { type: mongoose.Schema.Types.Mixed },

    comment: String,

    actedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    actedAt: {
      type: Date,
      default: Date.now,
      index: true, // critical for sorting
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model("IncidentHistory", incidentHistorySchema);
