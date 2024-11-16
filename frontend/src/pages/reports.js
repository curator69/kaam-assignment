import { useState } from "react";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { reportService } from "../../services/reports";
import { formatDate } from "../../utils/helpers";

export default function Reports() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [reports, setReports] = useState([
    {
      id: 1,
      name: "Monthly Attendance Report",
      generatedDate: "2024-02-14",
      type: "Attendance",
      status: "Ready",
    },
    {
      id: 2,
      name: "Department Performance Report",
      generatedDate: "2024-02-13",
      type: "Performance",
      status: "Ready",
    },
  ]);

  const generateReport = async () => {
    try {
      const response = await reportService.generateReport({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        department: selectedDepartment,
      });
      setReports([response, ...reports]);
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  const downloadReport = async (format = "pdf") => {
    // Set default format
    try {
      const response = await reportService.downloadReport(dateRange, format);
      const contentType = format === "pdf" ? "application/pdf" : "text/csv";
      const blob = new Blob([response], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `attendance-report-${
        new Date().toISOString().split("T")[0]
      }.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="mt-1 text-sm text-gray-600">
          Generate and download reports
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Generate New Report
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Input
            type="date"
            label="Start Date"
            value={dateRange.startDate}
            onChange={(e) =>
              setDateRange({ ...dateRange, startDate: e.target.value })
            }
          />
          <Input
            type="date"
            label="End Date"
            value={dateRange.endDate}
            onChange={(e) =>
              setDateRange({ ...dateRange, endDate: e.target.value })
            }
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={generateReport}>Generate Report</Button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Available Reports
          </h2>
        </div>
        <ul className="divide-y divide-gray-200">
          {reports.map((report, index) => (
            <li key={index} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {report.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Generated on {formatDate(new Date().toISOString())}
                  </p>
                </div>
                <div className="flex space-x-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => downloadReport(report.id, "pdf")}
                  >
                    Download PDF
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => downloadReport(report.id, "csv")}
                  >
                    Download CSV
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
