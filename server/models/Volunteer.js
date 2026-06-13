const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    skills: {
      type: [String],
      required: true,
    },
    areaOfInterest: {
      type: String,
      required: true,
      enum: [
        "Education",
        "Environment",
        "Healthcare",
        "Animal Welfare",
        "Elderly Care",
        "Women Empowerment",
        "Child Welfare",
        "Disaster Relief",
      ],
    },
    availability: {
      type: String,
      required: true,
      enum: ["Weekdays", "Weekends", "Both", "Flexible"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Volunteer", volunteerSchema);
