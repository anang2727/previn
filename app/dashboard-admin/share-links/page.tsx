import { Link2, Copy, Power, ExternalLink } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { PageHeader } from '../components/PageHeader';

export default function ShareLinkManager() {
  const links = [
    { id: 1, file: 'Q1-Report.pdf', link: 'prev-in.io/s/abc123xyz', status: 'Active', clicks: 245, createdDate: '2024-01-15' },
    { id: 2, file: 'presentation.pptx', link: 'prev-in.io/s/def456uvw', status: 'Active', clicks: 89, createdDate: '2024-01-20' },
    { id: 3, file: 'budget-2024.xlsx', link: 'prev-in.io/s/ghi789rst', status: 'Disabled', clicks: 0, createdDate: '2024-01-25' },
    { id: 4, file: 'product-guide.pdf', link: 'prev-in.io/s/jkl012mno', status: 'Active', clicks: 512, createdDate: '2024-02-01' },
  ];

  return (
    <AdminLayout>
      <PageHeader title="Share Link Manager" description="Manage and monitor all shared links" icon={<Link2 size={28} />} />

      <div className="p-8">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">File</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Share Link</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Clicks</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Created</th>
                  <th className="text-center py-3 px-6 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {links.map((link) => (
                  <tr key={link.id} className="hover:bg-gray-50 transition">
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">{link.file}</td>
                    <td className="py-4 px-6 text-sm text-gray-600 font-mono">{link.link}</td>
                    <td className="py-4 px-6 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          link.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {link.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{link.clicks}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{link.createdDate}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex gap-2 justify-center">
                        <button className="p-2 hover:bg-blue-100 rounded transition text-blue-600" title="Copy link">
                          <Copy size={18} />
                        </button>
                        <button className="p-2 hover:bg-purple-100 rounded transition text-purple-600" title="Open link">
                          <ExternalLink size={18} />
                        </button>
                        <button className={`p-2 rounded transition ${link.status === 'Active' ? 'hover:bg-red-100 text-red-600' : 'hover:bg-green-100 text-green-600'}`} title={link.status === 'Active' ? 'Disable link' : 'Enable link'}>
                          <Power size={18} />
                        </button>
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
