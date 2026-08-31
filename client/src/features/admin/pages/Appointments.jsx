import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AppointmentCard from '../components/AppointmentCard';
import { Calendar } from 'lucide-react';
import { adminService } from '../services/adminService';
import toast from 'react-hot-toast';

import CalendarView from '../components/CalendarView';
import AppointmentDetailsModal from '../components/AppointmentDetailsModal';
import LoadingState from '../../../components/feedback/LoadingState';
import EmptyState from '../../../components/feedback/EmptyState';

export const Appointments = () => {
  const location = useLocation();
  const [viewMode, setViewMode] = useState(
    location.pathname.includes('calendar') ? 'calendar' : 'list'
  );
  const [appointmentsList, setAppointmentsList] = useState([]);
  const [filter, setFilter] = useState('All');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllAppointments();
      setAppointmentsList(data || []);
    } catch (error) {
      console.error('Failed to fetch appointments', error);
      toast.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    setViewMode(location.pathname.includes('calendar') ? 'calendar' : 'list');
  }, [location.pathname]);

  const handleUpdateStatus = async (id, status) => {
    if (!window.confirm(`Do you really want to change the status to ${status}?`)) return;
    try {
      if (status === 'confirmed') {
        await adminService.acceptAppointment(id);
      } else {
        await adminService.updateAppointmentStatus(id, status);
      }

      fetchAppointments();

      if (selectedAppointment && selectedAppointment._id === id) {
        setSelectedAppointment((prev) => ({ ...prev, status }));
      }
      toast.success(`Appointment marked as ${status}`);
    } catch (error) {
      console.error('Failed to update status', error);
      toast.error(error.message || 'Failed to update status');
    }
  };

  const handleCompleteSubmit = async (id, completeData) => {
    if (!window.confirm('Do you really want to mark this appointment as completed?')) return;
    try {
      await adminService.completeAppointment(id, completeData);
      fetchAppointments();
      setSelectedAppointment((prev) => ({ ...prev, status: 'completed' }));
      toast.success('Appointment marked as completed');
    } catch (error) {
      console.error('Failed to complete', error);
      toast.error('Failed to complete appointment');
    }
  };

  const handleMarkCashPaid = async (id, amount) => {
    try {
      await adminService.markCashPaid(id, amount);
      fetchAppointments();
      setSelectedAppointment((prev) => ({
        ...prev,
        paymentStatus: 'paid',
        amount,
        paymentMethod: 'cash',
      }));
      toast.success('Payment marked as cash successfully');
    } catch (error) {
      console.error('Failed to mark cash paid', error);
      toast.error(error.message || 'Failed to update payment status');
    }
  };

  const handleRescheduleSubmit = async (id, rescheduleData) => {
    if (!window.confirm('Do you really want to reschedule this appointment?')) return;
    try {
      const res = await adminService.updateAppointmentStatus(id, 'rescheduled', {
        date: rescheduleData.date,
        timeSlot: rescheduleData.timeSlot,
      });

      const updatedApp = res.data;

      setAppointmentsList((prev) =>
        prev.map((app) => (app._id === updatedApp._id ? updatedApp : app))
      );

      setSelectedAppointment(updatedApp);
      toast.success('Appointment rescheduled successfully');
    } catch (error) {
      console.error('Failed to reschedule', error);
      toast.error('Failed to reschedule appointment.');
    }
  };

  const filteredAppointments = appointmentsList.filter((app) => {
    if (filter === 'All') return true;
    return app.status?.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="space-y-8 relative max-w-7xl mx-auto pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center">
            <Calendar className="w-8 h-8 mr-3 text-emerald-600" />
            Appointments
          </h1>
          <p className="text-slate-500 mt-1 text-sm max-w-md leading-relaxed">
            Manage your clinic schedule, approve bookings, and update patient session notes.
          </p>
        </div>

        {/* View Toggles & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                viewMode === 'calendar'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Calendar View
            </button>
          </div>

          {viewMode === 'list' && (
            <div className="flex p-1 bg-slate-100/80 rounded-xl border border-slate-200/50 w-full sm:w-auto overflow-x-auto hide-scrollbar">
              {['All', 'Pending', 'Confirmed', 'Rescheduled', 'Completed', 'Cancelled'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
                    filter === f
                      ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/50'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                  }`}
                >
                  {f}
                  {f === 'Pending' &&
                    appointmentsList.filter((a) => a.status === 'pending').length > 0 && (
                      <span className="ml-1.5 inline-flex items-center justify-center bg-rose-500 text-white text-[10px] w-5 h-5 rounded-full font-bold">
                        {appointmentsList.filter((a) => a.status === 'pending').length}
                      </span>
                    )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'calendar' ? (
        <CalendarView
          onSelectAppointment={(app) => {
            setSelectedAppointment(app);
          }}
        />
      ) : loading ? (
        <LoadingState message="Loading schedule..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredAppointments.length === 0 ? (
            <div className="col-span-full">
              <EmptyState
                title="No Appointments Found"
                description={`There are no appointments matching the "${filter}" filter.`}
              />
            </div>
          ) : (
            filteredAppointments.map((app) => (
              <AppointmentCard
                key={app._id}
                appointment={app}
                onUpdateStatus={handleUpdateStatus}
                onViewDetails={() => {
                  setSelectedAppointment(app);
                }}
              />
            ))
          )}
        </div>
      )}

      {/* Details Modal */}
      <AppointmentDetailsModal
        selectedAppointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        onUpdateStatus={handleUpdateStatus}
        onRescheduleSubmit={handleRescheduleSubmit}
        onCompleteSubmit={handleCompleteSubmit}
        onMarkCashPaid={handleMarkCashPaid}
      />
    </div>
  );
};

export default Appointments;
