'use client';

import { Search, Download, Trash2, Eye, MoreVertical } from 'lucide-react';
import { useState } from 'react';

interface Document {
  id: number;
  name: string;
  uploader: string;
  size: string;
  uploadedDate: string;
  views: number;
  status: 'active' | 'archived';
}

const documents: Document[] = [
  {
    id: 1,
    name: 'Q1 Financial Report.pdf',
    uploader: 'John Doe',
    size: '2.5 MB',
    uploadedDate: '2024-02-15',
    views: 124,
    status: 'active',
  },
  {
    id: 2,
    name: 'Marketing Proposal.docx',
    uploader: 'Jane Smith',
    size: '1.8 MB',
    uploadedDate: '2024-02-14',
    views: 87,
    status: 'active',
  },
  {
    id: 3,
    name: 'Budget 2024.xlsx',
    uploader: 'Bob Wilson',
    size: '3.2 MB',
    uploadedDate: '2024-02-10',
    views: 45,
    status: 'archived',
  },
  {
    id: 4,
    name: 'Project Timeline.ppt',
    uploader: 'Alice Johnson',
    size: '5.1 MB',
    uploadedDate: '2024-02-12',
    views: 156,
    status: 'active',
  },
];

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocs = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.uploader.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
        <p className="text-gray-600 mt-2">Manage all uploaded documents and files.</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or uploader..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#296374] focus:border-transparent transition"
          />
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">File Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Uploader</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Size</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Uploaded</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Views</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocs.map((doc, idx) => (
              <tr key={doc.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors animate-fade-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                <td className="px-6 py-4">
                  <span className="font-medium text-gray-900">{doc.name}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">{doc.uploader}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">{doc.size}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">{new Date(doc.uploadedDate).toLocaleDateString()}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Eye size={16} className="text-gray-400" />
                    <span className="text-sm font-medium">{doc.views}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      doc.status === 'active'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {doc.status === 'active' ? 'Active' : 'Archived'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                      <Download size={18} />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
