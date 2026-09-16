const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },

    phone: {
      type: String,
      trim: true,
    },

    membership: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    avatarInitials: {
      type: String,
      trim: true,
    },

    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trainer",
      default: null,
    },

    joinDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model("User", userSchema);