import type { ReactNode } from 'react';
import { Sidebar } from '@/app/components/organisms/admin/Sidebar';
import { Header } from '@/app/components/organisms/admin/Header';

export const metadata = {
  title: 'Admin Dashboard - Prev-In',
  description: 'Admin dashboard for managing Prev-In platform',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
