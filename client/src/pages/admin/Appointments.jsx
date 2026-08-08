import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AppointmentCard from '../../components/admin/AppointmentCard';
import { X, User, Phone, Mail, FileText, Calendar, Clock, Activity, CheckCircle, XCircle, MapPin, Loader2 } from 'lucide-react';
import api from '../../services/api';

import CalendarView from '../../components/admin/CalendarView';

const Appointments = () => {
  const location = useLocation();
  const [viewMode, setViewMode] = useState(location.pathname.includes('calendar') ? 'calendar' : 'list');
  const [appointmentsList, setAppointmentsList] = useState([]);
  const [filter, setFilter] = useState('All');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({ date: '', timeSlot: '' });
  
  // Complete Consultation State
  const [isCompleting, setIsCompleting] = useState(false);
  const [completeData, setCompleteData] = useState({ doctorNote: '', followUpDate: '', sessionNumber: '', totalSessions: '' });

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

  useEffect(() => {
    setViewMode(location.pathname.includes('calendar') ? 'calendar' : 'list');
  }, [location.pathname]);

  const handleUpdateStatus = async (id, status) => {
    const actionText = status === 'confirmed' ? 'accept' : 'reject';
    if (!window.confirm(`Do you really want to ${actionText} this appointment?`)) {
      return;
    }

    try {
      if (status === 'confirmed') {
        // Use the new accept endpoint
        await api.patch(`/admin/appointments/${id}/accept`);
      } else {
        // Use the old status update for reject
        await api.put(`/appointments/${id}/status`, { status });
      }
      
      fetchAppointments(); // Refresh the whole list to get updated data (like payment links)
      
      if (selectedAppointment && selectedAppointment._id === id) {
        setSelectedAppointment(prev => ({ ...prev, status }));
      }
    } catch (error) {
      console.error('Failed to update status', error);
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleCompleteSubmit = async () => {
    try {
      await api.patch(`/admin/appointments/${selectedAppointment._id}/complete`, completeData);
      fetchAppointments();
      setSelectedAppointment(prev => ({ ...prev, status: 'completed' }));
      setIsCompleting(false);
    } catch (error) {
      console.error('Failed to complete', error);
      alert('Failed to complete appointment');
    }
  };

  const handleRescheduleSubmit = async () => {
    if (!rescheduleData.date || !rescheduleData.timeSlot) {
      alert("Please select both a new date and time slot.");
      return;
    }
    
    if (!window.confirm("Confirm rescheduling this appointment?")) return;

    try {
      const res = await api.put(`/appointments/${selectedAppointment._id}/status`, { 
        status: 'rescheduled', 
        date: rescheduleData.date, 
        timeSlot: rescheduleData.timeSlot 
      });
      
      const updatedApp = res.data.data;
      
      setAppointmentsList(prev => 
        prev.map(app => app._id === updatedApp._id ? updatedApp : app)
      );
      
      setSelectedAppointment(updatedApp);
      setIsRescheduling(false);
    } catch (error) {
      console.error('Failed to reschedule', error);
      alert('Failed to reschedule appointment.');
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
      rescheduled: 'bg-indigo-100 text-indigo-700 border-indigo-200',
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
            setIsRescheduling(false);
            setIsCompleting(false);
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
                onUpdateStatus={handleUpdateStatus} 
                onViewDetails={() => {
                  setSelectedAppointment(app);
                  setIsRescheduling(false);
                }}
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
                onClick={() => {
                  setSelectedAppointment(null);
                  setIsRescheduling(false);
                  setIsCompleting(false);
                }}
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
                {selectedAppointment.paymentLink && (
                  <div className="mt-5 p-4 bg-emerald-50 rounded-xl border border-emerald-100/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-emerald-900">Payment Link Generated</p>
                      <p className="text-xs text-emerald-700/80 mt-0.5">Status: {selectedAppointment.paymentStatus.toUpperCase()}</p>
                    </div>
                    <a 
                      href={selectedAppointment.paymentLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors"
                    >
                      Open Payment Link
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-6 sm:px-8 border-t border-slate-100 bg-white flex flex-col sm:flex-row justify-end items-center gap-3 shrink-0">
               {isCompleting ? (
                  <div className="w-full flex flex-col gap-4 animate-fade-in-up">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 mb-1 block">Doctor's Note</label>
                        <textarea 
                          className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 h-24"
                          placeholder="Prescription / Advice..."
                          value={completeData.doctorNote}
                          onChange={(e) => setCompleteData({...completeData, doctorNote: e.target.value})}
                        ></textarea>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-bold text-slate-500 mb-1 block">Next Follow-up Date (Optional)</label>
                          <input 
                            type="date"
                            className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
                            value={completeData.followUpDate}
                            onChange={(e) => setCompleteData({...completeData, followUpDate: e.target.value})}
                          />
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <label className="text-[10px] font-bold text-slate-500 mb-1 block">Session #</label>
                            <input type="number" className="w-full p-2 border border-slate-200 rounded-lg outline-none" placeholder="e.g. 1" value={completeData.sessionNumber} onChange={e => setCompleteData({...completeData, sessionNumber: e.target.value})} />
                          </div>
                          <div className="flex-1">
                            <label className="text-[10px] font-bold text-slate-500 mb-1 block">Total Sessions</label>
                            <input type="number" className="w-full p-2 border border-slate-200 rounded-lg outline-none" placeholder="e.g. 7" value={completeData.totalSessions} onChange={e => setCompleteData({...completeData, totalSessions: e.target.value})} />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-2">
                      <button onClick={() => setIsCompleting(false)} className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold">Cancel</button>
                      <button onClick={handleCompleteSubmit} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700">Submit & Complete</button>
                    </div>
                  </div>
               ) : isRescheduling ? (
                  <div className="w-full flex flex-col sm:flex-row items-center gap-3 animate-fade-in-up">
                    <input 
                      type="date" 
                      className="w-full sm:w-auto px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      value={rescheduleData.date}
                      onChange={(e) => setRescheduleData({...rescheduleData, date: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <select 
                      className="w-full sm:w-auto px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                      value={rescheduleData.timeSlot}
                      onChange={(e) => setRescheduleData({...rescheduleData, timeSlot: e.target.value})}
                    >
                      <option value="">Select Time</option>
                      <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                      <option value="11:30 AM - 12:30 PM">11:30 AM - 12:30 PM</option>
                      <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                      <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
                      <option value="06:00 PM - 07:00 PM">06:00 PM - 07:00 PM</option>
                    </select>
                    
                    <div className="flex w-full sm:w-auto gap-2 ml-auto">
                      <button 
                        onClick={() => setIsRescheduling(false)}
                        className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleRescheduleSubmit}
                        className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 font-bold transition-colors shadow-lg shadow-indigo-600/20"
                      >
                        Confirm New Time
                      </button>
                    </div>
                  </div>
               ) : (
                 <>
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
                          onClick={() => setIsRescheduling(true)}
                          className="w-full sm:w-auto flex items-center justify-center text-sm font-bold px-6 py-3 rounded-xl bg-white text-indigo-600 hover:bg-indigo-50 transition-colors border border-indigo-200"
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          Reschedule
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
                   {(selectedAppointment.status === 'confirmed' || selectedAppointment.status === 'rescheduled') && (
                      <button 
                        onClick={() => setIsCompleting(true)}
                        className="w-full sm:w-auto flex items-center justify-center text-sm font-bold px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                      >
                        <Activity className="w-4 h-4 mr-2" />
                        Complete Consultation
                      </button>
                   )}
                   {selectedAppointment.status !== 'pending' && (
                      <button 
                        onClick={() => {
                          setSelectedAppointment(null);
                          setIsRescheduling(false);
                          setIsCompleting(false);
                        }}
                        className="w-full sm:w-auto flex items-center justify-center text-sm font-bold px-8 py-3 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                      >
                        Close
                      </button>
                   )}
                 </>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
