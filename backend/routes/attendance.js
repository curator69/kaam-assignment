const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

// Employee routes
router.post("/check-in", auth, attendanceController.checkIn);
router.post("/check-out", auth, attendanceController.checkOut);
router.get("/my-attendance", auth, attendanceController.getMyAttendance);
router.get("/stats", auth, attendanceController.getAttendanceStats);

// Admin routes
router.get("/all", auth, adminAuth, attendanceController.getAllAttendance);
router.get("/:id", auth, adminAuth, attendanceController.getAttendanceById); // Add this route
router.put("/:id", auth, adminAuth, attendanceController.updateAttendance);

module.exports = router;
