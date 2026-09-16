const Membership = require("../models/membership-model");

const getMemberships = async (req, res) => {
  try {
    const memberships = await Membership.find();

    res.status(200).json({
      success: true,
      count: memberships.length,
      data: memberships,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMembershipById = async (req, res) => {
  try {
    const membership = await Membership.findById(req.params.id);

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Membership not found",
      });
    }

    res.status(200).json({
      success: true,
      data: membership,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const createMembership = async (req, res) => {
  try {
    const membership = await Membership.create(req.body);

    res.status(201).json({
      success: true,
      message: "Membership created successfully",
      data: membership,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const updateMembership = async (req, res) => {
  try {
    const membership = await Membership.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Membership not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Membership updated successfully",
      data: membership,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteMembership = async (req, res) => {
  try {
    const membership = await Membership.findByIdAndDelete(req.params.id);

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "Membership not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Membership deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getMemberships,
  getMembershipById,
  createMembership,
  updateMembership,
  deleteMembership,
};