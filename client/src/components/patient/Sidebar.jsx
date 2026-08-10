import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Activity, Calendar, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  
  const navItems = [
    { name: 'Appointments', icon: Activity, path: '/patient/appointments' },
    { name: 'Book New', icon: Calendar, path: '/patient/book' },
    { name: 'Profile', icon: User, path: '/patient/profile' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 md:hidden backdrop-blur-sm transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50
        w-64 bg-emerald-800 text-emerald-50
        transform transition-transform duration-[300ms] ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col shadow-xl md:shadow-none
      `}>
        {/* Logo area */}
        <div className="h-16 flex items-center px-6 border-b border-emerald-700/50">
          <Link to="/patient/appointments" className="flex items-center gap-3">
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
                  flex items-center px-4 py-3 rounded-xl transition-colors text-base font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white
                  ${isActive 
                    ? 'bg-emerald-600 text-white shadow-inner' 
                    : 'text-emerald-100 hover:bg-emerald-700 hover:text-white'}
                `}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout area */}
        <div className="p-4 border-t border-emerald-700/50">
          <button 
            onClick={logout}
            className="flex items-center w-full px-4 py-3 text-base font-medium text-emerald-100 rounded-xl hover:bg-emerald-700 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
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
