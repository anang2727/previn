'use client';

import { useState } from 'react';
import { Save, AlertCircle, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    appName: 'Prev-In',
    maxFileSize: '100',
    maxUsers: '1000',
    emailNotifications: true,
    twoFactor: true,
    maintenanceMode: false,
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (key: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage platform configuration and preferences.</p>
      </div>

      {/* Notification */}
      {saved && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-sm font-medium text-green-800">Settings saved successfully!</p>
        </div>
      )}

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">General Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Application Name
              </label>
              <input
                type="text"
                value={settings.appName}
                onChange={(e) => handleChange('appName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#296374] focus:border-transparent transition"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Max File Size (MB)
                </label>
                <input
                  type="number"
                  value={settings.maxFileSize}
                  onChange={(e) => handleChange('maxFileSize', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#296374] focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Max Users
                </label>
                <input
                  type="number"
                  value={settings.maxUsers}
                  onChange={(e) => handleChange('maxUsers', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#296374] focus:border-transparent transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Security Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-600">Send alerts for suspicious activities</p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                className="w-5 h-5 rounded accent-[#296374] cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600">Require 2FA for admin access</p>
              </div>
              <input
                type="checkbox"
                checked={settings.twoFactor}
                onChange={(e) => handleChange('twoFactor', e.target.checked)}
                className="w-5 h-5 rounded accent-[#296374] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Maintenance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Maintenance</h2>
          <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-yellow-900">Maintenance Mode</p>
                <p className="text-sm text-yellow-800">When enabled, only admins can access the platform</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
              className="w-5 h-5 rounded accent-[#296374] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 admin-bg text-white rounded-lg hover:bg-[#3a7a90] transition-colors font-medium"
        >
          <Save size={20} />
          Save Settings
        </button>
      </div>
    </div>
  );
}
