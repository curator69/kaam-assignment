import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../../../context/AuthContext";
import Button from "../../../../components/common/Button";
import Input from "../../../../components/common/Input";
import { attendanceService } from "../../../../services/attendance";

export default function EditAttendance() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    date: "",
  });

  useEffect(() => {
    if (user?.role !== "admin") {
      router.push("/dashboard");
      return;
    }
    if (id) {
      fetchAttendanceRecord();
    }
  }, [id]);

  const fetchAttendanceRecord = async () => {
    try {
      const record = await attendanceService.getAttendanceById(id);
      setFormData({
        checkIn: formatDateTime(record.checkIn),
        checkOut: record.checkOut ? formatDateTime(record.checkOut) : "",
        date: formatDate(record.date),
      });
    } catch (error) {
      console.error("Error fetching attendance record:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await attendanceService.updateAttendance(id, {
        date: new Date(formData.date).toISOString(),
        checkIn: new Date(formData.checkIn).toISOString(),
        checkOut: formData.checkOut
          ? new Date(formData.checkOut).toISOString()
          : null,
      });
      alert("Attendance record updated successfully");
      router.push("/attendance/manage");
    } catch (error) {
      alert("Failed to update attendance record");
      console.error("Error updating attendance:", error);
    }
  };

  const formatDateTime = (date) => {
    return new Date(date).toISOString().slice(0, 16);
  };

  const formatDate = (date) => {
    return new Date(date).toISOString().slice(0, 10);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Edit Attendance Record
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Update check-in and check-out times
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input label="Date" type="date" value={formData.date} disabled />
            <Input
              label="Check In Time"
              type="datetime-local"
              required
              value={formData.checkIn}
              onChange={(e) =>
                setFormData({ ...formData, checkIn: e.target.value })
              }
            />
            <Input
              label="Check Out Time"
              type="datetime-local"
              value={formData.checkOut}
              onChange={(e) =>
                setFormData({ ...formData, checkOut: e.target.value })
              }
            />
          </div>
          <div className="flex justify-end space-x-4">
            <Button
              variant="secondary"
              onClick={() => router.push("/attendance/manage")}
            >
              Cancel
            </Button>
            <Button type="submit">Update Record</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
