const Attendance = require("../models/Attendance");

exports.getAllAttendance = async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate } = req.query;

    let query = {};

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const attendance = await Attendance.find(query)
      .populate("user", "name email")
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Attendance.countDocuments(query);

    res.json({
      attendance,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.log("Error in getAllAttendance:", error);
    res.status(500).json({
      message: "Error fetching attendance records",
      error: error.message,
    });
  }
};

exports.getMyAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ user: req.user._id })
      .sort({ date: -1 })
      .populate("user", "name email");
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAttendanceById = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (attendance) {
      res.json(attendance);
    } else {
      res.status(404).json({ message: "Attendance not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) {
      return res.status(404).json({ message: "Attendance not found" });
    }

    // Update all fields with new values
    const updates = {
      date: new Date(req.body.date),
      checkIn: new Date(req.body.checkIn),
      checkOut: req.body.checkOut ? new Date(req.body.checkOut) : null,
      status: req.body.status || attendance.status,
    };

    const updatedAttendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).populate("user", "name email");

    res.json(updatedAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAttendanceStats = async (req, res) => {
  try {
    const stats = await Attendance.aggregate([
      {
        $facet: {
          present: [
            { $match: { date: new Date().toISOString().split("T")[0] } },
            { $count: "count" },
          ],
          onLeave: [
            {
              $match: {
                date: new Date().toISOString().split("T")[0],
                status: "Leave",
              },
            },
            { $count: "count" },
          ],
          totalHours: [
            {
              $match: {
                date: new Date().toISOString().split("T")[0],
                checkOut: { $exists: true },
              },
            },
            {
              $group: {
                _id: null,
                total: {
                  $sum: {
                    $divide: [
                      { $subtract: ["$checkOut", "$checkIn"] },
                      3600000,
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    ]);

    res.json({
      present: stats[0].present[0]?.count || 0,
      onLeave: stats[0].onLeave[0]?.count || 0,
      totalHours: Math.round(stats[0].totalHours[0]?.total || 0),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.checkIn = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await Attendance.findOne({
      user: req.user._id,
      date: today,
    });

    if (existingAttendance) {
      return res.status(400).json({ message: "Already checked in today" });
    }

    const attendance = new Attendance({
      user: req.user._id,
      date: today,
      checkIn: new Date(),
      status: "Present",
    });

    const newAttendance = await attendance.save();
    res.status(201).json(newAttendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      user: req.user._id,
      date: today,
    });

    if (!attendance) {
      return res.status(404).json({ message: "No check-in found for today" });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ message: "Already checked out today" });
    }

    attendance.checkOut = new Date();
    const updatedAttendance = await attendance.save();
    res.json(updatedAttendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
