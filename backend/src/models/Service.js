const mongoose = require("mongoose");
const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    currentStatus: {
      type: String,
      enum: ["Healthy", "Degraded", "Down"],
      default: "Healthy",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Service", serviceSchema);
