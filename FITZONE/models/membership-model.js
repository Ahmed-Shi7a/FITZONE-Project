const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Membership name is required"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    duration: {
      type: String,
      required: [true, "Duration is required"],
      trim: true,
    },

    features: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Membership", membershipSchema);