import React, { useState, useEffect, useRef } from 'react';
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
  CheckCircle2,
  X,
  FileCheck,
  Flame,
  ShieldCheck,
  Eye,
  Info,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { patientService } from '../services/patientService';
import { formatDateForInput } from '../../../utils/formatters';
import { TIME_SLOTS, SERVICES_LIST } from '../../../utils/constants';
import Button from '../../../components/common/Button';
import toast from 'react-hot-toast';

export const BookAppointment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const formattedToday = formatDateForInput();

  const [formData, setFormData] = useState({
    patientName: '',
    mobile: '',
    email: '',
    gender: '',
    consultationType: 'In-person',
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

  const [filePreview, setFilePreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Pre-fill user data when user profile is loaded
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        patientName: prev.patientName || user.name || '',
        mobile: prev.mobile || user.mobile || user.phone || '',
        email: prev.email || user.email || '',
        gender: prev.gender || user.gender || '',
        age: prev.age || (user.age ? String(user.age) : ''),
        occupation: prev.occupation || user.occupation || '',
      }));
    }
  }, [user]);

  // Clean up object URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (filePreview?.url) {
        URL.revokeObjectURL(filePreview.url);
      }
    };
  }, [filePreview]);

  const handleFileSelect = (file) => {
    if (!file) return;

    // Check size limit: 10MB
    const maxSizeBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError('Selected file exceeds the 10MB size limit. Please choose a smaller file.');
      toast.error('File size exceeds 10MB limit.');
      return;
    }

    const isImg = file.type.startsWith('image/');
    const isPdf = file.type === 'application/pdf';
    const previewUrl = isImg ? URL.createObjectURL(file) : null;

    setFilePreview({
      name: file.name,
      size: (file.size / 1024).toFixed(1),
      isImage: isImg,
      isPdf: isPdf,
      url: previewUrl,
    });

    setFormData((prev) => ({ ...prev, reports: file }));
    setError('');
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    if (filePreview?.url) {
      URL.revokeObjectURL(filePreview.url);
    }
    setFilePreview(null);
    setFormData((prev) => ({ ...prev, reports: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      if (files && files[0]) {
        handleFileSelect(files[0]);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Field validations
    if (!formData.patientName.trim()) {
      setError('Please provide the patient name.');
      return;
    }
    if (!formData.mobile.trim()) {
      setError('Please provide a valid mobile number.');
      return;
    }
    if (!formData.gender) {
      setError('Please select the patient gender.');
      return;
    }
    if (!formData.age || Number(formData.age) <= 0) {
      setError('Please enter a valid age.');
      return;
    }
    if (!formData.preferredService) {
      setError('Please select a preferred Ayurvedic service or therapy.');
      return;
    }
    if (!formData.date) {
      setError('Please choose a preferred appointment date.');
      return;
    }
    if (!formData.timeSlot) {
      setError('Please choose a preferred time slot.');
      return;
    }

    setLoading(true);

    try {
      await patientService.bookAppointment(formData);

      setSuccess('Appointment booked successfully! We look forward to seeing you.');
      toast.success('Appointment booked successfully!');
      setTimeout(() => navigate('/patient/appointments'), 1500);
    } catch (err) {
      console.error('Booking error:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to book appointment.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputClassName =
    'w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 text-slate-800 shadow-sm placeholder-slate-400 font-medium text-sm';
  const selectClassName =
    'w-full pl-11 pr-10 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-300 text-slate-800 shadow-sm appearance-none cursor-pointer font-medium text-sm';

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 font-sans">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 px-8 py-10 sm:px-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-emerald-400 opacity-20 blur-3xl pointer-events-none"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-100 text-xs font-bold mb-3 border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              Verified Ayurvedic Doctors
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold flex items-center tracking-tight">
              <Calendar className="mr-3.5 h-9 w-9 text-emerald-200 shrink-0" />
              Book Consultation
            </h2>
            <p className="mt-2 text-emerald-100 text-sm sm:text-base font-light max-w-xl leading-relaxed">
              Schedule your clinic visit or online consultation and upload medical reports for doctor review.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-6 sm:p-10 bg-slate-50/30">
          {error && (
            <div className="mb-6 bg-rose-50 text-rose-700 p-4 rounded-2xl border border-rose-200 flex items-start shadow-sm text-sm animate-fade-in">
              <AlertCircle className="w-5 h-5 mr-3 shrink-0 text-rose-500 mt-0.5" />
              <p className="font-semibold">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-emerald-50 text-emerald-800 p-4 rounded-2xl border border-emerald-200 flex items-start shadow-sm text-sm animate-fade-in">
              <CheckCircle2 className="w-5 h-5 mr-3 shrink-0 text-emerald-600 mt-0.5" />
              <div>
                <p className="font-bold">{success}</p>
                <p className="text-xs text-emerald-600 mt-0.5">Redirecting to your appointments page...</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Section 1: Patient Information */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4 pb-2 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold shadow-sm">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
                    Patient Information
                  </h3>
                  <p className="text-xs text-slate-500">Provide demographic and contact details of the patient.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Patient Full Name *
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
                      placeholder="e.g. Rahul Sharma"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Mobile Phone Number *
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
                      className={inputClassName}
                      placeholder="e.g. 9876543210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Email Address <span className="text-slate-400 font-normal">(For appointment confirmation)</span>
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
                      className={inputClassName}
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
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Patient Age (Years) *
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
                      className={`${inputClassName} pl-4`}
                      placeholder="e.g. 34"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Occupation / Profession *
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
                      placeholder="e.g. Software Engineer, Teacher"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Consultation & Treatment Specifics */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4 pb-2 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shadow-sm">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
                    Consultation & Schedule
                  </h3>
                  <p className="text-xs text-slate-500">Choose your preferred therapy, timing, and urgency.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Consultation Mode *
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
                      <option value="In-person">In-person Clinic Visit</option>
                      <option value="Online">Online Video Consultation</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Preferred Service / Therapy *
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

                {/* Urgency Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Consultation Urgency
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { val: 'Standard', label: 'Standard Visit', icon: ShieldCheck, color: 'emerald' },
                      { val: 'Immediate', label: 'Urgent Case', icon: Flame, color: 'rose' },
                    ].map((item) => {
                      const isSelected = formData.urgency === item.val;
                      const Icon = item.icon;
                      return (
                        <label
                          key={item.val}
                          className={`flex items-center gap-2.5 p-3.5 border-2 rounded-2xl cursor-pointer transition-all ${
                            isSelected
                              ? item.val === 'Immediate'
                                ? 'border-rose-500 bg-rose-50/80 text-rose-900 font-bold shadow-sm'
                                : 'border-emerald-600 bg-emerald-50/80 text-emerald-900 font-bold shadow-sm'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="urgency"
                            value={item.val}
                            checked={isSelected}
                            onChange={() => setFormData({ ...formData, urgency: item.val })}
                            className="hidden"
                          />
                          <Icon className={`w-4 h-4 ${isSelected ? (item.val === 'Immediate' ? 'text-rose-600' : 'text-emerald-600') : 'text-slate-400'}`} />
                          <span className="text-xs">{item.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* First Visit Selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    First Visit to Dr. Kavita Ayurveda?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { val: 'Yes', label: 'Yes, First Time' },
                      { val: 'No', label: 'Returning Patient' },
                    ].map((choice) => (
                      <label
                        key={choice.val}
                        className={`flex items-center justify-center p-3.5 border-2 rounded-2xl cursor-pointer transition-all text-xs ${
                          formData.isFirstVisit === choice.val
                            ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 font-bold shadow-sm'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 font-medium'
                        }`}
                      >
                        <input
                          type="radio"
                          name="isFirstVisit"
                          value={choice.val}
                          className="hidden"
                          checked={formData.isFirstVisit === choice.val}
                          onChange={() => setFormData({ ...formData, isFirstVisit: choice.val })}
                        />
                        <span>{choice.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Reason for Visit / Symptoms */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Reason for Visit / Health Symptoms
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
                      placeholder="Please describe your symptoms, health concerns, or previous medical history..."
                      className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-slate-800 font-medium text-sm resize-none shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Medical Document & Prescription Upload */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4 pb-2 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-bold shadow-sm">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-800 tracking-tight">
                    Medical Documents & Reports <span className="text-slate-400 text-xs font-normal">(Optional)</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Upload your past prescriptions, lab tests, or diagnostic scans (PDF or Images up to 10MB).
                  </p>
                </div>
              </div>

              {/* Upload Dropzone / File Preview */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-3xl p-6 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer ${
                  isDragOver
                    ? 'border-emerald-500 bg-emerald-50/70 scale-[1.01]'
                    : filePreview
                    ? 'border-emerald-300 bg-emerald-50/30'
                    : 'border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/20 bg-slate-50/70'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  name="reports"
                  onChange={handleChange}
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp,image/jpg,application/pdf,.doc,.docx,.txt"
                />

                {filePreview ? (
                  <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 p-3 bg-white rounded-2xl border border-emerald-200/80 shadow-sm animate-fade-in">
                    <div className="flex items-center gap-3 min-w-0">
                      {filePreview.isImage && filePreview.url ? (
                        <img
                          src={filePreview.url}
                          alt="Report Preview"
                          className="w-14 h-14 object-cover rounded-xl border border-emerald-200 shrink-0 shadow-sm"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 shadow-inner">
                          <FileText className="w-7 h-7" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate max-w-xs sm:max-w-md">
                          {filePreview.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 font-medium">
                          {filePreview.size} KB • Ready for submission
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                        Document Attached
                      </span>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors border border-transparent hover:border-rose-200"
                        title="Remove Document"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center mx-auto mb-3 shadow-inner">
                      <Upload className="h-7 w-7" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">
                      Click to upload or drag & drop file here
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Supports JPG, PNG, WebP, PDF up to 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Info className="w-4 h-4 text-slate-400 shrink-0" />
                <span>You can view and track your booking status after submission.</span>
              </div>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                icon={Send}
                className="w-full sm:w-auto shadow-lg shadow-emerald-800/20"
              >
                {loading ? 'Submitting Booking & Report...' : 'Confirm Consultation Booking'}
              </Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
