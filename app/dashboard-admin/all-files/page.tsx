import { FileText, Download, Eye, Trash2, Filter } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { PageHeader } from '../components/PageHeader';

export default function AllFiles() {
  const files = [
    { id: 1, name: 'Q1-Report.pdf', size: '2.4 MB', type: 'PDF', uploadedBy: 'John Doe', uploadDate: '2024-02-10', format: 'PDF' },
    { id: 2, name: 'presentation.pptx', size: '5.1 MB', type: 'PowerPoint', uploadedBy: 'Jane Smith', uploadDate: '2024-02-09', format: 'Document' },
    { id: 3, name: 'product-video.mp4', size: '245 MB', type: 'Video', uploadedBy: 'Mike Johnson', uploadDate: '2024-02-08', format: 'Video' },
    { id: 4, name: 'spreadsheet.xlsx', size: '1.2 MB', type: 'Excel', uploadedBy: 'Sarah Lee', uploadDate: '2024-02-07', format: 'Document' },
    { id: 5, name: 'design-mockup.png', size: '3.8 MB', type: 'Image', uploadedBy: 'Tom Wilson', uploadDate: '2024-02-06', format: 'Image' },
  ];

  return (
    <AdminLayout>
      <PageHeader title="All Files" description="Master data of all uploaded files in the system" icon={<FileText size={28} />} />

      <div className="p-8 space-y-6">
        {/* Filters */}
        <div className="flex gap-4 flex-wrap">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 text-sm font-medium">
            <Filter size={16} /> Filter by Format
          </button>
          <select className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 text-sm font-medium">
            <option value="">All Formats</option>
            <option value="pdf">PDF</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>

        {/* Files Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Filename</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Size</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Type</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Uploaded By</th>
                  <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Date</th>
                  <th className="text-center py-3 px-6 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {files.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50 transition">
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">{file.name}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{file.size}</td>
                    <td className="py-4 px-6 text-sm">
                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">{file.type}</span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{file.uploadedBy}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{file.uploadDate}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex gap-2 justify-center">
                        <button className="p-2 hover:bg-blue-100 rounded transition text-blue-600">
                          <Eye size={18} />
                        </button>
                        <button className="p-2 hover:bg-green-100 rounded transition text-green-600">
                          <Download size={18} />
                        </button>
                        <button className="p-2 hover:bg-red-100 rounded transition text-red-600">
                          <Trash2 size={18} />
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
