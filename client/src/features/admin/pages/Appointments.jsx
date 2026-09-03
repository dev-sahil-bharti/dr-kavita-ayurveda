import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AppointmentCard from '../components/AppointmentCard';
import { Calendar, Search, RefreshCw, Filter } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAppointments = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);
      const data = await adminService.getAllAppointments();
      setAppointmentsList(data || []);
      if (isManualRefresh) toast.success('Appointments refreshed');
    } catch (error) {
      console.error('Failed to fetch appointments', error);
      toast.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
      setRefreshing(false);
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

  const filterTabs = ['All', 'Pending', 'Confirmed', 'Rescheduled', 'Completed', 'Cancelled'];

  const getStatusCount = (statusTab) => {
    if (statusTab === 'All') return appointmentsList.length;
    return appointmentsList.filter((a) => a.status?.toLowerCase() === statusTab.toLowerCase()).length;
  };

  const filteredAppointments = appointmentsList.filter((app) => {
    const matchesFilter =
      filter === 'All' ? true : app.status?.toLowerCase() === filter.toLowerCase();

    if (!matchesFilter) return false;

    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase().trim();
    const patientName = (app.patientName || app.patient?.name || '').toLowerCase();
    const mobile = (app.mobile || app.patient?.mobile || '').toLowerCase();
    const email = (app.email || app.patient?.email || '').toLowerCase();
    const service = (app.preferredService || app.therapy || '').toLowerCase();
    const reason = (app.reasonForVisit || app.message || '').toLowerCase();

    return (
      patientName.includes(q) ||
      mobile.includes(q) ||
      email.includes(q) ||
      service.includes(q) ||
      reason.includes(q)
    );
  });

  return (
    <div className="space-y-6 relative max-w-7xl mx-auto pb-12">
      {/* Header Section */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center">
            <Calendar className="w-8 h-8 mr-3 text-emerald-600" />
            Appointments
          </h1>
          <p className="text-slate-500 mt-1 text-sm max-w-lg leading-relaxed">
            Manage clinic appointments, patient consultations, schedule changes, and uploaded medical reports.
          </p>
        </div>

        {/* View Toggles & Refresh */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => fetchAppointments(true)}
            disabled={refreshing}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-1.5 text-xs font-bold"
            title="Refresh Appointments"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-emerald-600' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                viewMode === 'calendar'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Calendar View
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar (Only shown in List View) */}
      {viewMode === 'list' && (
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Status Tabs */}
          <div className="flex p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/60 overflow-x-auto hide-scrollbar gap-1">
            {filterTabs.map((f) => {
              const count = getStatusCount(f);
              const isActive = filter === f;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/50'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                  }`}
                >
                  {f}
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                      isActive
                        ? 'bg-emerald-100 text-emerald-800'
                        : f === 'Pending' && count > 0
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px] md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by patient, phone, service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>

        </div>
      )}

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
                description={
                  searchQuery
                    ? `No appointments found matching "${searchQuery}".`
                    : `There are no appointments matching the "${filter}" filter.`
                }
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

