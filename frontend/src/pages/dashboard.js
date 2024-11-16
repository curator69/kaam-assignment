import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  UserGroupIcon,
  ClockIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import StatsCard from "../../components/dashboard/StatsCard";
import ActivityFeed from "../../components/dashboard/ActivityFeed";
import { employeeService } from "../../services/employees";
import { attendanceService } from "../../services/attendance";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    onLeave: 0,
    totalWorkHours: 0,
  });
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (user?.role === "admin") {
      fetchAdminDashboardData();
    } else {
      fetchEmployeeDashboardData();
    }
  }, [user]);

  const fetchAdminDashboardData = async () => {
    try {
      const [attendanceStats, employees, allAttendance] = await Promise.all([
        attendanceService.getAttendanceStats(),
        employeeService.getAllEmployees(),
        attendanceService.getAllAttendance({ date: new Date() }),
      ]);

      const totalHoursToday = allAttendance.attendance.reduce(
        (total, record) => {
          if (record.checkIn && record.checkOut) {
            const hours =
              (new Date(record.checkOut) - new Date(record.checkIn)) /
              (1000 * 60 * 60);
            return total + hours;
          }
          return total;
        },
        0
      );

      setStats({
        totalEmployees: employees.length,
        presentToday: attendanceStats.present,
        onLeave: attendanceStats.onLeave,
        totalWorkHours: totalHoursToday.toFixed(1),
      });

      setActivities(allAttendance.attendance);
    } catch (error) {
      console.error("Error fetching admin dashboard data:", error);
    }
  };

  const fetchEmployeeDashboardData = async () => {
    try {
      const [myAttendance, attendanceStats] = await Promise.all([
        attendanceService.getMyAttendance({ date: new Date() }),
        attendanceService.getAttendanceStats(),
      ]);

      const todayAttendance = myAttendance.find(
        (record) =>
          new Date(record.date).toDateString() === new Date().toDateString()
      );

      let todayHours = 0;
      if (todayAttendance?.checkIn && todayAttendance?.checkOut) {
        todayHours =
          (new Date(todayAttendance.checkOut) -
            new Date(todayAttendance.checkIn)) /
          (1000 * 60 * 60);
      }

      setStats({
        presentToday: attendanceStats.present,
        onLeave: attendanceStats.onLeave,
        totalWorkHours: todayHours.toFixed(1),
      });

      setActivities(myAttendance);
    } catch (error) {
      console.error("Error fetching employee dashboard data:", error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          {user?.role === "admin" ? "Admin Dashboard" : "My Dashboard"}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {user?.role === "admin"
            ? "Overview of organization's attendance"
            : "Overview of your attendance"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        {user?.role === "admin" && (
          <StatsCard
            title="Total Employees"
            value={stats.totalEmployees}
            icon={UserGroupIcon}
          />
        )}
        <StatsCard
          title={user?.role === "admin" ? "Present Today" : "My Attendance"}
          value={stats.presentToday}
          icon={ClockIcon}
        />
        <StatsCard title="On Leave" value={stats.onLeave} icon={CalendarIcon} />
        <StatsCard
          title="Total Work Hours"
          value={`${stats.totalWorkHours}h`}
          icon={ClockIcon}
        />
      </div>

      <ActivityFeed
        activities={activities}
        title={
          user?.role === "admin" ? "Recent Activities" : "My Recent Activities"
        }
      />
    </div>
  );
}
