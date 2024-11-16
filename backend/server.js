const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/attendance", require("./routes/attendance"));
app.use("/api/users", require("./routes/users"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/reports", require("./routes/reports"));

// Error Handler
app.use(require("./middleware/errorHandler"));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
