import React, { useState, useEffect } from 'react';
import AppointmentCard from '../../components/admin/AppointmentCard';
import { X, User, Phone, Mail, FileText, Calendar, Clock, Activity, CheckCircle, XCircle, MapPin, Loader2 } from 'lucide-react';
import api from '../../services/api';

const Appointments = () => {
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    const actionText = status === 'confirmed' ? 'accept' : 'reject';
    if (!window.confirm(`Do you really want to ${actionText} this appointment?`)) {
      return;
    }

    try {
      await api.put(`/appointments/${id}/status`, { status });
      setAppointmentsList(prev => 
        prev.map(app => app._id === id ? { ...app, status } : app)
      );
      if (selectedAppointment && selectedAppointment._id === id) {
        setSelectedAppointment(prev => ({ ...prev, status }));
      }
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const filteredAppointments = appointmentsList.filter(app => {
    if (filter === 'All') return true;
    return app.status.toLowerCase() === filter.toLowerCase();
  });

  const getStatusBadge = (status) => {
    const config = {
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      completed: 'bg-slate-100 text-slate-700 border-slate-200',
      cancelled: 'bg-rose-100 text-rose-700 border-rose-200',
    };
    const style = config[status] || config.pending;
    return <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${style}`}>{status}</span>;
  };

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
        
        {/* Modern Segmented Control for Filters */}
        <div className="flex p-1 bg-slate-100/80 backdrop-blur-sm rounded-xl border border-slate-200/50 w-full sm:w-auto overflow-x-auto hide-scrollbar">
          {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(f => (
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
      </div>

      {/* Grid Content */}
      {loading ? (
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
                onUpdateStatus={handleUpdateStatus} 
                onViewDetails={() => setSelectedAppointment(app)} 
              />
            ))
          )}
        </div>
      )}

      {/* Premium Glassmorphism Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-md transition-all">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-fade-in-up border border-white/20 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 sm:px-8 border-b border-slate-100 bg-white relative shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 leading-tight">
                    {selectedAppointment.patientName || selectedAppointment.patient?.name || 'Unknown Patient'}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(selectedAppointment.status)}
                    {selectedAppointment.isFirstVisit && (
                      <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase tracking-wider text-[10px] font-bold">
                        First Visit
                      </span>
                    )}
                    {selectedAppointment.urgency === 'Immediate' && (
                      <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 border border-rose-100 uppercase tracking-wider text-[10px] font-bold">
                        Urgent
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedAppointment(null)}
                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors absolute top-6 right-6"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body (Scrollable) */}
            <div className="p-6 sm:px-8 overflow-y-auto custom-scrollbar flex-1 space-y-8 bg-slate-50/50">
              
              {/* Grid for Contact & Booking */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Patient Details Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Patient Details</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Gender</p>
                        <p className="text-sm font-semibold text-slate-800">{selectedAppointment.gender || 'Not Provided'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Age</p>
                        <p className="text-sm font-semibold text-slate-800">{selectedAppointment.age ? `${selectedAppointment.age} Yrs` : 'Not Provided'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-slate-500 font-medium">Occupation</p>
                        <p className="text-sm font-semibold text-slate-800">{selectedAppointment.occupation || 'Not Provided'}</p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-100">
                      <div className="flex items-start mb-4">
                        <Phone className="w-4 h-4 mt-0.5 mr-3 text-emerald-500" />
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Mobile Number</p>
                          <p className="text-sm font-semibold text-slate-800">{selectedAppointment.mobile || selectedAppointment.patient?.mobile || 'Not Provided'}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Mail className="w-4 h-4 mt-0.5 mr-3 text-emerald-500" />
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Email Address</p>
                          <p className="text-sm font-semibold text-slate-800">{selectedAppointment.email || selectedAppointment.patient?.email || 'Not Provided'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Schedule Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Schedule</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Calendar className="w-4 h-4 mt-0.5 mr-3 text-indigo-500" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Date</p>
                        <p className="text-sm font-semibold text-slate-800">{new Date(selectedAppointment.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="w-4 h-4 mt-0.5 mr-3 text-indigo-500" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Time Slot</p>
                        <p className="text-sm font-semibold text-slate-800">{selectedAppointment.timeSlot || 'Not Specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Medical Details */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Medical Details</h3>
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                     <p className="text-xs text-slate-500 font-medium flex items-center"><Activity className="w-3 h-3 mr-1"/> Therapy Required</p>
                     <p className="text-sm font-bold text-slate-800 mt-1">{selectedAppointment.preferredService || selectedAppointment.therapy}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                     <p className="text-xs text-slate-500 font-medium flex items-center"><MapPin className="w-3 h-3 mr-1"/> Consultation Mode</p>
                     <p className="text-sm font-bold text-slate-800 mt-1">{selectedAppointment.consultationType || 'In-person'}</p>
                  </div>
                </div>

                {(selectedAppointment.reasonForVisit || selectedAppointment.message) && (
                  <div className="mb-5 p-4 bg-amber-50 rounded-xl border border-amber-100/50">
                    <p className="text-xs text-amber-700/70 font-bold uppercase tracking-wider mb-2 flex items-center">
                      <FileText className="w-3 h-3 mr-1.5" /> Reason for Visit
                    </p>
                    <p className="text-sm text-amber-900 leading-relaxed font-medium">
                      {selectedAppointment.reasonForVisit || selectedAppointment.message}
                    </p>
                  </div>
                )}

                {selectedAppointment.reportsFile && (
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mr-3 shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-blue-900">Patient Report/Prescription Attached</p>
                        <p className="text-xs text-blue-700/80 mt-0.5">Click to view or download the uploaded document.</p>
                      </div>
                    </div>
                    <a 
                      href={`http://localhost:5000/${selectedAppointment.reportsFile}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm text-center shadow-blue-600/20"
                    >
                      View Document
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-6 sm:px-8 border-t border-slate-100 bg-white flex flex-col sm:flex-row justify-end items-center gap-3 shrink-0">
               {selectedAppointment.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => handleUpdateStatus(selectedAppointment._id, 'cancelled')}
                      className="w-full sm:w-auto flex items-center justify-center text-sm font-bold px-6 py-3 rounded-xl bg-white text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors border border-slate-200 hover:border-rose-200"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Booking
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(selectedAppointment._id, 'confirmed')}
                      className="w-full sm:w-auto flex items-center justify-center text-sm font-bold px-6 py-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 border border-transparent"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Confirm Booking
                    </button>
                  </>
               )}
               {selectedAppointment.status !== 'pending' && (
                  <button 
                    onClick={() => setSelectedAppointment(null)}
                    className="w-full sm:w-auto flex items-center justify-center text-sm font-bold px-8 py-3 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                  >
                    Close
                  </button>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
