import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Admin Components & Pages
import Sidebar from '../components/admin/Sidebar';
import Navbar from '../components/admin/Navbar';
import Dashboard from '../pages/admin/Dashboard';
import AdminPatients from '../pages/admin/Patients';
import AdminAppointments from '../pages/admin/Appointments';
import AdminTherapies from '../pages/admin/Therapies';
import AdminLogin from '../pages/admin/Login';
import AdminProfile from '../pages/admin/Profile';
import AdminInquiries from '../pages/admin/Inquery';

import PatientLogin from '../pages/patient/Login';
import PatientRegister from '../pages/patient/Register';

import BookAppointment from '../pages/patient/BookAppointment';
import PatientAppointments from '../pages/patient/Appointments';
import PatientProfile from '../pages/patient/Profile';

// Public Pages
import Home from '../pages/public/Home';
import About from '../pages/public/About';
import Contact from '../pages/public/Contact';
import Gallery from '../pages/public/Gallery';
import Panchakarma from '../pages/public/Panchakarma';
import Therapies from '../pages/public/Therapies';
import PrivacyPolicy from '../pages/public/PrivacyPolicy';
import TermsOfService from '../pages/public/TermsOfService';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col min-w-0 md:ml-64 transition-all duration-300">
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

import PublicNavbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PatientNavbar from '../components/patient/Navbar';
import PatientSidebar from '../components/patient/Sidebar';

const PatientLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <PatientSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col min-w-0 md:ml-64 transition-all duration-300">
        <PatientNavbar toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <PublicNavbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/panchakarma" element={<PublicLayout><Panchakarma /></PublicLayout>} />
      <Route path="/therapies" element={<PublicLayout><Therapies /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
      <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
      <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
      <Route path="/privacy-policy" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
      <Route path="/terms-of-service" element={<PublicLayout><TermsOfService /></PublicLayout>} />

      {/* AUTH ROUTES (Patient) */}
      <Route path="/patient/login" element={<PatientLogin />} />
      <Route path="/patient/register" element={<PatientRegister />} />

      {/* AUTH ROUTES (Admin) */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* PROTECTED ROUTES (Patient) */}
      <Route path="/patient" element={<ProtectedRoute allowedRoles={['patient']}><PatientLayout><Navigate to="/patient/appointments" replace /></PatientLayout></ProtectedRoute>} />
      <Route path="/patient/book" element={<ProtectedRoute allowedRoles={['patient']}><PatientLayout><BookAppointment /></PatientLayout></ProtectedRoute>} />
      <Route path="/patient/appointments" element={<ProtectedRoute allowedRoles={['patient']}><PatientLayout><PatientAppointments /></PatientLayout></ProtectedRoute>} />
      <Route path="/patient/profile" element={<ProtectedRoute allowedRoles={['patient']}><PatientLayout><PatientProfile /></PatientLayout></ProtectedRoute>} />

      {/* PROTECTED ROUTES (Admin) */}
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><Navigate to="/admin/dashboard" replace /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/patients" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminPatients /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/appointments" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminAppointments /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/therapies" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminTherapies /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/inquiries" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminInquiries /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/profile" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminProfile /></AdminLayout></ProtectedRoute>} />

      {/* FALLBACK ROUTE */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default AppRoutes;
