import { TrendingUp, TrendingDown, Users, FileText, Activity, Clock } from 'lucide-react';

export default function AnalyticsPage() {
  const metrics = [
    {
      title: 'New Users (This Month)',
      value: '342',
      change: '+12.5%',
      isPositive: true,
      icon: Users,
    },
    {
      title: 'Documents Uploaded',
      value: '1,284',
      change: '+8.2%',
      isPositive: true,
      icon: FileText,
    },
    {
      title: 'Avg. Session Duration',
      value: '14m 32s',
      change: '-2.3%',
      isPositive: false,
      icon: Clock,
    },
    {
      title: 'Peak Activity Time',
      value: '2:30 PM',
      change: 'UTC',
      isPositive: true,
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">Platform usage and performance metrics.</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all animate-fade-up"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600">{metric.title}</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-2">{metric.value}</h3>
                </div>
                <div className="p-3 bg-[#296374] bg-opacity-10 rounded-lg">
                  <Icon className="w-6 h-6 text-[#296374]" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                {metric.isPositive ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span
                  className={`text-sm font-semibold ${
                    metric.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {metric.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Active Users */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Daily Active Users</h2>
          <div className="h-64 bg-gradient-to-b from-[#296374] to-[#296374] bg-opacity-5 rounded-lg flex items-center justify-center text-gray-500">
            <p>Chart visualization - Connect analytics service</p>
          </div>
        </div>

        {/* Document Upload Trends */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Document Upload Trends</h2>
          <div className="h-64 bg-gradient-to-b from-[#296374] to-[#296374] bg-opacity-5 rounded-lg flex items-center justify-center text-gray-500">
            <p>Chart visualization - Connect analytics service</p>
          </div>
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Top Regions</h2>
        <div className="space-y-4">
          {[
            { region: 'United States', users: 1234, percentage: 42.5 },
            { region: 'Europe', users: 856, percentage: 29.3 },
            { region: 'Asia Pacific', users: 512, percentage: 17.6 },
            { region: 'Other', users: 198, percentage: 10.6 },
          ].map((item, idx) => (
            <div key={idx} className="flex items-end gap-4">
              <div className="w-32">
                <p className="text-sm font-medium text-gray-900">{item.region}</p>
                <p className="text-xs text-gray-600 mt-1">{item.users} users</p>
              </div>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="admin-bg h-2 rounded-full transition-all"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
