const express = require("express");

const {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  getMe,
  updateMe,
  createUser,
  updateUser,
  deleteUser,
  getMyClasses,
} = require("../controllers/user-controller");

const { protect } = require("../middlewares/auth-middleware");

const adminOnly = require("../middlewares/admin-middleware");

const router = express.Router();

// Public
router.post("/register", registerUser);

router.post("/login", loginUser);

// Logged-in user
router.get("/me", protect, getMe);

router.get("/my-classes", protect, getMyClasses);

router.patch("/me", protect, updateMe);

// Admin only
router.get("/", protect, adminOnly, getUsers);

router.get("/:id", protect, adminOnly, getUserById);

router.post("/", protect, adminOnly, createUser);

router.patch("/:id", protect, adminOnly, updateUser);

router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;