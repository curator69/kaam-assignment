import { formatDate, formatTime } from "../../utils/helpers";

export default function ActivityFeed({ activities, title }) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {activities.map((activity, index) => (
          <div key={index} className="px-6 py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  {activity.user?.name?.charAt(0) || "U"}
                </div>
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.user?.name}
                    {activity.user?.department && (
                      <span className="text-gray-500 text-xs ml-2">
                        • {activity.user.department}
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(activity.date)}
                  </p>
                </div>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activity.type === "check-in"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {activity.type === "check-in"
                      ? "Checked In"
                      : "Checked Out"}
                  </span>
                  <span className="text-gray-500 text-xs ml-2">
                    {formatTime(
                      activity.type === "check-in"
                        ? activity.checkIn
                        : activity.checkOut
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
