const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Class name is required"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },

    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
      required: [true, "Trainer is required"],
    },

    day: {
      type: String,
      required: [true, "Day is required"],
      enum: [
        "Saturday",
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
    },

    time: {
      type: String,
      required: [true, "Time is required"],
    },

    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },

    status: {
      type: String,
      enum: ["scheduled", "cancelled"],
      default: "scheduled",
    },

    bookedMemberIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    durationMins: {
      type: Number,
      required: [true, "Duration in minutes is required"],
      default: 60,
    },

    category: {
      type: String,
      trim: true,
      default: "General",
    },

    room: {
      type: String,
      trim: true,
      default: "Main Studio",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("GymClass", classSchema);