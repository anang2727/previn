import { HardDrive, Users, Ban, AlertTriangle, FileCheck, Settings, FileUp, Mail, User, MessageSquare } from 'lucide-react';
import { AdminLayout } from '../components/AdminLayout';
import { PageHeader } from '../components/PageHeader';

const pageConfig: Record<string, { title: string; description: string; icon: any }> = {
  'storage-status': {
    title: 'Storage Status',
    description: 'Monitor storage capacity and usage',
    icon: <HardDrive size={28} />
  },
  'user-directory': {
    title: 'User Directory',
    description: 'View and manage all registered users',
    icon: <Users size={28} />
  },
  'membership-quota': {
    title: 'Membership & Quota',
    description: 'Set and manage user storage limits',
    icon: <Users size={28} />
  },
  'banned-suspended': {
    title: 'Banned & Suspended',
    description: 'Manage blocked users and IP addresses',
    icon: <Ban size={28} />
  },
  'abuse-reports': {
    title: 'Abuse Reports',
    description: 'Review and handle abuse reports from users',
    icon: <AlertTriangle size={28} />
  },
  'activity-logs': {
    title: 'Activity Logs',
    description: 'Track system activities and user actions',
    icon: <FileCheck size={28} />
  },
  'site-settings': {
    title: 'Site Settings',
    description: 'Configure application settings and preferences',
    icon: <Settings size={28} />
  },
  'upload-rules': {
    title: 'Upload Rules',
    description: 'Manage file upload restrictions and limits',
    icon: <FileUp size={28} />
  },
  'email-notifications': {
    title: 'Email & Notifications',
    description: 'Configure email and notification settings',
    icon: <Mail size={28} />
  },
  'my-account': {
    title: 'My Account',
    description: 'Manage your admin profile and settings',
    icon: <User size={28} />
  },
  'support-tickets': {
    title: 'Support Tickets',
    description: 'View and respond to user support requests',
    icon: <MessageSquare size={28} />
  }
};

export default async function Page({
  params
}: {
  params: Promise<{ page: string }>
}) {
  const resolvedParams = await params;
  const page = resolvedParams.page;
  const config = pageConfig[page];

  if (!config) {
    return <div>Page not found</div>;
  }

  return (
    <AdminLayout>
      <PageHeader title={config.title} description={config.description} icon={config.icon} />

      <div className="p-8">
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Coming Soon</h2>
          <p className="text-gray-600">
            The <strong>{config.title}</strong> page is under development. Content will be added soon.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
