export function AnalyticsChart() {
  const data = [
    { label: 'Mon', users: 2400, documents: 1200 },
    { label: 'Tue', users: 2210, documents: 1290 },
    { label: 'Wed', users: 2290, documents: 1000 },
    { label: 'Thu', users: 2000, documents: 1908 },
    { label: 'Fri', users: 2181, documents: 1490 },
    { label: 'Sat', users: 2500, documents: 1300 },
    { label: 'Sun', users: 2100, documents: 1490 },
  ];

  const maxValue = 2500;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 animate-fade-up delay-100">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Weekly Activity</h2>
        <p className="text-sm text-gray-600 mt-1">Users and document uploads</p>
      </div>

      {/* Simple Chart */}
      <div className="h-64 flex items-end justify-between gap-2">
        {data.map((item, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-2">
            {/* Bars */}
            <div className="w-full flex gap-1 items-end h-48">
              {/* Users Bar */}
              <div
                className="flex-1 bg-[#296374] rounded-t opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                style={{ height: `${(item.users / maxValue) * 100}%` }}
                title={`${item.label}: ${item.users} users`}
              />
              {/* Documents Bar */}
              <div
                className="flex-1 bg-[#4fb3d9] rounded-t hover:opacity-100 transition-opacity cursor-pointer"
                style={{ height: `${(item.documents / maxValue) * 100}%` }}
                title={`${item.label}: ${item.documents} docs`}
              />
            </div>
            {/* Label */}
            <span className="text-xs text-gray-600 font-medium">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center gap-6 border-t border-gray-100 pt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[#296374]" />
          <span className="text-sm text-gray-600">Users</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[#4fb3d9]" />
          <span className="text-sm text-gray-600">Documents</span>
        </div>
      </div>
    </div>
  );
}
