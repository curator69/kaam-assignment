const User = require("../models/User");
const bcrypt = require("bcryptjs");

const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.json(users);
    } catch (error) {
      console.error("Error in getAllUsers:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error in getUserById:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { name, email, department, password } = req.body;
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (name) user.name = name;
      if (email) user.email = email;
      if (department) user.department = department;

      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }

      await user.save();
      res.json({ message: "User updated successfully" });
    } catch (error) {
      console.error("Error in updateUser:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      console.log("Attempting to delete user:", req.params.id);
      const user = await User.findById(req.params.id);

      if (!user) {
        console.log("User not found for deletion");
        return res.status(404).json({ message: "User not found" });
      }

      await User.findByIdAndDelete(req.params.id);
      console.log("User deleted successfully");
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error in deleteUser:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  getUserStats: async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const employeeCount = await User.countDocuments({ role: "employee" });
      const adminCount = await User.countDocuments({ role: "admin" });

      res.json({
        total: totalUsers,
        employeeCount,
        adminCount,
      });
    } catch (error) {
      console.error("Error in getUserStats:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

module.exports = userController;
