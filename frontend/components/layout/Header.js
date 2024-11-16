import { BellIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <span className="text-lg font-semibold text-gray-900">
            Welcome, {user?.name}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 rounded-full hover:bg-gray-100">
            <BellIcon className="w-6 h-6 text-gray-600" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
