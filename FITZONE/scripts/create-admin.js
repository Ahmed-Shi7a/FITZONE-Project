require("dotenv").config({ override: true });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/user-model");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME,
    });

    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      10
    );

    await User.findOneAndUpdate(
      { email: process.env.ADMIN_EMAIL },
      {
        name: process.env.ADMIN_NAME,
        email: process.env.ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin",
        phone: process.env.ADMIN_PHONE,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
    );

    console.log("Admin created successfully");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

createAdmin();