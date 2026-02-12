import { Users, FileText, Activity, TrendingUp } from 'lucide-react';
import { StatCard } from '@/app/components/molecules/admin/StatCard';
import { AnalyticsChart } from '@/app/components/molecules/admin/AnalyticsChart';
import { ServerStatus } from '@/app/components/molecules/admin/ServerStatus';

export default function DashboardPage() {
  const stats = [
    {
      label: 'Total Users',
      value: '2,847',
      icon: Users,
      trend: '+12.5%',
      previous: 'vs last month',
    },
    {
      label: 'Total Documents',
      value: '12,543',
      icon: FileText,
      trend: '+8.2%',
      previous: 'vs last month',
    },
    {
      label: 'Active Sessions',
      value: '384',
      icon: Activity,
      trend: '+5.3%',
      previous: 'vs last month',
    },
    {
      label: 'Growth Rate',
      value: '23.8%',
      icon: TrendingUp,
      trend: '+3.1%',
      previous: 'vs last month',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your platform overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatCard
            key={idx}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            previous={stat.previous}
            delay={idx}
          />
        ))}
      </div>

      {/* Charts and Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnalyticsChart />
        </div>
        <ServerStatus />
      </div>
    </div>
  );
}
