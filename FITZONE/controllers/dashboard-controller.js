const User = require("../models/user-model");
const Membership = require("../models/membership-model");
const Trainer = require("../models/trainer-model");
const GymClass = require("../models/class-model");

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      activeMembers,
      totalTrainers,
      activeTrainers,
      totalMemberships,
      activeMemberships,
      totalClasses,
      scheduledClasses,
      allPlans,
      usersWithMemberships
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({
        role: "member",
        isActive: true,
      }),
      Trainer.countDocuments(),
      Trainer.countDocuments({
        status: "active",
      }),
      Membership.countDocuments(),
      Membership.countDocuments({
        status: "active",
      }),
      GymClass.countDocuments(),
      GymClass.countDocuments({
        status: "scheduled",
      }),
      Membership.find(),
      User.find({ role: "member", membership: { $ne: null } }).populate("membership"),
    ]);

    let monthlyRevenue = 0;
    const planCounts = {};
    
    usersWithMemberships.forEach(u => {
      if (u.membership) {
        monthlyRevenue += u.membership.price || 0;
        const pId = u.membership._id.toString();
        planCounts[pId] = (planCounts[pId] || 0) + 1;
      }
    });

    const planDistribution = allPlans.map(p => ({
      id: p._id,
      name: p.name,
      activeMembers: planCounts[p._id.toString()] || 0
    }));

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          activeMembers,
        },

        trainers: {
          total: totalTrainers,
          active: activeTrainers,
        },

        memberships: {
          total: totalMemberships,
          active: activeMemberships,
        },

        classes: {
          total: totalClasses,
          scheduled: scheduledClasses,
        },
        
        revenue: monthlyRevenue,
        planDistribution
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};