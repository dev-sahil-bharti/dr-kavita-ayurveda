import React, { useState, useEffect } from 'react';
import { User, Building, Bell, Shield, Save, Moon, Sun, Monitor } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [adminId, setAdminId] = useState(null);

  // Mock states for settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: '',
    contactEmail: '',
    supportPhone: '',
    theme: 'system'
  });

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const response = await api.get('/admin/profile');
        if (response.data && response.data.user) {
          const user = response.data.user;
          setAdminId(user._id);
          setGeneralSettings(prev => ({
            ...prev,
            siteName: user.name || '',
            contactEmail: user.email || '',
            supportPhone: user.mobileNo || '',
          }));
        }
      } catch (error) {
        toast.error('Failed to load profile data');
      }
    };
    fetchAdminProfile();
  }, []);

  const [clinicSettings, setClinicSettings] = useState({
    address: '123 Wellness Avenue, Ayurveda City',
    workingDays: 'Monday - Saturday',
    workingHours: '09:00 AM - 07:00 PM',
    maxAppointmentsPerDay: '30'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    smsAlerts: true,
    marketingEmails: false,
    dailySummary: true
  });

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      if (activeTab === 'general' && adminId) {
        await api.put(`/admin/updateAdminProfile/${adminId}`, {
          name: generalSettings.siteName,
          email: generalSettings.contactEmail,
          mobileNo: generalSettings.supportPhone
        });
        toast.success('Profile updated successfully!');
      } else {
        // Simulate API call for other settings tabs
        setTimeout(() => {
          toast.success('Settings saved successfully!');
        }, 800);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save settings');
    } finally {
      if (activeTab === 'general') setIsSaving(false);
      else setTimeout(() => setIsSaving(false), 800);
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
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Settings</h1>
        <p className="text-lg text-slate-500 mt-1">Manage your clinic preferences and system configurations.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <nav className="flex md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0 hide-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all whitespace-nowrap
                    ${activeTab === tab.id 
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-105 md:scale-100 md:translate-x-2' 
                      : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-emerald-600'
                    }`}
                >
                  <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-emerald-100' : 'text-slate-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in-up">
            
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="p-8 space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-4">General Settings</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Admin Name</label>
                      <input 
                        type="text" 
                        value={generalSettings.siteName}
                        onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Admin Email</label>
                      <input 
                        type="email" 
                        value={generalSettings.contactEmail}
                        onChange={(e) => setGeneralSettings({...generalSettings, contactEmail: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Mobile Number</label>
                      <input 
                        type="text" 
                        value={generalSettings.supportPhone}
                        onChange={(e) => setGeneralSettings({...generalSettings, supportPhone: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
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
                      { id: 'system', icon: Monitor, label: 'System' }
                    ].map((theme) => {
                      const ThemeIcon = theme.icon;
                      return (
                        <button
                          key={theme.id}
                          onClick={() => setGeneralSettings({...generalSettings, theme: theme.id})}
                          className={`flex-1 flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all
                            ${generalSettings.theme === theme.id 
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                              : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                          <ThemeIcon className="w-6 h-6 mb-2" />
                          <span className="font-medium text-sm">{theme.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Clinic Info */}
            {activeTab === 'clinic' && (
              <div className="p-8 space-y-8">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Clinic Information</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Clinic Address</label>
                    <textarea 
                      value={clinicSettings.address}
                      onChange={(e) => setClinicSettings({...clinicSettings, address: e.target.value})}
                      rows="3"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Working Days</label>
                      <input 
                        type="text" 
                        value={clinicSettings.workingDays}
                        onChange={(e) => setClinicSettings({...clinicSettings, workingDays: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Working Hours</label>
                      <input 
                        type="text" 
                        value={clinicSettings.workingHours}
                        onChange={(e) => setClinicSettings({...clinicSettings, workingHours: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Max Appointments / Day</label>
                      <input 
                        type="number" 
                        value={clinicSettings.maxAppointmentsPerDay}
                        onChange={(e) => setClinicSettings({...clinicSettings, maxAppointmentsPerDay: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="p-8 space-y-6">
                <h2 className="text-xl font-bold text-slate-800 mb-6">Notification Preferences</h2>
                
                {[
                  { id: 'emailAlerts', title: 'Email Alerts', desc: 'Receive notifications for new appointments and inquiries via email.' },
                  { id: 'smsAlerts', title: 'SMS Alerts', desc: 'Receive critical updates and OTPs via SMS.' },
                  { id: 'dailySummary', title: 'Daily Summary', desc: 'Get a daily digest of all clinic activities.' },
                  { id: 'marketingEmails', title: 'Marketing Emails', desc: 'Receive product updates and promotional offers.' }
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div>
                      <h3 className="font-bold text-slate-800">{item.title}</h3>
                      <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={notificationSettings[item.id]}
                        onChange={(e) => setNotificationSettings({...notificationSettings, [item.id]: e.target.checked})}
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                ))}
              </div>
            )}

            {/* Security - Just a placeholder as Profile handles password */}
            {activeTab === 'security' && (
              <div className="p-8 space-y-6 text-center">
                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-10 h-10 text-indigo-500" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Security & Access</h2>
                <p className="text-slate-500 max-w-md mx-auto">
                  Account security, including password changes and 2FA, is managed in your Profile section.
                </p>
                <button 
                  onClick={() => window.location.href = '/admin/profile'}
                  className="mt-4 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors shadow-sm"
                >
                  Go to Profile Security
                </button>
              </div>
            )}

            {/* Global Save Button */}
            {activeTab !== 'security' && (
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20 active:scale-95"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  ) : (
                    <Save className="w-5 h-5 mr-2" />
                  )}
                  {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
