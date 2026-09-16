require("dotenv").config();

const cors = require("cors");
const express = require("express");

const connectDB = require("./config/db-connect");

const userRoutes = require("./routes/user-routes");
const membershipRoutes = require("./routes/membership-routes");
const trainerRoutes = require("./routes/trainer-routes");
const classRoutes = require("./routes/class-routes");
const dashboardRoutes = require("./routes/dashboard-routes");

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:4200" }));
app.use(express.json());

// Database
connectDB();

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/memberships", membershipRoutes);
app.use("/api/v1/trainers", trainerRoutes);
app.use("/api/v1/classes", classRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// Home
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "FITZONE Backend is Running",
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`FITZONE Backend running on port ${PORT}`);
});