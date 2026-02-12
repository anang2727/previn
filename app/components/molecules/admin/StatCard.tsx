import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend: string;
  previous: string;
  delay?: number;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  previous,
  delay = 0,
}: StatCardProps) {
  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-[#296374] transition-all animate-fade-up"
      style={{ animationDelay: `${delay * 0.1}s` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
          <p className="text-xs text-gray-500 mt-2">{previous}</p>
        </div>
        <div className="p-3 bg-[#296374] bg-opacity-10 rounded-lg">
          <Icon className="w-6 h-6 text-[#296374]" />
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-sm font-semibold text-green-600">{trend}</p>
      </div>
    </div>
  );
}
