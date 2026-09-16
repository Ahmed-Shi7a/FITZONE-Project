const GymClass = require("../models/class-model");

const getClasses = async (req, res) => {
  try {
    const classes = await GymClass.find().populate(
      "trainer",
      "name specialty imageUrl"
    );

    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getClassById = async (req, res) => {
  try {
    const gymClass = await GymClass.findById(req.params.id).populate(
      "trainer",
      "name specialty imageUrl"
    );

    if (!gymClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    res.status(200).json({
      success: true,
      data: gymClass,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const createClass = async (req, res) => {
  try {
    const gymClass = await GymClass.create(req.body);

    const populatedClass = await GymClass.findById(gymClass._id).populate(
      "trainer",
      "name specialty imageUrl"
    );

    res.status(201).json({
      success: true,
      message: "Class created successfully",
      data: populatedClass,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateClass = async (req, res) => {
  try {
    const gymClass = await GymClass.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate("trainer", "name specialty imageUrl");

    if (!gymClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Class updated successfully",
      data: gymClass,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteClass = async (req, res) => {
  try {
    const gymClass = await GymClass.findByIdAndDelete(req.params.id);

    if (!gymClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Class deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const bookClass = async (req, res) => {
  try {
    const gymClass = await GymClass.findById(req.params.id);

    if (!gymClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    if (gymClass.bookedMemberIds.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: "You have already booked this class",
      });
    }

    if (gymClass.bookedMemberIds.length >= gymClass.capacity) {
      return res.status(400).json({
        success: false,
        message: "This class is fully booked",
      });
    }

    gymClass.bookedMemberIds.push(req.user._id);
    await gymClass.save();

    res.status(200).json({
      success: true,
      message: "Class booked successfully",
      data: gymClass,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const cancelClassBooking = async (req, res) => {
  try {
    const gymClass = await GymClass.findById(req.params.id);

    if (!gymClass) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    if (!gymClass.bookedMemberIds.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: "You have not booked this class",
      });
    }

    gymClass.bookedMemberIds = gymClass.bookedMemberIds.filter(
      (id) => id.toString() !== req.user._id.toString()
    );
    await gymClass.save();

    res.status(200).json({
      success: true,
      message: "Class booking cancelled successfully",
      data: gymClass,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  bookClass,
  cancelClassBooking,
};