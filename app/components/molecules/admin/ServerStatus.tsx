import { CircleDot } from 'lucide-react';

const statusItems = [
  { name: 'API Server', status: 'healthy', uptime: '99.99%' },
  { name: 'Database', status: 'healthy', uptime: '99.95%' },
  { name: 'Storage', status: 'healthy', uptime: '99.98%' },
  { name: 'Cache', status: 'healthy', uptime: '100%' },
];

export function ServerStatus() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 animate-fade-up delay-100">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Server Status</h2>

      <div className="space-y-4">
        {statusItems.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <CircleDot
                className={`w-4 h-4 ${
                  item.status === 'healthy'
                    ? 'text-green-500 fill-green-500'
                    : 'text-yellow-500 fill-yellow-500'
                }`}
              />
              <div>
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-500">{item.uptime} uptime</p>
              </div>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                item.status === 'healthy'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {item.status === 'healthy' ? 'Healthy' : 'Warning'}
            </span>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <p className="text-xs text-gray-500 text-center">Last updated 2 minutes ago</p>
      </div>
    </div>
  );
}
