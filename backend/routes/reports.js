const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reportsController");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

router.post("/generate", auth, adminAuth, reportsController.generateReport);
router.get("/download", auth, adminAuth, reportsController.downloadReport); // Add this line

module.exports = router;
