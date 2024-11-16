import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";
import {
  HomeIcon,
  UserGroupIcon,
  ClockIcon,
  ChartBarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  const router = useRouter();
  const { user } = useAuth();

  const adminMenuItems = [
    { name: "Dashboard", icon: HomeIcon, href: "/dashboard" },
    { name: "Attendance", icon: ClockIcon, href: "/attendance" },
    { name: "Manage Attendance", icon: ClockIcon, href: "/attendance/manage" },
    { name: "Employees", icon: UserGroupIcon, href: "/employees" },
    { name: "Reports", icon: ChartBarIcon, href: "/reports" },
    { name: "Profile", icon: UserCircleIcon, href: "/profile" },
  ];

  const employeeMenuItems = [
    { name: "Dashboard", icon: HomeIcon, href: "/dashboard" },
    { name: "My Attendance", icon: ClockIcon, href: "/attendance" },
    { name: "Profile", icon: UserCircleIcon, href: "/profile" },
  ];

  const menuItems = user?.role === "admin" ? adminMenuItems : employeeMenuItems;

  return (
    <div className="h-full bg-white shadow-lg w-64">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 bg-indigo-600">
          <h1 className="text-xl font-bold text-white">Attendance System</h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                router.pathname === item.href
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
