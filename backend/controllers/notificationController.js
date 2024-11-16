const Notification = require("../models/Notification");
const User = require("../models/User");
const Attendance = require("../models/Attendance");

const notificationController = {
  // Create notification
  createNotification: async (userId, type, message) => {
    try {
      const notification = new Notification({
        userId,
        type,
        message,
      });
      await notification.save();
      return notification;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  },

  // Get user notifications
  getUserNotifications: async (req, res) => {
    try {
      const notifications = await Notification.find({
        userId: req.user._id,
      }).sort({ createdAt: -1 });

      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Mark notification as read
  markAsRead: async (req, res) => {
    try {
      const notification = await Notification.findById(req.params.id);

      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }

      notification.read = true;
      await notification.save();

      res.json(notification);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Check for missing checkouts and send notifications
  checkMissingCheckouts: async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const attendances = await Attendance.find({
        date: today,
        checkOut: null,
      }).populate("userId");

      for (const attendance of attendances) {
        await notificationController.createNotification(
          attendance.userId._id,
          "checkout_reminder",
          "Don't forget to check out for today!"
        );
      }
    } catch (error) {
      console.error("Error checking missing checkouts:", error);
    }
  },

  // Send daily attendance reminder
  sendDailyReminder: async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const employees = await User.find({ role: "employee" });

      for (const employee of employees) {
        const attendance = await Attendance.findOne({
          userId: employee._id,
          date: today,
        });

        if (!attendance) {
          await notificationController.createNotification(
            employee._id,
            "attendance_missing",
            "Please mark your attendance for today"
          );
        }
      }
    } catch (error) {
      console.error("Error sending daily reminders:", error);
    }
  },
};

module.exports = notificationController;
