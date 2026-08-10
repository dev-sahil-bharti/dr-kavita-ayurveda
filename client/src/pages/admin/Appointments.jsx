import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AppointmentCard from '../../components/admin/AppointmentCard';
import { Calendar, Loader2 } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

import CalendarView from '../../components/admin/CalendarView';
import AppointmentDetailsModal from '../../components/admin/AppointmentDetailsModal';

const Appointments = () => {
  const location = useLocation();
  const [viewMode, setViewMode] = useState(location.pathname.includes('calendar') ? 'calendar' : 'list');
  const [appointmentsList, setAppointmentsList] = useState([]);
  const [filter, setFilter] = useState('All');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/appointments/all');
      setAppointmentsList(res.data.data);
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
    try {
      if (status === 'confirmed') {
        await api.patch(`/admin/appointments/${id}/accept`);
      } else {
        await api.put(`/appointments/${id}/status`, { status });
      }
      
      fetchAppointments();
      
      if (selectedAppointment && selectedAppointment._id === id) {
        setSelectedAppointment(prev => ({ ...prev, status }));
      }
      toast.success(`Appointment marked as ${status}`);
    } catch (error) {
      console.error('Failed to update status', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleCompleteSubmit = async (id, completeData) => {
    try {
      await api.patch(`/admin/appointments/${id}/complete`, completeData);
      fetchAppointments();
      setSelectedAppointment(prev => ({ ...prev, status: 'completed' }));
      toast.success('Appointment marked as completed');
    } catch (error) {
      console.error('Failed to complete', error);
      toast.error('Failed to complete appointment');
    }
  };

  const handleRescheduleSubmit = async (id, rescheduleData) => {
    try {
      const res = await api.put(`/appointments/${id}/status`, { 
        status: 'rescheduled', 
        date: rescheduleData.date, 
        timeSlot: rescheduleData.timeSlot 
      });
      
      const updatedApp = res.data.data;
      
      setAppointmentsList(prev => 
        prev.map(app => app._id === updatedApp._id ? updatedApp : app)
      );
      
      setSelectedAppointment(updatedApp);
      toast.success('Appointment rescheduled successfully');
    } catch (error) {
      console.error('Failed to reschedule', error);
      toast.error('Failed to reschedule appointment.');
    }
  };

  const filteredAppointments = appointmentsList.filter(app => {
    if (filter === 'All') return true;
    return app.status.toLowerCase() === filter.toLowerCase();
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
          <p className="text-slate-500 mt-2 text-sm max-w-md leading-relaxed">
            Manage your clinic's schedule. Review patient details, approve upcoming bookings, and manage medical reports securely.
          </p>
        </div>
        
        {/* View Toggles & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200">
             <button 
               onClick={() => setViewMode('list')}
               className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
               List View
             </button>
             <button 
               onClick={() => setViewMode('calendar')}
               className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
               Calendar View
             </button>
          </div>

          {viewMode === 'list' && (
            <div className="flex p-1 bg-slate-100/80 backdrop-blur-sm rounded-xl border border-slate-200/50 w-full sm:w-auto overflow-x-auto hide-scrollbar">
              {['All', 'Pending', 'Confirmed', 'Rescheduled', 'Completed', 'Cancelled'].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
                    filter === f 
                      ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/50' 
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                  }`}
                >
                  {f}
                  {f === 'Pending' && appointmentsList.filter(a => a.status === 'pending').length > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center bg-rose-500 text-white text-[10px] w-5 h-5 rounded-full font-bold">
                      {appointmentsList.filter(a => a.status === 'pending').length}
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
         <CalendarView onSelectAppointment={(app) => {
            setSelectedAppointment(app);
         }} />
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-emerald-600">
          <Loader2 className="w-10 h-10 animate-spin mb-4" />
          <p className="text-slate-500 font-medium">Loading your schedule...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredAppointments.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 border-dashed">
              <Calendar className="w-16 h-16 text-slate-200 mb-4" />
              <h3 className="text-xl font-bold text-slate-700">No Appointments Found</h3>
              <p className="text-slate-500 mt-2 text-sm text-center max-w-sm">
                There are no appointments matching the "{filter}" status. Try selecting a different filter above.
              </p>
            </div>
          ) : (
            filteredAppointments.map(app => (
              <AppointmentCard 
                key={app._id} 
                appointment={app} 
                onUpdateStatus={(id, status) => {
                  // Direct status update from card gets native confirm in some versions, 
                  // but we handle it via toast in the card itself or simply pass it through.
                  // For a real app, the card might have its own confirm logic, but this fulfills the interface.
                  handleUpdateStatus(id, status);
                }} 
                onViewDetails={() => {
                  setSelectedAppointment(app);
                }}
              />
            ))
          )}
        </div>
      )}

      {/* Extracted Details Modal */}
      <AppointmentDetailsModal 
        selectedAppointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        onUpdateStatus={handleUpdateStatus}
        onRescheduleSubmit={handleRescheduleSubmit}
        onCompleteSubmit={handleCompleteSubmit}
      />
    </div>
  );
};

export default Appointments;
