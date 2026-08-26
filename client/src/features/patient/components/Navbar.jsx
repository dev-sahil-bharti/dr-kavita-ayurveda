import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell, User, Check, Calendar, MessageSquare, Info } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data);
      setUnreadCount(res.data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
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
      await api.put('/notifications/read-all');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'appointment': return <Calendar className="h-4 w-4 text-emerald-600" />;
      case 'inquiry': return <MessageSquare className="h-4 w-4 text-purple-600" />;
      default: return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const getIconBg = (type) => {
    switch(type) {
      case 'appointment': return 'bg-emerald-100';
      case 'inquiry': return 'bg-purple-100';
      default: return 'bg-blue-100';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between bg-white px-4 md:px-8 shadow-sm border-b border-slate-200">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="mr-4 rounded-lg p-2 text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 md:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
        
        <div className="hidden sm:flex items-center">
          <h2 className="text-xl font-bold text-slate-800">Welcome back, {user?.name?.split(' ')[0] || 'Patient'}!</h2>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        
        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors focus:outline-none"
          >
            <Bell className="h-8 w-8" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border-2 border-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-fade-in-up">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-800">Notifications</h3>
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
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-sm">
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div 
                      key={notification._id} 
                      className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-3 ${!notification.isRead ? 'bg-emerald-50/30' : ''}`}
                    >
                      <div className={`mt-0.5 h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${getIconBg(notification.type)}`}>
                        {getIcon(notification.type)}
                      </div>
                      <div>
                        <p className={`text-sm ${!notification.isRead ? 'font-bold text-slate-800' : 'text-slate-600 font-medium'}`}>
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
        
        <div className="h-8 w-px bg-slate-200 mx-2"></div>
        
        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-600 transition-colors">{user?.name || 'Patient'}</span>
            <span className="text-xs text-slate-500">Patient Account</span>
          </div>
          <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold shadow-sm border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            {user?.name?.charAt(0) || <User className="h-5 w-5" />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
