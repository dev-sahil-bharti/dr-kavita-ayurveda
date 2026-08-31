import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  User,
  Users,
  Send,
  Activity,
  Phone,
  Mail,
  Clock,
  FileText,
  Upload,
  Briefcase,
  AlertCircle,
  Stethoscope,
  HeartPulse,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { patientService } from '../services/patientService';
import { formatDateForInput } from '../../../utils/formatters';
import { TIME_SLOTS, SERVICES_LIST } from '../../../utils/constants';
import Button from '../../../components/common/Button';

export const BookAppointment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const formattedToday = formatDateForInput();

  const [formData, setFormData] = useState({
    patientName: '',
    mobile: '',
    email: '',
    gender: '',
    consultationType: '',
    preferredService: '',
    age: '',
    occupation: '',
    urgency: 'Standard',
    date: formattedToday,
    timeSlot: '',
    reasonForVisit: '',
    isFirstVisit: 'Yes',
    reports: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Pre-fill user data if available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        patientName: user.name || '',
        mobile: user.mobile || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await patientService.bookAppointment(formData);

      setSuccess('Appointment booked successfully! We look forward to seeing you.');
      setTimeout(() => navigate('/patient/appointments'), 1800);
    } catch (err) {
      setError(err.message || 'Failed to book appointment.');
    } finally {
      setLoading(false);
    }
  };

  const inputClassName =
    'w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 text-slate-800 shadow-sm placeholder-slate-400 font-medium text-sm';
  const selectClassName =
    'w-full pl-11 pr-10 py-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 text-slate-800 shadow-sm appearance-none cursor-pointer font-medium text-sm';

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 font-sans">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 px-8 py-10 sm:px-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-400 opacity-20 blur-3xl pointer-events-none"></div>
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold flex items-center tracking-tight">
              <Calendar className="mr-4 h-9 w-9 text-emerald-200" />
              Book Consultation
            </h2>
            <p className="mt-2 text-emerald-100 text-base sm:text-lg font-light max-w-xl leading-relaxed">
              Schedule your next visit with our Ayurvedic specialists.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-6 sm:p-10 bg-slate-50/30">
          {error && (
            <div className="mb-6 bg-rose-50 text-rose-700 p-4 rounded-2xl border border-rose-100 flex items-start shadow-sm text-sm">
              <AlertCircle className="w-5 h-5 mr-3 shrink-0 text-rose-500" />
              <p className="font-medium">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-6 bg-emerald-50 text-emerald-700 p-4 rounded-2xl border border-emerald-100 flex items-start shadow-sm text-sm">
              <Activity className="w-5 h-5 mr-3 shrink-0 text-emerald-500" />
              <p className="font-medium">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Patient Details */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                  <User className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                  Patient Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Patient Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      name="patientName"
                      required
                      value={formData.patientName}
                      onChange={handleChange}
                      className={inputClassName}
                      placeholder="Enter patient full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Phone className="h-4 w-4" />
                    </div>
                    <input
                      type="tel"
                      name="mobile"
                      required
                      value={formData.mobile}
                      onChange={handleChange}
                      readOnly={!!user}
                      className={`${inputClassName} ${
                        user ? 'opacity-80 cursor-not-allowed bg-slate-100' : ''
                      }`}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      readOnly={!!user}
                      className={`${inputClassName} ${
                        user ? 'opacity-80 cursor-not-allowed bg-slate-100' : ''
                      }`}
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Gender *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Users className="h-4 w-4" />
                    </div>
                    <select
                      name="gender"
                      required
                      value={formData.gender}
                      onChange={handleChange}
                      className={selectClassName}
                    >
                      <option value="" disabled>
                        Select Gender
                      </option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Appointment Specifics */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">
                  Appointment Details
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Consultation Type *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Activity className="h-4 w-4" />
                    </div>
                    <select
                      name="consultationType"
                      value={formData.consultationType}
                      onChange={handleChange}
                      className={selectClassName}
                      required
                    >
                      <option value="" disabled>
                        Select Consultation Type
                      </option>
                      <option value="In-person">In-person Clinic Visit</option>
                      <option value="Online">Online Video Consultation</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Preferred Service *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <HeartPulse className="h-4 w-4" />
                    </div>
                    <select
                      name="preferredService"
                      value={formData.preferredService}
                      onChange={handleChange}
                      className={selectClassName}
                      required
                    >
                      <option value="" disabled>
                        Select Preferred Service
                      </option>
                      {SERVICES_LIST.map((srv) => (
                        <option key={srv} value={srv}>
                          {srv}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Patient Age *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="age"
                      required
                      min="1"
                      max="120"
                      value={formData.age}
                      onChange={handleChange}
                      className={inputClassName}
                      placeholder="Years"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Occupation *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Briefcase className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      name="occupation"
                      required
                      value={formData.occupation}
                      onChange={handleChange}
                      className={inputClassName}
                      placeholder="e.g. Teacher, Engineer"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Preferred Date *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <input
                      type="date"
                      name="date"
                      required
                      min={formattedToday}
                      value={formData.date}
                      onChange={handleChange}
                      className={inputClassName}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Preferred Time Slot *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Clock className="h-4 w-4" />
                    </div>
                    <select
                      name="timeSlot"
                      required
                      value={formData.timeSlot}
                      onChange={handleChange}
                      className={selectClassName}
                    >
                      <option value="" disabled>
                        Select a time slot
                      </option>
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* First Visit */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    First Visit to Dr. Kavita Ayurveda?
                  </label>
                  <div className="flex gap-4">
                    {['Yes', 'No'].map((choice) => (
                      <label
                        key={choice}
                        className={`flex items-center px-4 py-3 border-2 rounded-xl cursor-pointer transition-all flex-1 ${
                          formData.isFirstVisit === choice
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                            : 'border-slate-200 bg-white text-slate-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="isFirstVisit"
                          className="hidden"
                          checked={formData.isFirstVisit === choice}
                          onChange={() => setFormData({ ...formData, isFirstVisit: choice })}
                        />
                        <span>{choice === 'Yes' ? 'Yes, first time' : 'No, returning patient'}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Reason for Visit */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Reason for Visit / Symptoms
                  </label>
                  <div className="relative">
                    <div className="absolute top-3.5 left-4 pointer-events-none text-slate-400">
                      <FileText className="h-4 w-4" />
                    </div>
                    <textarea
                      name="reasonForVisit"
                      value={formData.reasonForVisit}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Describe your symptoms or medical concern..."
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-slate-800 font-medium text-sm resize-none"
                    />
                  </div>
                </div>

                {/* File Upload */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Medical Reports / Prescriptions <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <label className="relative border-2 border-dashed border-slate-300 rounded-2xl p-6 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all bg-slate-50 flex flex-col items-center justify-center cursor-pointer">
                    <input
                      type="file"
                      name="reports"
                      onChange={handleChange}
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx,.txt"
                    />
                    <Upload className="h-6 w-6 text-emerald-600 mb-2" />
                    <span className="text-sm font-semibold text-slate-700">
                      {formData.reports ? formData.reports.name : 'Upload Report or Document'}
                    </span>
                    {!formData.reports && (
                      <span className="text-xs text-slate-400 mt-1">Images, PDF up to 10MB</span>
                    )}
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                icon={Send}
                className="w-full sm:w-auto"
              >
                Confirm Booking
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
