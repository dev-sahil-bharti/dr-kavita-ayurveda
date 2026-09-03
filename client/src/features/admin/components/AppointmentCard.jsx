import React from 'react';
import { Clock, CheckCircle, XCircle, Eye, Calendar, Activity, MapPin, Phone } from 'lucide-react';
import Badge from '../../../components/common/Badge';
import { formatDate } from '../../../utils/formatters';

export const AppointmentCard = ({ appointment, onUpdateStatus, onViewDetails }) => {
  const patientName =
    appointment.patientName || appointment.patient?.name || 'Unknown Patient';
  const initials = patientName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="group bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col">
      {/* Top Header */}
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-50 to-teal-100 border border-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-base shadow-inner shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-slate-800 leading-tight truncate">
              {patientName}
            </h3>
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              <Badge status={appointment.status} size="sm" />
              {appointment.paymentStatus && (
                <Badge status={appointment.paymentStatus} size="sm" />
              )}
              {appointment.isFirstVisit && (
                <Badge variant="new" size="sm">
                  New
                </Badge>
              )}
              {appointment.urgency === 'Immediate' && (
                <Badge variant="urgent" size="sm">
                  Urgent
                </Badge>
              )}
              {(appointment.reportsFile || (appointment.documents && appointment.documents.length > 0)) && (
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider text-[10px] font-bold">
                  Report Attached
                </span>
              )}
            </div>
            {/* Quick Demographics */}
            <div className="flex items-center text-xs text-slate-500 mt-2 space-x-2 font-medium">
              {(appointment.age || appointment.gender) && (
                <span className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                  {appointment.gender ? appointment.gender.charAt(0) : ''}
                  {appointment.gender && appointment.age ? ', ' : ''}
                  {appointment.age ? `${appointment.age}y` : ''}
                </span>
              )}
              {appointment.mobile && (
                <span className="flex items-center bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                  <Phone className="w-3 h-3 mr-1 text-slate-400" /> {appointment.mobile}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Details */}
      <div className="space-y-3 mb-6 flex-1 text-sm">
        <div className="flex items-start">
          <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center mr-3 shrink-0 text-emerald-600">
            <Activity className="h-4 w-4" />
          </div>
          <div className="pt-1">
            <p className="font-semibold text-slate-700 leading-none">
              {appointment.preferredService || appointment.therapy}
            </p>
            <p className="text-xs text-slate-500 mt-1 flex items-center">
              <MapPin className="w-3 h-3 mr-1 inline text-slate-400" />{' '}
              {appointment.consultationType || 'In-person'}
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center mr-3 shrink-0 text-emerald-600">
            <Calendar className="h-4 w-4" />
          </div>
          <div className="pt-1">
            <p className="font-semibold text-slate-700 leading-none">
              {formatDate(appointment.date)}
            </p>
            <p className="text-xs text-slate-500 mt-1 flex items-center">
              <Clock className="w-3 h-3 mr-1 inline text-slate-400" />{' '}
              {appointment.timeSlot || 'Standard Timing'}
            </p>
          </div>
        </div>

        {/* Cancelled Summary on Admin Card */}
        {appointment.status === 'cancelled' && (
          <div className="p-3 bg-rose-50/90 rounded-2xl border border-rose-100 text-xs">
            <div className="flex items-center justify-between text-rose-800 font-bold mb-1">
              <span className="flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                Cancelled
              </span>
              <span className="text-[10px] uppercase font-bold text-rose-600 bg-white px-2 py-0.5 rounded-md border border-rose-200">
                {appointment.cancellation?.cancelledBy ? `By ${appointment.cancellation.cancelledBy}` : 'By Patient'}
              </span>
            </div>
            <p className="text-slate-700 font-medium truncate">
              <span className="text-slate-500">Reason:</span> {appointment.cancellation?.reason || appointment.cancelReason || 'Not specified'}
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
        {appointment.status === 'pending' ? (
          <div className="flex gap-2 flex-1">
            <button
              onClick={() => onUpdateStatus(appointment._id, 'confirmed')}
              className="flex-1 flex items-center justify-center text-xs font-bold px-3 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all shadow-sm group/btn"
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
            className="w-full flex items-center justify-center text-xs font-bold px-4 py-2.5 rounded-xl bg-slate-50 text-slate-700 hover:bg-emerald-600 hover:text-white transition-all shadow-sm group/btn"
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
