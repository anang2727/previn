'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as Icons from 'lucide-react';
import adminData from '@/data/adminDashboard.json';

type IconName = keyof typeof Icons;

export function Sidebar() {
  const pathname = usePathname();

  const getIcon = (iconName: string) => {
    const Icon = Icons[iconName as IconName] as React.ComponentType<{ size: number; className?: string }>;
    return Icon;
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: '#296374' }}>
            D
          </div>
          <div>
            <h1 className="font-bold text-gray-900">Prev-In</h1>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-6 space-y-8">
        {adminData.sidebarGroups.map((group, idx) => (
          <div key={idx} className="space-y-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{group.name}</p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = getIcon(item.icon);
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-[#296374] font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Items */}
      <div className="border-t border-gray-200 p-6 space-y-1">
        {adminData.bottomItems.map((item) => {
          const Icon = getIcon(item.icon);
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-[#296374] font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon size={18} />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors">
          <Icons.LogOut size={18} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
