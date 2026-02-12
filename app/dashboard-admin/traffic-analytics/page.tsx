import { BarChart3, Globe, Smartphone } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { PageHeader } from '../components/PageHeader';

export default function TrafficAnalytics() {
  const countries = [
    { name: 'Indonesia', users: 4532, percentage: 35 },
    { name: 'Philippines', users: 2341, percentage: 18 },
    { name: 'Malaysia', users: 1892, percentage: 15 },
    { name: 'Thailand', users: 1654, percentage: 13 },
    { name: 'Vietnam', users: 1203, percentage: 9 },
    { name: 'Others', users: 1378, percentage: 10 },
  ];

  return (
    <AdminLayout>
      <PageHeader title="Traffic Analytics" description="Access patterns and device usage insights" icon={<BarChart3 size={28} />} />

      <div className="p-8 space-y-6">
        {/* Device Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Device Distribution</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-end justify-around h-40">
              <div className="text-center">
                <div className="h-32 bg-blue-200 rounded-t-lg" />
                <p className="mt-2 text-sm font-medium text-gray-700">Desktop</p>
                <p className="text-lg font-bold text-gray-900">62%</p>
              </div>
              <div className="text-center">
                <div className="h-24 bg-green-200 rounded-t-lg" />
                <p className="mt-2 text-sm font-medium text-gray-700">Mobile</p>
                <p className="text-lg font-bold text-gray-900">38%</p>
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="flex items-center gap-4">
                <Smartphone size={20} className="text-blue-600" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Desktop</span>
                    <span className="text-sm font-bold text-gray-900">62%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '62%' }} />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Smartphone size={20} className="text-green-600" />
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Mobile</span>
                    <span className="text-sm font-bold text-gray-900">38%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '38%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Countries */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Globe size={20} /> Top Countries
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Country</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Users</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {countries.map((country, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900 font-medium">{country.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-700 text-right">{country.users.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${country.percentage}%` }}
                          />
                        </div>
                        <span className="font-semibold text-gray-900">{country.percentage}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
