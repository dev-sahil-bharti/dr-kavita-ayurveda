import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Activity, Settings, LogOut, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Patients', icon: Users, path: '/admin/patients' },
    { name: 'Appointments', icon: Calendar, path: '/admin/appointments' },
    { name: 'Therapies', icon: Activity, path: '/admin/therapies' },
    { name: 'Inquiries', icon: Mail, path: '/admin/inquiries' },
    { name: 'Settings', icon: Settings, path: '/admin/profile' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-text-tertiary/50 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50
        w-64 bg-surface-muted text-text-secondary
        transform transition-transform duration-[300ms] ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col shadow-3
      `}>
        {/* Logo area */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <img src={logo} alt="Dr. Kavita Ayurveda Logo" className="h-10 w-auto rounded-full bg-white p-0.5" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
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
                  flex items-center px-4 py-3 rounded-xs transition-colors text-lg focus-visible:outline-none focus-visible:shadow-2
                  ${isActive 
                    ? 'bg-surface-strong text-text-secondary shadow-1' 
                    : 'text-text-secondary/80 hover:bg-white/10 hover:text-text-secondary'}
                `}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout area */}
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={logout}
            className="flex items-center w-full px-4 py-3 text-lg text-text-secondary/80 rounded-xs hover:bg-white/10 hover:text-text-secondary transition-colors focus-visible:outline-none focus-visible:shadow-2"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
