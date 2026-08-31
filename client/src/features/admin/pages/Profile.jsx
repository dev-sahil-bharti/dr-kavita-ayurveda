import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Lock, Save, Eye, EyeOff } from 'lucide-react';
import { authService } from '../../auth/services/authService';
import Button from '../../../components/common/Button';

export const Profile = () => {
  const { user } = useAuth();
  const admin = user;

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setMessage({ text: 'New passwords do not match', type: 'error' });
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const adminId = admin?._id || admin?.id;
      await authService.changeAdminPassword(adminId, passwordData);

      setMessage({ text: 'Password successfully updated!', type: 'success' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
    } catch (error) {
      console.error('Password change error', error);
      setMessage({
        text: error.message || 'Failed to update password',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Admin Profile</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your account credentials and security settings.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-emerald-700 to-teal-800"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="h-24 w-24 rounded-full bg-white p-1 border-4 border-white shadow-md">
              <div className="h-full w-full rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-3xl font-bold">
                {admin?.name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                {admin?.name || 'Clinic Administrator'}
              </h2>
              <p className="text-sm text-slate-500 font-medium">Super Administrator</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="text-slate-800 font-semibold">{admin?.email || 'admin@example.com'}</div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Role
                </label>
                <div className="text-slate-800 font-semibold">Super Admin</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security: Password Update */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden mt-6">
        <div className="p-6 border-b border-slate-100 flex items-center bg-slate-50/50">
          <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl mr-4">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Security Options</h2>
            <p className="text-xs text-slate-500">Update your password to keep your administrator account protected.</p>
          </div>
        </div>
        <div className="p-8">
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-xl text-sm font-medium ${
                message.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {message.text}
            </div>
          )}
          <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-lg">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 pr-12 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 pr-12 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 pr-12 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={loading}
                icon={Save}
              >
                Update Password
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
