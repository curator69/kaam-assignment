import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../../context/AuthContext";
import Button from "../../../components/common/Button";
import Table from "../../../components/common/Table";
import { attendanceService } from "../../../services/attendance";
import { formatDate, formatTime } from "../../../utils/helpers";

export default function ManageAttendance() {
  const router = useRouter();
  const { user } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === "admin") {
      fetchAllAttendance();
    } else {
      router.push("/dashboard");
    }
  }, [user]);

  const fetchAllAttendance = async () => {
    try {
      const data = await attendanceService.getAllAttendance();
      setAttendanceRecords(data.attendance); // Access the attendance array
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchAllAttendance, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleEdit = (id) => {
    router.push(`/attendance/edit/${id}`);
  };

  const tableHeaders = [
    {
      key: "employee",
      label: "Employee",
      render: (row) => (
        <div>
          <div className="font-medium">{row.user?.name}</div>
          <div className="text-sm text-gray-500">{row.user?.department}</div>
        </div>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (row) => formatDate(row.date),
    },
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
      key: "actions",
      label: "Actions",
      render: (row) => (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleEdit(row._id)}
        >
          Edit Times
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manage Attendance</h1>
        <p className="mt-1 text-sm text-gray-600">
          Update employee attendance records
        </p>
      </div>

      <div className="bg-white shadow rounded-lg">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : (
          <Table headers={tableHeaders} data={attendanceRecords} />
        )}
      </div>
    </div>
  );
}
