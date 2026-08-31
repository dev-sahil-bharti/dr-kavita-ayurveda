import React, { useState } from 'react';
import { X, User, Phone, Mail, FileText, Calendar, Clock, Activity, CheckCircle, XCircle, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { ENV } from '../../../config/env';

const AppointmentDetailsModal = ({
  selectedAppointment,
  onClose,
  onUpdateStatus,
  onRescheduleSubmit,
  onCompleteSubmit,
  onMarkCashPaid
}) => {
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({ date: '', timeSlot: '' });
  
  const [isCompleting, setIsCompleting] = useState(false);
  const [completeData, setCompleteData] = useState({ doctorNote: '', followUpDate: '', sessionNumber: '', totalSessions: '' });

  const [isMarkingCash, setIsMarkingCash] = useState(false);
  const [cashAmount, setCashAmount] = useState('');

  // Confirmation states
  const [confirmAction, setConfirmAction] = useState(null);

  if (!selectedAppointment) return null;

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

  const handleActionClick = (action) => {
    setConfirmAction(action);
  };

  const executeAction = () => {
    if (confirmAction === 'reject') {
      onUpdateStatus(selectedAppointment._id, 'cancelled');
    } else if (confirmAction === 'confirm') {
      onUpdateStatus(selectedAppointment._id, 'confirmed');
    } else if (confirmAction === 'reschedule') {
      if (!rescheduleData.date || !rescheduleData.timeSlot) {
        toast.error("Please select both a new date and time slot.");
        return;
      }
      onRescheduleSubmit(selectedAppointment._id, rescheduleData);
    }
    setConfirmAction(null);
  };

  const handleComplete = () => {
    onCompleteSubmit(selectedAppointment._id, completeData);
  };

  const SERVER_URL = (ENV.API_URL || 'http://localhost:5000').replace(/\/api$/, '');

  return (
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
                {selectedAppointment.paymentStatus && (
                  <span className={`px-2 py-0.5 rounded-md border uppercase tracking-wider text-[10px] font-bold ${
                    selectedAppointment.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                    selectedAppointment.paymentStatus === 'unpaid' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                    'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                    {selectedAppointment.paymentStatus}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
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
                    <p className="text-sm font-bold text-blue-900">Patient Report Attached</p>
                    <p className="text-xs text-blue-700/80 mt-0.5">Click to view document.</p>
                  </div>
                </div>
                <a 
                  href={selectedAppointment.reportsFile.startsWith('http') ? selectedAppointment.reportsFile : `${SERVER_URL}/${selectedAppointment.reportsFile}`} 
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
           {confirmAction ? (
             <div className="w-full flex items-center justify-between bg-rose-50 p-3 rounded-xl border border-rose-100 animate-fade-in-up">
                <p className="text-sm text-rose-800 font-medium">Are you sure you want to proceed?</p>
                <div className="flex gap-2">
                  <button onClick={() => setConfirmAction(null)} className="px-4 py-2 text-sm bg-white text-slate-600 rounded-lg border border-slate-200 hover:bg-slate-50 font-bold">Cancel</button>
                  <button onClick={executeAction} className="px-4 py-2 text-sm bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-700">Confirm Action</button>
                </div>
             </div>
           ) : isCompleting ? (
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
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                  <button onClick={() => setIsCompleting(false)} className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors">Cancel</button>
                  <button onClick={handleComplete} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors">Submit & Complete</button>
                </div>
              </div>
           ) : isMarkingCash ? (
              <div className="w-full flex flex-col sm:flex-row items-center gap-3 animate-fade-in-up">
                <div className="flex-1 w-full">
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Amount Received (Rs)</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    placeholder="e.g. 500"
                  />
                </div>
                <div className="flex w-full sm:w-auto gap-2 sm:mt-5 ml-auto">
                  <button 
                    onClick={() => setIsMarkingCash(false)}
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      if (!cashAmount) return toast.error('Enter amount');
                      onMarkCashPaid(selectedAppointment._id, cashAmount);
                      setIsMarkingCash(false);
                    }}
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-orange-600 text-white hover:bg-orange-700 font-bold transition-colors shadow-lg shadow-orange-600/20"
                  >
                    Confirm Payment
                  </button>
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
                    onClick={() => handleActionClick('reschedule')}
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
                      onClick={() => handleActionClick('reject')}
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
                      onClick={() => handleActionClick('confirm')}
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
               {selectedAppointment.paymentStatus === 'unpaid' && selectedAppointment.status !== 'cancelled' && (
                  <button 
                    onClick={() => setIsMarkingCash(true)}
                    className="w-full sm:w-auto flex items-center justify-center text-sm font-bold px-6 py-3 rounded-xl bg-orange-600 text-white hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/20"
                  >
                    Mark Cash Paid
                  </button>
               )}
               {selectedAppointment.status !== 'pending' && (
                  <button 
                    onClick={onClose}
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
  );
};

export default AppointmentDetailsModal;
