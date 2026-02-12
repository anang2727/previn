'use client';

import { Search, MoreVertical, Mail, Calendar } from 'lucide-react';
import { useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  joinedDate: string;
  documents: number;
}

const users: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    status: 'active',
    joinedDate: '2024-01-15',
    documents: 24,
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 'active',
    joinedDate: '2024-02-01',
    documents: 18,
  },
  {
    id: 3,
    name: 'Bob Wilson',
    email: 'bob@example.com',
    status: 'inactive',
    joinedDate: '2024-01-20',
    documents: 5,
  },
  {
    id: 4,
    name: 'Alice Johnson',
    email: 'alice@example.com',
    status: 'active',
    joinedDate: '2024-02-10',
    documents: 32,
  },
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-600 mt-2">Manage and monitor all platform users.</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#296374] focus:border-transparent transition"
          />
        </div>
        <button className="px-6 py-2.5 admin-bg text-white rounded-lg hover:bg-[#3a7a90] transition-colors font-medium">
          Add User
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Joined</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Documents</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, idx) => (
              <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors animate-fade-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full admin-bg flex items-center justify-center text-white font-semibold text-sm">
                      {user.name.charAt(0)}
                    </div>
                    <span className="font-medium text-gray-900">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={16} className="text-gray-400" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {user.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-sm">{new Date(user.joinedDate).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-900">{user.documents}</span>
                </td>
                <td className="px-6 py-4">
                  <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
