import React, { useState } from 'react';
import PatientSidebar from '../features/patient/components/Sidebar';
import PatientNavbar from '../features/patient/components/Navbar';

export const PatientLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <PatientSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col min-w-0 md:ml-64 transition-all duration-300">
        <PatientNavbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default PatientLayout;
