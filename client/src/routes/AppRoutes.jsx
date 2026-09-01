import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LoadingState from '../components/feedback/LoadingState';

// Layouts
import AdminLayout from '../layouts/AdminLayout';
import PatientLayout from '../layouts/PatientLayout';
import PublicLayout from '../layouts/PublicLayout';

// Public Pages (Lazy Loaded)
const About = lazy(() => import('../features/public/pages/About'));
const Contact = lazy(() => import('../features/public/pages/Contact'));
const Gallery = lazy(() => import('../features/public/pages/Gallery'));
const Panchakarma = lazy(() => import('../features/public/pages/Panchakarma'));
const Therapies = lazy(() => import('../features/public/pages/Therapies'));
const PrivacyPolicy = lazy(() => import('../features/public/pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('../features/public/pages/TermsOfService'));
const OnePageScroll = lazy(() => import('../features/public/pages/OnePageScroll'));

// Auth Pages (Lazy Loaded)
const AdminLogin = lazy(() => import('../features/auth/pages/AdminLogin'));
const PatientLogin = lazy(() => import('../features/auth/pages/PatientLogin'));
const PatientRegister = lazy(() => import('../features/auth/pages/PatientRegister'));

// Patient Pages (Lazy Loaded)
const BookAppointment = lazy(() => import('../features/patient/pages/BookAppointment'));
const PatientAppointments = lazy(() => import('../features/patient/pages/Appointments'));
const PatientProfile = lazy(() => import('../features/patient/pages/Profile'));

// Admin Pages (Lazy Loaded)
const Dashboard = lazy(() => import('../features/admin/pages/Dashboard'));
const AdminPatients = lazy(() => import('../features/admin/pages/Patients'));
const AdminAppointments = lazy(() => import('../features/admin/pages/Appointments'));
const AdminTherapies = lazy(() => import('../features/admin/pages/Therapies'));
const AdminInquiries = lazy(() => import('../features/admin/pages/Inquery'));
const AdminSettings = lazy(() => import('../features/admin/pages/Setting'));
const AdminProfile = lazy(() => import('../features/admin/pages/Profile'));

const PageLoader = () => (
  <LoadingState fullScreen message="Loading page..." />
);

export const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route
          path="/home"
          element={
            <PublicLayout>
              <OnePageScroll />
            </PublicLayout>
          }
        />
        <Route
          path="/panchakarma"
          element={
            <PublicLayout>
              <Panchakarma />
            </PublicLayout>
          }
        />
        <Route
          path="/therapies"
          element={
            <PublicLayout>
              <Therapies />
            </PublicLayout>
          }
        />
        <Route
          path="/about"
          element={
            <PublicLayout>
              <About />
            </PublicLayout>
          }
        />
        <Route
          path="/gallery"
          element={
            <PublicLayout>
              <Gallery />
            </PublicLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <PublicLayout>
              <Contact />
            </PublicLayout>
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <PublicLayout>
              <PrivacyPolicy />
            </PublicLayout>
          }
        />
        <Route
          path="/terms-of-service"
          element={
            <PublicLayout>
              <TermsOfService />
            </PublicLayout>
          }
        />

        {/* PUBLIC BOOKING ALIASES */}
        <Route path="/book" element={<Navigate to="/patient/book" replace />} />
        <Route path="/book-appointment" element={<Navigate to="/patient/book" replace />} />
        <Route path="/booking" element={<Navigate to="/patient/book" replace />} />

        {/* AUTH ROUTES */}
        <Route path="/patient/login" element={<PatientLogin />} />
        <Route path="/patient/register" element={<PatientRegister />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* PROTECTED PATIENT ROUTES */}
        <Route
          path="/patient"

          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientLayout>
                <Navigate to="/patient/appointments" replace />
              </PatientLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/book"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientLayout>
                <BookAppointment />
              </PatientLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/appointments"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientLayout>
                <PatientAppointments />
              </PatientLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/profile"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientLayout>
                <PatientProfile />
              </PatientLayout>
            </ProtectedRoute>
          }
        />

        {/* PROTECTED ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <Navigate to="/admin/dashboard" replace />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/patients"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <AdminPatients />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/appointments"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <AdminAppointments />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/appointment-calendar"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <AdminAppointments />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/therapies"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <AdminTherapies />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/inquiries"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <AdminInquiries />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <AdminSettings />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout>
                <AdminProfile />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
