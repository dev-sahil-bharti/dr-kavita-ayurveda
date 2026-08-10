import React, { useState, useEffect } from 'react';
import { Calendar, User, Users, Send, Activity, Phone, Mail, Clock, FileText, Upload, Briefcase, AlertCircle, Stethoscope, HeartPulse } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BookAppointment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
    date: '',
    timeSlot: '',
    reasonForVisit: '',
    isFirstVisit: 'Yes',
    reports: null // For file upload
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');



  // Pre-fill user data if available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        patientName: user.name || '',
        mobile: user.mobile || '',
        email: user.email || ''
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
      // Use FormData to support potential file uploads
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });

      // Sending multipart/form-data for file upload support
      await api.post('/appointments/book', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('Appointment booked successfully! We will see you soon.');
      setTimeout(() => navigate('/patient/appointments'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment.');
    } finally {
      setLoading(false);
    }
  };

  const inputClassName = "w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 text-slate-700 shadow-sm placeholder-slate-400 font-medium";
  const selectClassName = "w-full pl-11 pr-10 py-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 text-slate-700 shadow-sm appearance-none cursor-pointer font-medium";

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6 font-sans">
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden transition-all duration-300">

        {/* Header Section */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-600 px-8 py-12 sm:px-12 text-white relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-400 opacity-20 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-emerald-900 opacity-20 blur-3xl pointer-events-none"></div>
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold flex items-center tracking-tight">
              <Calendar className="mr-4 h-10 w-10 text-emerald-200" />
              Book an Appointment
            </h2>
            <p className="mt-4 text-emerald-100/90 text-lg sm:text-xl font-medium max-w-xl leading-relaxed">
              Welcome back{user?.name ? `, ${user.name}` : ''}. Schedule your next visit with our Ayurvedic specialists.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8 sm:p-12 bg-slate-50/30">
          {error && (
            <div className="mb-8 bg-red-50 text-red-700 p-4 sm:p-5 rounded-2xl border border-red-100 flex items-start shadow-sm">
              <AlertCircle className="w-6 h-6 mr-3 shrink-0 text-red-500" />
              <p className="font-medium">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-8 bg-emerald-50 text-emerald-700 p-4 sm:p-5 rounded-2xl border border-emerald-100 flex items-start shadow-sm">
              <Activity className="w-6 h-6 mr-3 shrink-0 text-emerald-500" />
              <p className="font-medium">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-12">

            {/* --- Personal Details Section --- */}
            <div className="space-y-6 relative">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">Patient Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {/* Patient Name */}
                <div className="group">
                  <label className="block text-sm font-bold text-slate-700 mb-2.5 ml-1">Patient Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      name="patientName"
                      required
                      value={formData.patientName}
                      onChange={handleChange}
                      className={inputClassName}
                      placeholder="Enter patient's full name"
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="group">
                  <label className="block text-sm font-bold text-slate-700 mb-2.5 ml-1">Mobile Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <input
                      type="tel"
                      name="mobile"
                      required
                      value={formData.mobile}
                      onChange={handleChange}
                      readOnly={!!user}
                      className={`${inputClassName} ${user ? 'opacity-70 cursor-not-allowed bg-slate-100' : ''}`}
                      placeholder="e.g. +91 9876543210"
                    />
                  </div>
                </div>

                {/* Email (Optional) */}
                <div className="group">
                  <label className="block text-sm font-bold text-slate-700 mb-2.5 ml-1">Email Address </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      readOnly={!!user}
                      className={`${inputClassName} ${user ? 'opacity-70 cursor-not-allowed bg-slate-100' : ''}`}
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div className="group relative">
                  <label className="block text-sm font-bold text-slate-700 mb-2.5 ml-1">Gender</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Users className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <select
                      name="gender"
                      required
                      value={formData.gender}
                      onChange={handleChange}
                      className={selectClassName}
                    >
                      <option value="" disabled>Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                    {/* Custom Dropdown Arrow */}
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle Divider */}
            <hr className="border-slate-100" />

            {/* --- Appointment Details Section --- */}
            <div className="space-y-6 relative">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 tracking-tight">Appointment Details</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">

                {/* Consultation Type */}
                <div className="group relative">
                  <label className="block text-sm font-bold text-slate-700 mb-2.5 ml-1">Consultation Type</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Activity className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <select
                      name="consultationType"
                      value={formData.consultationType}
                      onChange={handleChange}
                      className={selectClassName}
                      required
                    >
                      <option value="" disabled>Select Consultation Type</option>
                      <option value="In-person">In-person Visit</option>
                      <option value="Online">Online Video Consultation</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                {/* Preferred Service */}
                <div className="group relative">
                  <label className="block text-sm font-bold text-slate-700 mb-2.5 ml-1">Preferred Service</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <HeartPulse className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <select
                      name="preferredService"
                      value={formData.preferredService}
                      onChange={handleChange}
                      className={selectClassName}
                      required
                    >
                      <option value="" disabled>Select Preferred Service</option>
                      <option value="General Consultation">General Consultation</option>
                      <option value="Nadi Pariksha">Nadi Pariksha</option>
                      <option value="Panchkarma">Panchkarma</option>
                      <option value="Twacha Rog Chikitsa">Twacha Rog Chikitsa</option>
                      <option value="Joint Pain Treatment">Joint Pain Treatment</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                {/* Age */}
                <div className="group">
                  <label className="block text-sm font-bold text-slate-700 mb-2.5 ml-1">Patient Age</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-slate-400 font-bold group-focus-within:text-emerald-500 transition-colors">#</span>
                    </div>
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

                {/* Occupation */}
                <div className="group">
                  <label className="block text-sm font-bold text-slate-700 mb-2.5 ml-1">Occupation</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      name="occupation"
                      required
                      value={formData.occupation}
                      onChange={handleChange}
                      className={inputClassName}
                      placeholder="e.g. Software Engineer, Teacher"
                    />
                  </div>
                </div>

                {/* Urgency */}
                <div className="group relative">
                  <label className="block text-sm font-bold text-slate-700 mb-2.5 ml-1">Appointment Urgency</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <select
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleChange}
                      className={selectClassName}
                    >
                      <option value="Standard">Standard (Regular Appointment)</option>
                      <option value="Immediate">Immediate (Urgent Consultation)</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                {/* Preferred Date */}
                <div className="group">
                  <label className="block text-sm font-bold text-slate-700 mb-2.5 ml-1">Preferred Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <input
                      type="date"
                      name="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.date}
                      onChange={handleChange}
                      className={inputClassName}
                    />
                  </div>
                </div>

                {/* Preferred Time Slot */}
                <div className="group relative">
                  <label className="block text-sm font-bold text-slate-700 mb-2.5 ml-1">Preferred Time Slot</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <select
                      name="timeSlot"
                      required
                      value={formData.timeSlot}
                      onChange={handleChange}
                      className={selectClassName}
                    >
                      <option value="" disabled>Select a time slot</option>
                      <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                      <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                      <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                      <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                      <option value="03:00 PM - 04:00 PM">03:00 PM - 04:00 PM</option>
                      <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                {/* First Visit? - Checkbox Style */}
                <div className="md:col-span-2 mt-2">
                  <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Is this your first visit to Dr. Kavita Ayurveda?</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 flex-1 ${formData.isFirstVisit === 'Yes' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                      <div className={`flex items-center justify-center w-6 h-6 rounded-md border-2 mr-3 transition-colors duration-200 shadow-sm ${formData.isFirstVisit === 'Yes' ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white'}`}>
                        <svg className={`w-3.5 h-3.5 text-white transition-transform duration-200 ${formData.isFirstVisit === 'Yes' ? 'scale-100' : 'scale-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <input
                        type="radio"
                        name="isFirstVisit"
                        className="hidden"
                        checked={formData.isFirstVisit === 'Yes'}
                        onChange={() => setFormData({ ...formData, isFirstVisit: 'Yes' })}
                      />
                      <span className={`font-semibold ${formData.isFirstVisit === 'Yes' ? 'text-emerald-800' : 'text-slate-600'}`}>Yes, first time</span>
                    </label>

                    <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 flex-1 ${formData.isFirstVisit === 'No' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                      <div className={`flex items-center justify-center w-6 h-6 rounded-md border-2 mr-3 transition-colors duration-200 shadow-sm ${formData.isFirstVisit === 'No' ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white'}`}>
                        <svg className={`w-3.5 h-3.5 text-white transition-transform duration-200 ${formData.isFirstVisit === 'No' ? 'scale-100' : 'scale-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <input
                        type="radio"
                        name="isFirstVisit"
                        className="hidden"
                        checked={formData.isFirstVisit === 'No'}
                        onChange={() => setFormData({ ...formData, isFirstVisit: 'No' })}
                      />
                      <span className={`font-semibold ${formData.isFirstVisit === 'No' ? 'text-emerald-800' : 'text-slate-600'}`}>No, returning</span>
                    </label>
                  </div>
                </div>

                {/* Reason for Visit */}
                <div className="md:col-span-2 group">
                  <label className="block text-sm font-bold text-slate-700 mb-2.5 ml-1">Reason for Visit</label>
                  <div className="relative">
                    <div className="absolute top-4 left-0 pl-4 pointer-events-none">
                      <FileText className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <textarea
                      name="reasonForVisit"
                      value={formData.reasonForVisit}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Briefly describe your symptoms or reason for visit..."
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 text-slate-700 shadow-sm placeholder-slate-400 font-medium resize-none"
                    />
                  </div>
                </div>

                {/* Existing Reports/Prescription */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2.5 ml-1">Existing Reports/Prescription <span className="text-slate-400 font-normal">(Optional)</span></label>
                  <label className="relative border-2 border-dashed border-slate-300 rounded-2xl p-8 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all duration-300 bg-slate-50 flex flex-col items-center justify-center cursor-pointer group">
                    <input
                      type="file"
                      name="reports"
                      onChange={handleChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      id="file-upload"
                    />
                    <div className="flex flex-col items-center text-center">
                      <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                        <Upload className="h-6 w-6 text-emerald-500" />
                      </div>
                      <span className="text-slate-600 font-medium">
                        {formData.reports ? formData.reports.name : "Click to upload files"}
                      </span>
                      {!formData.reports && (
                        <span className="text-sm text-slate-400 mt-1">PDF, DOC, JPG up to 10MB</span>
                      )}
                    </div>
                  </label>
                </div>

              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto sm:min-w-[240px] float-right bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-600/30 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
              >
                {loading ? 'Processing...' : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Confirm Appointment
                  </>
                )}
              </button>
              <div className="clear-both"></div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
