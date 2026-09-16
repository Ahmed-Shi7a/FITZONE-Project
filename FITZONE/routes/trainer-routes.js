const express = require("express");

const {
  getTrainers,
  getTrainerById,
  createTrainer,
  updateTrainer,
  deleteTrainer,
} = require("../controllers/trainer-controller");

const { protect } = require("../middlewares/auth-middleware");
const adminOnly = require("../middlewares/admin-middleware");

const router = express.Router();

// Public viewing
router.get("/", getTrainers);
router.get("/:id", getTrainerById);

// Admin management
router.post("/", protect, adminOnly, createTrainer);
router.patch("/:id", protect, adminOnly, updateTrainer);
router.delete("/:id", protect, adminOnly, deleteTrainer);

module.exports = router;