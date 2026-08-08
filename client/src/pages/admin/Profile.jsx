import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Lock, Save, Eye, EyeOff } from 'lucide-react';
import api from '../../services/api';

const Profile = () => {
  const { user } = useAuth();
  const admin = user; // map for backward compatibility

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // Visibility toggles
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
      // Assuming admin ID is available in user._id or user.id
      const adminId = admin?._id || admin?.id;
      await api.put(`/admin/changepassword/${adminId}`, passwordData);
      
      setMessage({ text: 'Password successfully updated!', type: 'success' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      // reset toggles
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
    } catch (error) {
      console.error('Password change error', error);
      setMessage({ 
        text: error.response?.data?.message || 'Failed to update password', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Admin Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="h-24 w-24 rounded-full bg-white p-1 border-4 border-white shadow-md">
              <div className="h-full w-full rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-3xl font-bold">
                {admin?.name?.charAt(0) || 'A'}
              </div>
            </div>
            <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition-colors">
              Edit Profile
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800">{admin?.name || 'Administrator'}</h2>
              <p className="text-slate-500">Super Admin</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Email Address</label>
                <div className="text-slate-800 font-medium">{admin?.email || 'admin@example.com'}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 mb-1">Role</label>
                <div className="text-slate-800 font-medium">Super Admin</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Options: Change Password */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-6">
        <div className="p-6 border-b border-slate-100 flex items-center">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg mr-4">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Security Options</h2>
            <p className="text-sm text-slate-500">Update your password to keep your account secure.</p>
          </div>
        </div>
        <div className="p-6">
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message.text}
            </div>
          )}
          <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-lg">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Current Password</label>
              <div className="relative">
                <input 
                  type={showCurrent ? "text" : "password"} 
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 pr-12 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Enter current password"
                />
                <button 
                  type="button" 
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
              <div className="relative">
                <input 
                  type={showNew ? "text" : "password"} 
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 pr-12 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Enter new password"
                />
                <button 
                  type="button" 
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Confirm New Password</label>
              <div className="relative">
                <input 
                  type={showConfirm ? "text" : "password"} 
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 pr-12 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Confirm new password"
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="flex items-center justify-center px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
