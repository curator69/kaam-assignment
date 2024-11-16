export default function StatsCard({ title, value, icon: Icon, trend }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
          {trend && (
            <p
              className={`mt-2 text-sm ${
                trend > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-indigo-50 rounded-full">
            <Icon className="w-6 h-6 text-indigo-600" />
          </div>
        )}
      </div>
    </div>
  );
}
