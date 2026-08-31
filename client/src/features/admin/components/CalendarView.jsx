import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, User, CheckCircle, Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminService } from '../services/adminService';
import apiClient from '../../../services/api/client';

export const CalendarView = ({ onSelectAppointment }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-CA'));
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [allAppointments, setAllAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllAppointments = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllAppointments();
      setAllAppointments(data || []);
    } catch (error) {
      console.error('Failed to fetch appointments for calendar:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAppointments();
  }, []);

  const handleCheckIn = async (id, e) => {
    e.stopPropagation();
    try {
      await apiClient.patch(`/admin/appointments/${id}/checkin`);
      fetchAllAppointments();
    } catch (error) {
      console.error('Failed to check in:', error);
    }
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  const selectedDateAppointments = allAppointments
    .filter((app) => {
      const appDate = new Date(app.date);
      const dateString = `${appDate.getFullYear()}-${String(appDate.getMonth() + 1).padStart(2, '0')}-${String(appDate.getDate()).padStart(2, '0')}`;
      return (
        dateString === selectedDate &&
        ['confirmed', 'completed'].includes(app.status?.toLowerCase())
      );
    })
    .sort((a, b) => (a.timeSlot || '').localeCompare(b.timeSlot || ''));

  const isToday = selectedDate === new Date().toLocaleDateString('en-CA');

  const renderCalendar = () => {
    const days = [];
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`blank-${i}`} className="p-2 sm:p-4 border border-transparent"></div>);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

      const dayAppointments = allAppointments.filter((app) => {
        const appDate = new Date(app.date);
        const appDateString = `${appDate.getFullYear()}-${String(appDate.getMonth() + 1).padStart(2, '0')}-${String(appDate.getDate()).padStart(2, '0')}`;
        return (
          appDateString === dateString &&
          ['confirmed', 'completed'].includes(app.status?.toLowerCase())
        );
      });

      const isSelected = selectedDate === dateString;
      const hasAppointments = dayAppointments.length > 0;
      const isCurrentDay = dateString === new Date().toLocaleDateString('en-CA');

      days.push(
        <button
          key={d}
          onClick={() => setSelectedDate(dateString)}
          className={`h-20 sm:h-24 p-2 flex flex-col justify-between items-start border rounded-xl transition-all overflow-hidden ${
            isSelected
              ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600 ring-offset-2 z-10 shadow-md'
              : hasAppointments
              ? 'border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100 shadow-sm'
              : 'border-slate-100 hover:bg-slate-50'
          }`}
        >
          <div className="w-full flex justify-between items-start">
            <span
              className={`text-sm font-bold w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full ${
                isCurrentDay
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : isSelected
                  ? 'text-emerald-800'
                  : 'text-slate-700'
              }`}
            >
              {d}
            </span>
            {hasAppointments && (
              <span className="bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
                {dayAppointments.length}
              </span>
            )}
          </div>
          {hasAppointments && (
            <div className="w-full mt-auto">
              <div className="flex -space-x-1 overflow-hidden mb-1">
                {dayAppointments.slice(0, 4).map((_, i) => (
                  <div
                    key={i}
                    className="inline-block h-2 w-2 rounded-full ring-1 ring-white bg-emerald-500"
                  />
                ))}
              </div>
              <p className="text-[9px] sm:text-[10px] text-emerald-800 font-bold truncate w-full text-left uppercase tracking-wider">
                Booked
              </p>
            </div>
          )}
        </button>
      );
    }

    return (
      <div className="w-full xl:w-2/3 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-center mb-6 px-2">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">
            {monthNames[month]} {year}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentMonth(new Date())}
              className="px-5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-sm font-bold text-slate-700 transition-colors"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider py-2"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">{days}</div>
      </div>
    );
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 mt-6 items-start">
      {renderCalendar()}

      {/* Selected Day's Appointments */}
      <div className="w-full xl:w-1/3 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sticky top-6">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
          <CalendarIcon className="w-5 h-5 mr-2 text-emerald-600" />
          {new Date(selectedDate).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'long',
            day: 'numeric',
          })}
        </h3>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          </div>
        ) : selectedDateAppointments.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
            <Clock className="w-10 h-10 mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-bold text-slate-500">No appointments</p>
            <p className="text-xs text-slate-400 mt-1">Select another highlighted date.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
            {selectedDateAppointments.map((app) => (
              <div
                key={app._id}
                onClick={() => onSelectAppointment(app)}
                className="flex flex-col p-4 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer bg-slate-50 hover:bg-white group"
              >
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
                  <div className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-lg flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {app.timeSlot?.split(' - ')[0] || 'Scheduled'}
                  </div>
                  {app.status === 'completed' && (
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-1 font-bold rounded-lg uppercase">
                      Completed
                    </span>
                  )}
                </div>

                <h4 className="text-base font-bold text-slate-800 mb-2 truncate">
                  {app.patientName || app.patient?.name || 'Patient'}
                </h4>

                <div className="space-y-1 mb-4">
                  <span className="flex items-center text-xs text-slate-500">
                    <Activity className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    {app.preferredService || app.therapy}
                  </span>
                  <span className="flex items-center text-xs text-slate-500">
                    <User className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    {app.consultationType || 'In-person'}
                  </span>
                </div>

                <div className="mt-auto">
                  {app.checkedIn ? (
                    <div className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50/80 px-3 py-2 rounded-xl border border-emerald-100 justify-center">
                      <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                      Checked in at{' '}
                      {new Date(app.checkedInAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  ) : (
                    isToday &&
                    app.status === 'confirmed' && (
                      <button
                        onClick={(e) => handleCheckIn(app._id, e)}
                        className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                      >
                        Check In Now
                      </button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;
