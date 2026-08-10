import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, Check, User, Calendar, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuth();
  const admin = user; // map for backward compatibility
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
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
      case 'patient': return <User className="h-4 w-4 text-green-600" />;
      case 'appointment': return <Calendar className="h-4 w-4 text-blue-600" />;
      case 'inquiry': return <MessageSquare className="h-4 w-4 text-purple-600" />;
      default: return <Bell className="h-4 w-4 text-slate-600" />;
    }
  };

  const getIconBg = (type) => {
    switch(type) {
      case 'patient': return 'bg-green-100';
      case 'appointment': return 'bg-blue-100';
      case 'inquiry': return 'bg-purple-100';
      default: return 'bg-slate-100';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between bg-white px-4 md:px-8 shadow-3 border-b border-text-inverse/20">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="mr-4 rounded-xs p-2 text-text-inverse focus:outline-none focus-visible:shadow-2"
        >
          <Menu className="h-6 w-6" />
        </button>
        
        <div className="hidden md:flex items-center relative">
          <Search className="h-4 w-4 absolute left-3 text-text-inverse" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && searchQuery.trim()) {
                navigate(`/admin/patients?search=${encodeURIComponent(searchQuery.trim())}`);
                setSearchQuery('');
              }
            }}
            placeholder="Search patients..." 
            className="pl-10 pr-4 py-2 bg-white border border-text-inverse rounded-sm text-lg focus-visible:outline-none focus-visible:shadow-2 w-64"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        
        {/* Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative p-2 text-text-inverse hover:bg-slate-100 rounded-lg transition-colors focus-visible:outline-none focus-visible:shadow-2"
          >
            <Bell className="h-8 w-8" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border-2 border-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-fade-in-up">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-bold text-slate-800">Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs font-bold text-surface-strong hover:text-surface-strong/80 flex items-center"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Mark all as read
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
                      className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-3 ${!notification.isRead ? 'bg-blue-50/30' : ''}`}
                    >
                      <div className={`mt-0.5 h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${getIconBg(notification.type)}`}>
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
        
        <div className="h-8 w-px bg-text-inverse/20 mx-2"></div>
        
        <div className="flex items-center space-x-3 cursor-pointer">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-lg font-bold text-text-primary">{admin?.name || 'Admin User'}</span>
            <span className="text-sm text-text-inverse">Super Admin</span>
          </div>
          <div className="h-9 w-9 rounded-sm bg-surface-muted border flex items-center justify-center text-text-secondary font-bold shadow-1">
            {admin?.name?.charAt(0) || 'A'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
