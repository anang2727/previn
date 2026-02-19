'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  FileText,
  Users,
  Crown,
  ShieldAlert,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { createClient } from "@/utils/client"
import { useRouter } from "next/navigation"


const menuItems = [
  {
    label: 'Dashboard',
    href: '/dashboard-admin',
    icon: LayoutDashboard,
  },
  {
    label: 'Management File',
    icon: FileText,
    submenu: [
      { label: 'Semua File', href: '/dashboard-admin/files/all' },
      { label: 'Link Share', href: '/dashboard-admin/files/links' },
      { label: 'File Terhapus', href: '/dashboard-admin/files/deleted' },
    ],
  },
  {
    label: 'Management User',
    icon: Users,
    submenu: [
      { label: 'Daftar User', href: '/dashboard-admin/users' },
      { label: 'Blacklist', href: '/dashboard-admin/users/blacklist' },
    ],
  },
  {
    label: 'VIP & Pemasukan',
    icon: Crown,
    submenu: [
      { label: 'Paket Langganan', href: '/dashboard-admin/vip/packages' },
      { label: 'Transaksi', href: '/dashboard-admin/vip/transactions' },
      { label: 'Kuota Storage', href: '/dashboard-admin/vip/quota' },
      { label: 'Promo/Voucher', href: '/dashboard-admin/vip/promo' },
    ],
  },
  {
    label: 'Moderasi & Security',
    icon: ShieldAlert,
    submenu: [
      { label: 'Laporan Abuse', href: '/dashboard-admin/moderation/abuse' },
      { label: 'Log Aktivitas', href: '/dashboard-admin/moderation/logs' },
    ],
  },
  {
    label: 'Pengaturan Sistem',
    icon: Settings,
    submenu: [
      { label: 'Umum', href: '/dashboard-admin/settings/general' },
      { label: 'Aturan Upload', href: '/dashboard-admin/settings/upload' },
      { label: 'Storage', href: '/dashboard-admin/settings/storage' },
      { label: 'Payment Gateway', href: '/dashboard-admin/settings/payment' },
    ],
  },
  {
    label: 'Support',
    icon: HelpCircle,
    submenu: [
      { label: 'Tiket Bantuan', href: '/dashboard-admin/support/tickets' },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);
  const router = useRouter();
  const supabase = createClient();

  const toggleDropdown = (label: string) => {
    setOpenDropdowns((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      alert("Gagal logout: " + error.message)
    } else {
      router.push("/login")
      router.refresh()
    }
  }
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/dashboard-admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg admin-bg flex items-center justify-center text-white font-bold text-lg">
            D
          </div>
          <div>
            <h1 className="font-bold text-gray-900 text-lg">Prev-In</h1>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </Link>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const isDropdownOpen = openDropdowns.includes(item.label);
          const hasSubmenu = item.submenu;

          if (hasSubmenu) {
            return (
              <div key={item.label}>
                {/* Dropdown Button */}
                <button
                  onClick={() => toggleDropdown(item.label)}
                  className="cursor-pointer flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                {/* Submenu Items */}
                {isDropdownOpen && (
                  <div className="pl-6 mt-1 space-y-1">
                    {item.submenu.map((subitem) => {
                      const isSubActive = pathname === subitem.href;
                      return (
                        <Link
                          key={subitem.href}
                          href={subitem.href}
                          className={`block px-3 py-2 rounded-lg text-sm transition-colors ${isSubActive
                            ? 'admin-bg text-white font-medium'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                          {subitem.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          // Regular menu item without submenu
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive
                ? 'admin-bg text-white'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button onClick={handleLogout} className="cursor-pointer flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
