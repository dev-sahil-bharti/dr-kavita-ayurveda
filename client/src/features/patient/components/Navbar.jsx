import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, User, Check, Calendar, MessageSquare, Info } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import apiClient from '../../../services/api/client';
import { API_ENDPOINTS } from '../../../services/api/endpoints';

export const PatientNavbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const res = await apiClient.get(API_ENDPOINTS.NOTIFICATIONS.BASE);
      setNotifications(res.data?.data || []);
      setUnreadCount(res.data?.unreadCount || 0);
    } catch (error) {
      console.error('Failed to fetch patient notifications', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllAsRead = async () => {
    try {
      await apiClient.put(API_ENDPOINTS.NOTIFICATIONS.READ_ALL);
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark notifications as read', error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="h-4 w-4 text-emerald-600" />;
      case 'inquiry':
        return <MessageSquare className="h-4 w-4 text-purple-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getIconBg = (type) => {
    switch (type) {
      case 'appointment':
        return 'bg-emerald-100';
      case 'inquiry':
        return 'bg-purple-100';
      default:
        return 'bg-blue-100';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between bg-white px-4 md:px-8 shadow-sm border-b border-slate-200">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="mr-4 rounded-xl p-2 text-slate-500 hover:bg-slate-100 focus:outline-none md:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="hidden sm:flex items-center">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Patient'}!
          </h2>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative p-2 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition-colors focus:outline-none"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white border-2 border-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-fade-in-up">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-[380px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-sm">
                    No new notifications.
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-3 ${
                        !notification.isRead ? 'bg-emerald-50/20' : ''
                      }`}
                    >
                      <div
                        className={`mt-0.5 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${getIconBg(
                          notification.type
                        )}`}
                      >
                        {getIcon(notification.type)}
                      </div>
                      <div>
                        <p
                          className={`text-xs ${
                            !notification.isRead
                              ? 'font-bold text-slate-800'
                              : 'text-slate-600 font-medium'
                          }`}
                        >
                          {notification.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200 mx-1"></div>

        <div
          onClick={() => navigate('/patient/profile')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
              {user?.name || 'Patient'}
            </span>
            <span className="text-xs text-slate-400">Patient Account</span>
          </div>
          <div className="h-9 w-9 rounded-xl bg-emerald-700 text-white font-bold text-sm flex items-center justify-center shadow-sm">
            {user?.name?.charAt(0) || <User className="h-4 w-4" />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default PatientNavbar;
