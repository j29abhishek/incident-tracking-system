const mongoose = require("mongoose");

const incidentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["new", "in_progress", "on_hold", "resolved", "closed"],
      default: "new",
    },

    impact: {
      type: String,
      enum: ["low", "medium", "high"],
      // required: true,
    },

    urgency: {
      type: String,
      enum: ["low", "medium", "high"],
      // required: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "low",
    },

    escalationTriggered: {
      type: Boolean,
      default: false,
    },

    resolution: {
      resolvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      resolvedAt: {
        type: Date,
      },
      summary: {
        type: String,
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Incident", incidentSchema);
