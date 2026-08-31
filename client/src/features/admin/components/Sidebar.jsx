import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Activity,
  Settings,
  LogOut,
  Mail,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import logo from '../../../assets/logo.png';

export const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Patients', icon: Users, path: '/admin/patients' },
    { name: 'Appointments', icon: Calendar, path: '/admin/appointments' },
    { name: 'Therapies', icon: Activity, path: '/admin/therapies' },
    { name: 'Inquiries', icon: Mail, path: '/admin/inquiries' },
    { name: 'Appointment Calendar', icon: Calendar, path: '/admin/appointment-calendar' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } flex flex-col shadow-2xl md:shadow-none border-r border-slate-800`}
      >
        {/* Logo area */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Dr. Kavita Ayurveda Logo"
              className="h-9 w-auto rounded-full bg-white p-0.5"
            />
            <span className="text-base font-extrabold tracking-tight text-white">
              Dr. Kavita Ayurveda
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 768 && isOpen) {
                    toggleSidebar();
                  }
                }}
                className={({ isActive }) => `
                  flex items-center px-4 py-3 rounded-xl transition-all text-sm font-semibold
                  ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }
                `}
              >
                <Icon className="h-4 w-4 mr-3 shrink-0" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout area */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-semibold text-slate-400 rounded-xl hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
