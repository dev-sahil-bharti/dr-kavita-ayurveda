import React from 'react';
import { Clock, User, CheckCircle, XCircle, Eye, Calendar, Activity, MapPin, Phone } from 'lucide-react';

const AppointmentCard = ({ appointment, onUpdateStatus, onViewDetails }) => {
  const statusConfig = {
    pending: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
    confirmed: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
    completed: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
    cancelled: { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' },
  };

  const currentStatus = statusConfig[appointment.status] || statusConfig.pending;

  const patientName = appointment.patientName || appointment.patient?.name || 'Unknown Patient';
  const initials = patientName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <div className="group bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col">
      {/* Decorative top gradient line based on status */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${currentStatus.bg.replace('100', '400')}`} />
      
      {/* Header section with User Info and Status */}
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-50 to-teal-100 border border-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg shadow-inner">
            {initials}
          </div>
          <div>
            <h3 className="text-[17px] font-bold text-slate-800 leading-tight">
              {patientName}
            </h3>
            <div className="flex items-center text-xs font-medium text-slate-500 mt-1 space-x-2">
              <span className={`px-2 py-0.5 rounded-md border ${currentStatus.bg} ${currentStatus.text} ${currentStatus.border} uppercase tracking-wider text-[10px]`}>
                {appointment.status}
              </span>
              {appointment.isFirstVisit && (
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase tracking-wider text-[10px]">
                  New
                </span>
              )}
              {appointment.urgency === 'Immediate' && (
                <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-600 border border-rose-100 uppercase tracking-wider text-[10px]">
                  Urgent
                </span>
              )}
            </div>
            {/* Quick Demographics */}
            <div className="flex items-center text-xs text-slate-500 mt-1.5 space-x-2 font-medium">
              {(appointment.age || appointment.gender) && (
                <span className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                  {appointment.gender ? appointment.gender.charAt(0) : ''}{appointment.gender && appointment.age ? ', ' : ''}{appointment.age ? `${appointment.age}y` : ''}
                </span>
              )}
              {appointment.mobile && (
                <span className="flex items-center bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                  <Phone className="w-3 h-3 mr-1" /> {appointment.mobile}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Appointment Details */}
      <div className="space-y-3 mb-6 flex-1">
        <div className="flex items-start text-sm">
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center mr-3 shrink-0">
            <Activity className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="pt-1.5">
            <p className="font-semibold text-slate-700 leading-none">{appointment.preferredService || appointment.therapy}</p>
            <p className="text-xs text-slate-500 mt-1 flex items-center">
               <MapPin className="w-3 h-3 mr-1 inline"/> {appointment.consultationType || 'In-person'}
            </p>
          </div>
        </div>
        
        <div className="flex items-start text-sm">
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center mr-3 shrink-0">
            <Calendar className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="pt-1.5">
            <p className="font-semibold text-slate-700 leading-none">{new Date(appointment.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
            <p className="text-xs text-slate-500 mt-1 flex items-center">
               <Clock className="w-3 h-3 mr-1 inline"/> {appointment.timeSlot || new Date(appointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
        {appointment.status === 'pending' ? (
          <div className="flex gap-2 flex-1">
            <button 
              onClick={() => onUpdateStatus(appointment._id, 'confirmed')}
              className="flex-1 flex items-center justify-center text-sm font-semibold px-3 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all shadow-sm group/btn"
            >
              <CheckCircle className="w-4 h-4 mr-1.5 group-hover/btn:scale-110 transition-transform" />
              Accept
            </button>
            <button 
              onClick={() => onUpdateStatus(appointment._id, 'cancelled')}
              className="flex-none flex items-center justify-center px-3 py-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
              title="Reject"
            >
              <XCircle className="w-4 h-4" />
            </button>
            <button 
              onClick={onViewDetails}
              className="flex-none flex items-center justify-center px-3 py-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-800 hover:text-white transition-all shadow-sm"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button 
            onClick={onViewDetails}
            className="w-full flex items-center justify-center text-sm font-semibold px-4 py-2.5 rounded-xl bg-slate-50 text-slate-700 hover:bg-emerald-600 hover:text-white transition-all shadow-sm group/btn"
          >
            <Eye className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
            View Full Details
          </button>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
