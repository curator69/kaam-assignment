import { useState, useEffect } from "react";
import Button from "../../components/common/Button";
import Table from "../../components/common/Table";
import { attendanceService } from "../../services/attendance";
import {
  formatDate,
  formatTime,
  calculateWorkHours,
} from "../../utils/helpers";

export default function Attendance() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendanceHistory();
  }, []);

  const fetchAttendanceHistory = async () => {
    try {
      const data = await attendanceService.getMyAttendance();
      setAttendanceHistory(data);

      const todayAttendance = data.find(
        (record) =>
          new Date(record.date).toDateString() === new Date().toDateString()
      );
      setIsCheckedIn(todayAttendance?.checkIn && !todayAttendance?.checkOut);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      const todayAttendance = attendanceHistory.find(
        (record) =>
          new Date(record.date).toDateString() === new Date().toDateString()
      );

      if (todayAttendance?.checkIn) {
        alert("You have already checked in today");
        return;
      }

      await attendanceService.checkIn();
      setIsCheckedIn(true);
      fetchAttendanceHistory();
    } catch (error) {
      alert(error.response?.data?.message || "Check-in failed");
      console.error("Check-in failed:", error);
    }
  };

  const handleCheckOut = async () => {
    try {
      await attendanceService.checkOut();
      setIsCheckedIn(false);
      fetchAttendanceHistory();
    } catch (error) {
      console.error("Check-out failed:", error);
    }
  };

  const tableHeaders = [
    { key: "date", label: "Date", render: (row) => formatDate(row.date) },
    {
      key: "checkIn",
      label: "Check In",
      render: (row) => formatTime(row.checkIn),
    },
    {
      key: "checkOut",
      label: "Check Out",
      render: (row) => (row.checkOut ? formatTime(row.checkOut) : "-"),
    },
    {
      key: "workHours",
      label: "Work Hours",
      render: (row) =>
        row.checkOut
          ? `${calculateWorkHours(row.checkIn, row.checkOut)}h`
          : "-",
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.status === "Present"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your daily attendance
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              Today's Status
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {isCheckedIn
                ? "You are currently checked in"
                : "You haven't checked in yet"}
            </p>
          </div>
          <Button
            variant={isCheckedIn ? "danger" : "success"}
            onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
          >
            {isCheckedIn ? "Check Out" : "Check In"}
          </Button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Attendance History
          </h2>
        </div>
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : (
          <Table headers={tableHeaders} data={attendanceHistory} />
        )}
      </div>
    </div>
  );
}
