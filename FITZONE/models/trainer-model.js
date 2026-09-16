const mongoose = require("mongoose");

const trainerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Trainer name is required"],
      trim: true,
    },

    specialty: {
      type: String,
      required: [true, "Specialty is required"],
      trim: true,
    },

    experience: {
      type: Number,
      required: [true, "Experience is required"],
      min: [0, "Experience cannot be negative"],
    },

    bio: {
      type: String,
      trim: true,
      maxlength: [1000, "Bio cannot exceed 1000 characters"],
    },

    imageUrl: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    experienceYears: {
      type: Number,
      default: 0,
      min: [0, "Experience years cannot be negative"],
    },

    rating: {
      type: Number,
      default: 5.0,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot exceed 5"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Trainer", trainerSchema);