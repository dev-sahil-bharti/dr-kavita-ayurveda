import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Building, Bell, Shield, Moon, Sun, Monitor } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../services/adminService';
import { authService } from '../../auth/services/authService';
import Button from '../../../components/common/Button';

export const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [adminId, setAdminId] = useState(null);
  const navigate = useNavigate();

  const [generalSettings, setGeneralSettings] = useState({
    siteName: '',
    contactEmail: '',
    supportPhone: '',
    theme: 'system',
  });

  const [clinicSettings, setClinicSettings] = useState({
    address: '123 Wellness Avenue, Ayurveda City',
    workingDays: 'Monday - Saturday',
    workingHours: '09:00 AM - 07:00 PM',
    maxAppointmentsPerDay: '30',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    smsAlerts: true,
    marketingEmails: false,
    dailySummary: true,
  });

  useEffect(() => {
    const fetchSettingsAndProfile = async () => {
      try {
        const [profileData, settingsData] = await Promise.all([
          authService.getAdminProfile(),
          adminService.getSettings().catch(() => null),
        ]);

        if (profileData && profileData.user) {
          const user = profileData.user;
          setAdminId(user._id);
          setGeneralSettings((prev) => ({
            ...prev,
            siteName: user.name || '',
            contactEmail: user.email || '',
            supportPhone: user.mobileNo || user.mobile || '',
          }));
        }

        if (settingsData) {
          setGeneralSettings((prev) => ({
            ...prev,
            theme: settingsData.theme || 'system',
          }));
          setClinicSettings((prev) => ({
            address: settingsData.clinicAddress || prev.address,
            workingDays: settingsData.workingDays || prev.workingDays,
            workingHours: settingsData.workingHours || prev.workingHours,
            maxAppointmentsPerDay: String(
              settingsData.maxAppointmentsPerDay || prev.maxAppointmentsPerDay
            ),
          }));
          setNotificationSettings({
            emailAlerts: settingsData.emailAlerts ?? true,
            smsAlerts: settingsData.smsAlerts ?? true,
            marketingEmails: settingsData.marketingEmails ?? false,
            dailySummary: settingsData.dailySummary ?? true,
          });
        }
      } catch (error) {
        console.error('Failed to load settings', error);
      }
    };
    fetchSettingsAndProfile();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      if (activeTab === 'general' && adminId) {
        await authService.updateAdminProfile(adminId, {
          name: generalSettings.siteName,
          email: generalSettings.contactEmail,
          mobileNo: generalSettings.supportPhone,
        });

        await adminService.updateSettings({
          theme: generalSettings.theme,
        });

        toast.success('Profile and appearance updated successfully!');
      } else if (activeTab === 'clinic') {
        await adminService.updateSettings({
          clinicAddress: clinicSettings.address,
          workingDays: clinicSettings.workingDays,
          workingHours: clinicSettings.workingHours,
          maxAppointmentsPerDay: Number(clinicSettings.maxAppointmentsPerDay),
        });
        toast.success('Clinic info updated successfully!');
      } else if (activeTab === 'notifications') {
        await adminService.updateSettings(notificationSettings);
        toast.success('Notification preferences updated successfully!');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: User },
    { id: 'clinic', label: 'Clinic Info', icon: Building },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your clinic preferences and system configurations.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 hide-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all whitespace-nowrap text-sm ${
                    activeTab === tab.id
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-emerald-700'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      activeTab === tab.id ? 'text-emerald-100' : 'text-slate-400'
                    }`}
                  />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="p-8 space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-4">
                    General Settings
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Admin Name
                      </label>
                      <input
                        type="text"
                        value={generalSettings.siteName}
                        onChange={(e) =>
                          setGeneralSettings({ ...generalSettings, siteName: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Admin Email
                      </label>
                      <input
                        type="email"
                        value={generalSettings.contactEmail}
                        onChange={(e) =>
                          setGeneralSettings({
                            ...generalSettings,
                            contactEmail: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Mobile Number
                      </label>
                      <input
                        type="text"
                        value={generalSettings.supportPhone}
                        onChange={(e) =>
                          setGeneralSettings({
                            ...generalSettings,
                            supportPhone: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-8">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Appearance</h3>
                  <div className="flex gap-4">
                    {[
                      { id: 'light', icon: Sun, label: 'Light' },
                      { id: 'dark', icon: Moon, label: 'Dark' },
                      { id: 'system', icon: Monitor, label: 'System' },
                    ].map((theme) => {
                      const ThemeIcon = theme.icon;
                      return (
                        <button
                          key={theme.id}
                          onClick={() =>
                            setGeneralSettings({ ...generalSettings, theme: theme.id })
                          }
                          className={`flex-1 flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                            generalSettings.theme === theme.id
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-bold'
                              : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <ThemeIcon className="w-6 h-6 mb-2" />
                          <span className="text-sm">{theme.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Clinic Info */}
            {activeTab === 'clinic' && (
              <div className="p-8 space-y-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Clinic Information</h2>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Clinic Address
                  </label>
                  <textarea
                    value={clinicSettings.address}
                    onChange={(e) =>
                      setClinicSettings({ ...clinicSettings, address: e.target.value })
                    }
                    rows="3"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm resize-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Working Days
                    </label>
                    <input
                      type="text"
                      value={clinicSettings.workingDays}
                      onChange={(e) =>
                        setClinicSettings({
                          ...clinicSettings,
                          workingDays: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Working Hours
                    </label>
                    <input
                      type="text"
                      value={clinicSettings.workingHours}
                      onChange={(e) =>
                        setClinicSettings({
                          ...clinicSettings,
                          workingHours: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Max Appointments / Day
                    </label>
                    <input
                      type="number"
                      value={clinicSettings.maxAppointmentsPerDay}
                      onChange={(e) =>
                        setClinicSettings({
                          ...clinicSettings,
                          maxAppointmentsPerDay: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="p-8 space-y-6">
                <h2 className="text-xl font-bold text-slate-800 mb-6">
                  Notification Preferences
                </h2>

                {[
                  {
                    id: 'emailAlerts',
                    title: 'Email Alerts',
                    desc: 'Receive instant notifications for new bookings and inquiries.',
                  },
                  {
                    id: 'smsAlerts',
                    title: 'SMS Alerts',
                    desc: 'Receive critical schedule updates and OTPs via SMS.',
                  },
                  {
                    id: 'dailySummary',
                    title: 'Daily Summary',
                    desc: 'Get an automated daily summary of clinic bookings.',
                  },
                  {
                    id: 'marketingEmails',
                    title: 'Marketing Emails',
                    desc: 'Receive product updates and promotional communications.',
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">{item.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={notificationSettings[item.id]}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            [item.id]: e.target.checked,
                          })
                        }
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <div className="p-8 space-y-6 text-center">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Security & Credentials</h2>
                <p className="text-slate-500 text-sm max-w-md mx-auto">
                  Account security, including administrator password changes and authentication credentials, is managed in your Profile section.
                </p>
                <Button
                  variant="primary"
                  onClick={() => navigate('/admin/profile')}
                >
                  Go to Profile Security
                </Button>
              </div>
            )}

            {/* Save Actions */}
            {activeTab !== 'security' && (
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                <Button
                  variant="primary"
                  size="md"
                  isLoading={isSaving}
                  onClick={handleSave}
                >
                  Save Settings
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
