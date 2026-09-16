const express = require("express");

const {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  bookClass,
  cancelClassBooking,
} = require("../controllers/class-controller");

const { protect } = require("../middlewares/auth-middleware");
const adminOnly = require("../middlewares/admin-middleware");

const router = express.Router();

// Public viewing
router.get("/", getClasses);
router.get("/:id", getClassById);

// Admin management
router.post("/", protect, adminOnly, createClass);
router.patch("/:id", protect, adminOnly, updateClass);
router.delete("/:id", protect, adminOnly, deleteClass);

// Member actions
router.post("/:id/book", protect, bookClass);
router.post("/:id/cancel", protect, cancelClassBooking);

module.exports = router;