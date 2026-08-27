import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Admin Components & Pages
import Sidebar from '../features/admin/components/Sidebar';
import Navbar from '../features/admin/components/Navbar';
import Dashboard from '../features/admin/pages/Dashboard';
import AdminPatients from '../features/admin/pages/Patients';
import AdminAppointments from '../features/admin/pages/Appointments';
import AdminTherapies from '../features/admin/pages/Therapies';
import AdminLogin from '../features/auth/pages/AdminLogin';
import AdminProfile from '../features/admin/pages/Profile';
import AdminInquiries from '../features/admin/pages/Inquery';
import AdminSettings from '../features/admin/pages/Setting';

import PatientLogin from '../features/auth/pages/PatientLogin';
import PatientRegister from '../features/auth/pages/PatientRegister';

import BookAppointment from '../features/patient/pages/BookAppointment';
import PatientAppointments from '../features/patient/pages/Appointments';
import PatientProfile from '../features/patient/pages/Profile';

// Public Pages
import Home from '../features/public/pages/Home';
import About from '../features/public/pages/About';
import Contact from '../features/public/pages/Contact';
import Gallery from '../features/public/pages/Gallery';
import Panchakarma from '../features/public/pages/Panchakarma';
import Therapies from '../features/public/pages/Therapies';
import PrivacyPolicy from '../features/public/pages/PrivacyPolicy';
import TermsOfService from '../features/public/pages/TermsOfService';
import OnePageScroll from '../features/public/pages/OnePageScroll';

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

import PublicNavbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import PatientNavbar from '../features/patient/components/Navbar';
import PatientSidebar from '../features/patient/components/Sidebar';

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
      <section id="footer">
        <Footer />
      </section>
    </div>
  );
};

const AppRoutes = () => {

  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<PublicLayout><OnePageScroll /></PublicLayout>} />
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
      <Route path="/admin/appointment-calendar" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminAppointments /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/therapies" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminTherapies /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/inquiries" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminInquiries /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminSettings /></AdminLayout></ProtectedRoute>} />
      <Route path="/admin/profile" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout><AdminProfile /></AdminLayout></ProtectedRoute>} />

      {/* FALLBACK ROUTE */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default AppRoutes;
