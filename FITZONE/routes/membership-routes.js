const express = require("express");

const {
  getMemberships,
  getMembershipById,
  createMembership,
  updateMembership,
  deleteMembership,
} = require("../controllers/membership-controller");

const { protect } = require("../middlewares/auth-middleware");
const adminOnly = require("../middlewares/admin-middleware");

const router = express.Router();

// Members and visitors can view memberships
router.get("/", getMemberships);

router.get("/:id", getMembershipById);

// Admin management
router.post("/", protect, adminOnly, createMembership);

router.patch("/:id", protect, adminOnly, updateMembership);

router.delete("/:id", protect, adminOnly, deleteMembership);

module.exports = router;