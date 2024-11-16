const Attendance = require("../models/Attendance");
const PDFDocument = require("pdfkit");

exports.generateReport = async (req, res) => {
  try {
    const { startDate, endDate, employeeId } = req.body;

    let query = {};

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (employeeId) {
      query.user = employeeId;
    }

    const records = await Attendance.find(query)
      .populate("user", "name email department")
      .sort({ date: 1 });

    const report = {
      dateRange: { startDate, endDate },
      totalRecords: records.length,
      records: records,
    };

    res.json(report);
  } catch (error) {
    console.error("Report generation error:", error);
    res.status(500).json({
      message: "Error generating report",
      error: error.message,
    });
  }
};

exports.downloadReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Ensure valid date objects
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate dates
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid date range provided" });
    }

    const records = await Attendance.find({
      date: {
        $gte: start,
        $lte: end,
      },
    }).populate("user", "name email department");

    if (req.query.format === "pdf") {
      const doc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=attendance-report.pdf"
      );

      doc.pipe(res);
      doc.fontSize(20).text("Attendance Report", { align: "center" });
      doc.moveDown();

      records.forEach((record) => {
        doc
          .fontSize(12)
          .text(`Employee: ${record.user.name}`)
          .text(`Date: ${record.date.toLocaleDateString()}`)
          .text(`Check In: ${record.checkIn.toLocaleTimeString()}`)
          .text(
            `Check Out: ${
              record.checkOut
                ? record.checkOut.toLocaleTimeString()
                : "Not checked out"
            }`
          )
          .moveDown();
      });

      doc.end();
    } else {
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=attendance-report.csv"
      );

      const csvRows = ["Date,Employee,Department,Check In,Check Out"];
      records.forEach((record) => {
        csvRows.push(
          `${record.date.toLocaleDateString()},${record.user.name},${
            record.user.department
          },${record.checkIn.toLocaleTimeString()},${
            record.checkOut ? record.checkOut.toLocaleTimeString() : ""
          }`
        );
      });

      res.send(csvRows.join("\n"));
    }
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ message: "Error generating report" });
  }
};
