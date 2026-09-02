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
      days.push(<div key={`blank-${i}`} className="p-1 sm:p-2 border border-transparent"></div>);
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
          type="button"
          onClick={() => setSelectedDate(dateString)}
          className={`min-h-[58px] sm:min-h-[82px] md:min-h-[96px] p-1 sm:p-2 md:p-2.5 flex flex-col justify-between items-start border rounded-xl sm:rounded-2xl transition-all overflow-hidden relative group text-left ${
            isSelected
              ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600 ring-offset-1 sm:ring-offset-2 z-10 shadow-md'
              : hasAppointments
              ? 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70 shadow-sm'
              : 'border-slate-100 hover:bg-slate-50 hover:border-slate-200'
          }`}
        >
          <div className="w-full flex justify-between items-center sm:items-start gap-1">
            <span
              className={`text-xs sm:text-sm font-bold w-5 h-5 sm:w-7 sm:h-7 flex items-center justify-center rounded-full transition-colors ${
                isCurrentDay
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : isSelected
                  ? 'bg-emerald-700 text-white sm:bg-transparent sm:text-emerald-800'
                  : 'text-slate-700 group-hover:text-slate-900'
              }`}
            >
              {d}
            </span>
            {hasAppointments && (
              <span className="bg-emerald-600 text-white text-[9px] sm:text-[10px] font-bold px-1 sm:px-1.5 py-0.2 sm:py-0.5 rounded-md shadow-sm shrink-0">
                {dayAppointments.length}
              </span>
            )}
          </div>

          {hasAppointments && (
            <div className="w-full mt-1 sm:mt-auto">
              {/* Indicator dots */}
              <div className="flex -space-x-0.5 sm:-space-x-1 overflow-hidden mb-0.5 sm:mb-1">
                {dayAppointments.slice(0, 3).map((_, i) => (
                  <div
                    key={i}
                    className="inline-block h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ring-1 ring-white bg-emerald-500"
                  />
                ))}
                {dayAppointments.length > 3 && (
                  <span className="text-[8px] text-emerald-700 font-bold pl-1 hidden sm:inline">
                    +{dayAppointments.length - 3}
                  </span>
                )}
              </div>
              <p className="hidden sm:block text-[9px] md:text-[10px] text-emerald-800 font-bold truncate w-full uppercase tracking-wider">
                {dayAppointments.length === 1 ? '1 Slot' : `${dayAppointments.length} Slots`}
              </p>
            </div>
          )}
        </button>
      );
    }

    return (
      <div className="w-full xl:w-2/3 bg-white p-3.5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm">
        {/* Month Navigation Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-800 tracking-tight">
              {monthNames[month]} {year}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
              Click a date to view appointments and check in patients
            </p>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 sm:p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors focus:outline-none"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentMonth(new Date())}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs sm:text-sm font-bold text-slate-700 transition-colors focus:outline-none"
            >
              Today
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 sm:p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors focus:outline-none"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-1.5 sm:mb-2 border-b border-slate-100 pb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-center text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider py-1"
            >
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.charAt(0)}</span>
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">{days}</div>
      </div>
    );
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 mt-4 sm:mt-6 items-start w-full">
      {renderCalendar()}

      {/* Selected Day's Appointments Side Panel */}
      <div className="w-full xl:w-1/3 bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm p-4 sm:p-6 xl:sticky xl:top-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 border-b border-slate-100">
          <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center">
            <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-emerald-600 shrink-0" />
            <span className="truncate">
              {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </h3>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full shrink-0">
            {selectedDateAppointments.length} {selectedDateAppointments.length === 1 ? 'Appt' : 'Appts'}
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          </div>
        ) : selectedDateAppointments.length === 0 ? (
          <div className="text-center py-12 sm:py-16 bg-slate-50 rounded-2xl border border-slate-100 border-dashed p-4">
            <Clock className="w-8 h-8 sm:w-10 sm:h-10 mx-auto text-slate-300 mb-2 sm:mb-3" />
            <p className="text-sm font-bold text-slate-600">No appointments scheduled</p>
            <p className="text-xs text-slate-400 mt-1">Select a highlighted date to inspect bookings.</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4 max-h-[480px] sm:max-h-[580px] xl:max-h-[640px] overflow-y-auto custom-scrollbar pr-1">
            {selectedDateAppointments.map((app) => (
              <div
                key={app._id}
                onClick={() => onSelectAppointment(app)}
                className="flex flex-col p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer bg-slate-50 hover:bg-white group"
              >
                <div className="flex items-center justify-between mb-2.5 border-b border-slate-100 pb-2.5">
                  <div className="bg-emerald-100/80 text-emerald-800 text-xs font-bold px-2 py-1 rounded-lg flex items-center">
                    <Clock className="w-3 h-3 mr-1 shrink-0" />
                    {app.timeSlot?.split(' - ')[0] || 'Scheduled'}
                  </div>
                  {app.status === 'completed' && (
                    <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 font-bold rounded-md uppercase">
                      Completed
                    </span>
                  )}
                </div>

                <h4 className="text-sm sm:text-base font-bold text-slate-800 mb-1.5 truncate group-hover:text-emerald-800 transition-colors">
                  {app.patientName || app.patient?.name || 'Patient'}
                </h4>

                <div className="space-y-1 mb-3">
                  <span className="flex items-center text-xs text-slate-500 truncate">
                    <Activity className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                    {app.preferredService || app.therapy || 'Consultation'}
                  </span>
                  <span className="flex items-center text-xs text-slate-500">
                    <User className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                    {app.consultationType || 'In-person'}
                  </span>
                </div>

                <div className="mt-auto pt-1">
                  {app.checkedIn ? (
                    <div className="flex items-center text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 justify-center">
                      <CheckCircle className="w-3.5 h-3.5 mr-1.5 shrink-0" />
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
                        type="button"
                        onClick={(e) => handleCheckIn(app._id, e)}
                        className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm focus:outline-none"
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
