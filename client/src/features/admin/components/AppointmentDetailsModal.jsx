import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  FileText,
  Calendar,
  Clock,
  Activity,
  CheckCircle,
  XCircle,
  MapPin,
  Download,
  ExternalLink,
  Eye,
  Printer,
  MessageCircle,
  AlertTriangle,
  CreditCard,
  Image as ImageIcon,
  ZoomIn,
  ZoomOut,
  RotateCw,
  FileCheck,
  Stethoscope,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ENV } from '../../../config/env';
import { TIME_SLOTS } from '../../../utils/constants';

const AppointmentDetailsModal = ({
  selectedAppointment,
  onClose,
  onUpdateStatus,
  onRescheduleSubmit,
  onCompleteSubmit,
  onMarkCashPaid,
}) => {
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({ date: '', timeSlot: '' });

  const [isCompleting, setIsCompleting] = useState(false);
  const [completeData, setCompleteData] = useState({
    doctorNote: '',
    followUpDate: '',
    sessionNumber: '',
    totalSessions: '',
  });

  const [isMarkingCash, setIsMarkingCash] = useState(false);
  const [cashAmount, setCashAmount] = useState('');

  // Confirmation modal states
  const [confirmAction, setConfirmAction] = useState(null);

  // Active Document Lightbox / Viewer
  const [activePreviewDoc, setActivePreviewDoc] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);

  if (!selectedAppointment) return null;

  const SERVER_URL = (ENV.API_URL || 'http://localhost:5000').replace(/\/api\/?$/, '');

  const resolveDocUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
      return url;
    }
    return `${SERVER_URL}/${url.replace(/^\/+/, '')}`;
  };

  // Extract all normalized documents from the appointment
  const getDocuments = () => {
    const list = [];
    if (Array.isArray(selectedAppointment.documents) && selectedAppointment.documents.length > 0) {
      selectedAppointment.documents.forEach((doc, idx) => {
        if (doc && (doc.url || doc.publicId)) {
          const rawUrl = resolveDocUrl(doc.url);
          const ext = (doc.format || rawUrl.split('.').pop()?.split('?')[0] || 'file').toLowerCase();
          const isImg = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext) || doc.resourceType === 'image';
          const isPdf = ext === 'pdf';
          list.push({
            id: doc._id || `doc-${idx}`,
            name: doc.originalName || `Medical Document ${idx + 1}`,
            url: rawUrl,
            format: ext.toUpperCase(),
            isImage: isImg,
            isPdf: isPdf,
            bytes: doc.bytes,
            uploadedAt: doc.uploadedAt || selectedAppointment.createdAt,
          });
        }
      });
    }

    if (selectedAppointment.reportsFile) {
      const legacyUrl = resolveDocUrl(selectedAppointment.reportsFile);
      if (!list.some((d) => d.url === legacyUrl)) {
        const ext = legacyUrl.split('.').pop()?.split('?')[0]?.toLowerCase() || 'document';
        const isImg = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext);
        const isPdf = ext === 'pdf';
        list.push({
          id: 'legacy-report',
          name: 'Medical Report / Prescription',
          url: legacyUrl,
          format: ext.toUpperCase(),
          isImage: isImg,
          isPdf: isPdf,
          bytes: null,
          uploadedAt: selectedAppointment.createdAt,
        });
      }
    }
    return list;
  };

  const documents = getDocuments();

  const getStatusBadge = (status) => {
    const config = {
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      completed: 'bg-blue-100 text-blue-700 border-blue-200',
      cancelled: 'bg-rose-100 text-rose-700 border-rose-200',
      rescheduled: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    };
    const style = config[status] || config.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${style}`}>
        {status}
      </span>
    );
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
        toast.error('Please select both a new date and time slot.');
        return;
      }
      onRescheduleSubmit(selectedAppointment._id, rescheduleData);
    }
    setConfirmAction(null);
  };

  const handleComplete = () => {
    onCompleteSubmit(selectedAppointment._id, completeData);
    setIsCompleting(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const patientPhone = selectedAppointment.mobile || selectedAppointment.patient?.mobile || '';
  const cleanPhone = patientPhone.replace(/[^0-9]/g, '');
  const patientEmail = selectedAppointment.email || selectedAppointment.patient?.email || '';
  const patientName = selectedAppointment.patientName || selectedAppointment.patient?.name || 'Unknown Patient';

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-sm overflow-y-auto print:bg-white print:p-0">
        <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none animate-fade-in">
          
          {/* Header */}
          <div className="flex justify-between items-center p-6 sm:px-8 border-b border-slate-100 bg-white sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xl shadow-sm">
                {patientName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                    {patientName}
                  </h2>
                  {getStatusBadge(selectedAppointment.status)}
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs font-semibold text-slate-500">
                  {selectedAppointment.isFirstVisit ? (
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                      New Patient (First Visit)
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                      Returning Patient
                    </span>
                  )}

                  {selectedAppointment.urgency === 'Immediate' && (
                    <span className="px-2.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                      Urgent Case
                    </span>
                  )}

                  {selectedAppointment.paymentStatus && (
                    <span
                      className={`px-2.5 py-0.5 rounded-md border uppercase text-[10px] font-bold ${
                        selectedAppointment.paymentStatus === 'paid'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : selectedAppointment.paymentStatus === 'unpaid'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      Payment: {selectedAppointment.paymentStatus}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 print:hidden">
              <button
                onClick={handlePrint}
                className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                title="Print Appointment Summary"
              >
                <Printer className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 bg-slate-50/50 flex-1">
            
            {/* Top Quick Info Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200/70 shadow-sm">
              <div className="p-2">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Age & Gender</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">
                  {selectedAppointment.age ? `${selectedAppointment.age} Yrs` : 'N/A'} • {selectedAppointment.gender || 'Not specified'}
                </p>
              </div>
              <div className="p-2">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Consultation</p>
                <p className="text-sm font-bold text-emerald-700 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {selectedAppointment.consultationType || 'In-person'}
                </p>
              </div>
              <div className="p-2">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Appointment Date</p>
                <p className="text-sm font-bold text-slate-800 mt-0.5">
                  {new Date(selectedAppointment.date).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div className="p-2">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Time Slot</p>
                <p className="text-sm font-bold text-indigo-700 mt-0.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedAppointment.timeSlot || 'Standard Slot'}
                </p>
              </div>
            </div>

            {/* Grid 2 Columns: Contact & Schedule */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Patient Contact & Details */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    Patient Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm py-1 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Occupation</span>
                      <span className="font-semibold text-slate-800">{selectedAppointment.occupation || 'Not Provided'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm py-1 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Mobile Phone</span>
                      <span className="font-semibold text-slate-800">{patientPhone || 'Not Provided'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm py-1 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Email Address</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[200px]">{patientEmail || 'Not Provided'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm py-1">
                      <span className="text-slate-500 font-medium">Booking Created</span>
                      <span className="font-semibold text-slate-600 text-xs">
                        {selectedAppointment.createdAt
                          ? new Date(selectedAppointment.createdAt).toLocaleString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Contact Buttons */}
                <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-100">
                  {patientPhone && (
                    <>
                      <a
                        href={`tel:${patientPhone}`}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition-colors border border-emerald-200"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call Patient
                      </a>
                      <a
                        href={`https://wa.me/${cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-xl text-xs font-bold transition-colors border border-teal-200"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                      </a>
                    </>
                  )}
                  {patientEmail && (
                    <a
                      href={`mailto:${patientEmail}?subject=Dr. Kavita Ayurveda Appointment`}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                      title="Send Email"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Service & Treatment Info */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-indigo-600" />
                    Treatment & Consultation Details
                  </h3>

                  <div className="space-y-3">
                    <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
                      <p className="text-xs text-emerald-800 font-bold uppercase tracking-wider">Service / Therapy</p>
                      <p className="text-base font-extrabold text-emerald-950 mt-0.5">
                        {selectedAppointment.preferredService || selectedAppointment.therapy || 'Ayurvedic Consultation'}
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-xs text-slate-500 font-medium">Session Tracking</p>
                      <p className="text-sm font-semibold text-slate-800 mt-0.5">
                        {selectedAppointment.sessionNumber
                          ? `Session ${selectedAppointment.sessionNumber} of ${selectedAppointment.totalSessions || 'N/A'}`
                          : 'Single Consultation'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-sm py-1 border-t border-slate-100">
                      <span className="text-slate-500 font-medium">Payment Mode</span>
                      <span className="font-semibold text-slate-800 capitalize">
                        {selectedAppointment.paymentMethod || 'Pay at Clinic'}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedAppointment.paymentStatus === 'unpaid' && selectedAppointment.status !== 'cancelled' && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => setIsMarkingCash(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 rounded-xl text-xs font-bold transition-all"
                    >
                      <CreditCard className="w-4 h-4" />
                      Mark Cash Payment Received
                    </button>
                  </div>
                )}
              </div>

            </div>

            {/* Reason for Visit / Symptoms */}
            {(selectedAppointment.reasonForVisit || selectedAppointment.message) && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm">
                <h3 className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  Reason for Visit / Patient Symptoms
                </h3>
                <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-100 text-slate-800 text-sm font-medium leading-relaxed whitespace-pre-wrap">
                  {selectedAppointment.reasonForVisit || selectedAppointment.message}
                </div>
              </div>
            )}

            {/* Medical Documents & Reports Section */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-blue-600" />
                    Patient Medical Documents & Reports
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Prescriptions, lab reports, and diagnostic files uploaded by the patient.
                  </p>
                </div>
                {documents.length > 0 && (
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-bold">
                    {documents.length} {documents.length === 1 ? 'Document' : 'Documents'}
                  </span>
                )}
              </div>

              {documents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {documents.map((doc, index) => (
                    <div
                      key={doc.id || index}
                      className="group p-4 bg-slate-50 hover:bg-blue-50/40 rounded-2xl border border-slate-200 hover:border-blue-300 transition-all shadow-sm flex flex-col justify-between"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                          {doc.isImage ? <ImageIcon className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-slate-800 truncate" title={doc.name}>
                            {doc.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-medium flex-wrap">
                            <span className="px-2 py-0.5 bg-white rounded-md border border-slate-200 font-bold text-[10px] text-blue-700 uppercase">
                              {doc.format}
                            </span>
                            {doc.bytes && <span>{(doc.bytes / 1024).toFixed(1)} KB</span>}
                            <span>•</span>
                            <span>
                              {doc.uploadedAt
                                ? new Date(doc.uploadedAt).toLocaleDateString('en-IN', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                  })
                                : 'Uploaded'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Document Actions */}
                      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200/60">
                        <button
                          type="button"
                          onClick={() => {
                            setZoomLevel(1);
                            setRotation(0);
                            setActivePreviewDoc(doc);
                          }}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-600/20"
                        >
                          <Eye className="w-3.5 h-3.5" /> Preview
                        </button>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors"
                          title="Open in New Tab"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <a
                          href={doc.url}
                          download={doc.name}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-colors"
                          title="Download File"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-600">No medical documents uploaded</p>
                  <p className="text-xs text-slate-400 mt-0.5">The patient did not attach any reports or prescriptions for this appointment.</p>
                </div>
              )}
            </div>

            {/* Doctor Note / Consultation Notes (If Completed) */}
            {selectedAppointment.doctorNote && (
              <div className="bg-white p-5 rounded-2xl border border-slate-200/70 shadow-sm">
                <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5" />
                  Doctor's Clinical Notes & Advice
                </h3>
                <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-100 text-slate-800 text-sm font-medium leading-relaxed whitespace-pre-wrap">
                  {selectedAppointment.doctorNote}
                </div>
                {selectedAppointment.followUpDate && (
                  <p className="text-xs font-semibold text-emerald-800 mt-2">
                    Next Follow-up Date:{' '}
                    {new Date(selectedAppointment.followUpDate).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                )}
              </div>
            )}

            {/* Cancellation Details Card */}
            {selectedAppointment.status === 'cancelled' && (
              <div className="bg-rose-50/90 p-5 rounded-2xl border border-rose-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <h3 className="text-xs font-bold text-rose-800 uppercase tracking-wider">Cancellation Information</h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-rose-100 space-y-2 text-sm">
                  <div>
                    <span className="text-xs text-slate-400 font-bold uppercase">Reason:</span>
                    <p className="font-bold text-rose-700 mt-0.5">
                      {selectedAppointment.cancellation?.reason || selectedAppointment.cancelReason || 'Reason not specified'}
                    </p>
                  </div>
                  {selectedAppointment.cancellation?.note && (
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-xs text-slate-400 font-bold uppercase">Note:</span>
                      <p className="text-slate-700 mt-0.5">{selectedAppointment.cancellation.note}</p>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Cancelled by: <strong className="capitalize text-slate-700">{selectedAppointment.cancellation?.cancelledBy || 'Patient'}</strong></span>
                    {selectedAppointment.cancellation?.cancelledAt && (
                      <span>
                        {new Date(selectedAppointment.cancellation.cancelledAt).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer Actions */}
          <div className="p-6 sm:px-8 border-t border-slate-100 bg-white sticky bottom-0 z-10 print:hidden">
            {confirmAction ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-amber-50 p-4 rounded-2xl border border-amber-200 animate-fade-in">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>
                    Are you sure you want to {confirmAction === 'reject' ? 'reject / cancel' : 'confirm'} this appointment?
                  </span>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setConfirmAction(null)}
                    className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold bg-white text-slate-600 rounded-xl border border-slate-200 hover:bg-slate-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={executeAction}
                    className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl text-white shadow-sm ${
                      confirmAction === 'reject' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
                    }`}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            ) : isCompleting ? (
              <div className="space-y-4 animate-fade-in">
                <h4 className="text-sm font-bold text-slate-800">Complete Consultation & Add Clinical Notes</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">Prescription / Doctor's Advice</label>
                    <textarea
                      className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-sm h-24 resize-none"
                      placeholder="Enter prescribed medicines, diet advice, or consultation notes..."
                      value={completeData.doctorNote}
                      onChange={(e) => setCompleteData({ ...completeData, doctorNote: e.target.value })}
                    />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-600 mb-1 block">Follow-up Date (Optional)</label>
                      <input
                        type="date"
                        className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 text-sm"
                        value={completeData.followUpDate}
                        onChange={(e) => setCompleteData({ ...completeData, followUpDate: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsCompleting(false)}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleComplete}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm shadow-emerald-600/20"
                  >
                    Save & Complete Consultation
                  </button>
                </div>
              </div>
            ) : isMarkingCash ? (
              <div className="flex flex-col sm:flex-row items-center gap-3 animate-fade-in">
                <div className="flex-1 w-full">
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Amount Collected (₹)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm font-semibold"
                    value={cashAmount}
                    onChange={(e) => setCashAmount(e.target.value)}
                    placeholder="e.g. 500"
                    autoFocus
                  />
                </div>
                <div className="flex w-full sm:w-auto gap-2 sm:mt-5">
                  <button
                    onClick={() => setIsMarkingCash(false)}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!cashAmount) return toast.error('Please enter the cash amount.');
                      onMarkCashPaid(selectedAppointment._id, cashAmount);
                      setIsMarkingCash(false);
                    }}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-700 shadow-md shadow-orange-600/20"
                  >
                    Confirm Cash Payment
                  </button>
                </div>
              </div>
            ) : isRescheduling ? (
              <div className="flex flex-col sm:flex-row items-center gap-3 animate-fade-in">
                <div className="flex-1 w-full">
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Select New Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    value={rescheduleData.date}
                    onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="flex-1 w-full">
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Select New Time Slot</label>
                  <select
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
                    value={rescheduleData.timeSlot}
                    onChange={(e) => setRescheduleData({ ...rescheduleData, timeSlot: e.target.value })}
                  >
                    <option value="">Choose Time Slot</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex w-full sm:w-auto gap-2 sm:mt-5">
                  <button
                    onClick={() => setIsRescheduling(false)}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleActionClick('reschedule')}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
                  >
                    Confirm Reschedule
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-end gap-3">
                {selectedAppointment.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleActionClick('reject')}
                      className="px-5 py-2.5 text-xs font-bold rounded-xl bg-white text-rose-600 border border-rose-200 hover:bg-rose-50 transition-colors flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" /> Reject Booking
                    </button>
                    <button
                      onClick={() => setIsRescheduling(true)}
                      className="px-5 py-2.5 text-xs font-bold rounded-xl bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 transition-colors flex items-center gap-1.5"
                    >
                      <Clock className="w-4 h-4" /> Reschedule
                    </button>
                    <button
                      onClick={() => handleActionClick('confirm')}
                      className="px-6 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" /> Confirm Booking
                    </button>
                  </>
                )}

                {(selectedAppointment.status === 'confirmed' || selectedAppointment.status === 'rescheduled') && (
                  <>
                    <button
                      onClick={() => setIsRescheduling(true)}
                      className="px-4 py-2.5 text-xs font-bold rounded-xl bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 transition-colors flex items-center gap-1.5"
                    >
                      <Clock className="w-4 h-4" /> Reschedule
                    </button>
                    <button
                      onClick={() => setIsCompleting(true)}
                      className="px-6 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
                    >
                      <Stethoscope className="w-4 h-4" /> Complete Consultation
                    </button>
                  </>
                )}

                <button
                  onClick={onClose}
                  className="px-6 py-2.5 text-xs font-bold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Interactive Document Viewer / Lightbox Modal */}
      {activePreviewDoc && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 text-white rounded-3xl w-full max-w-4xl h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-slate-700">
            
            {/* Viewer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  {activePreviewDoc.isImage ? <ImageIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-100 truncate max-w-sm sm:max-w-md">
                    {activePreviewDoc.name}
                  </h3>
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">
                    {activePreviewDoc.format} Document
                  </span>
                </div>
              </div>

              {/* Viewer Control Bar */}
              <div className="flex items-center gap-2">
                {activePreviewDoc.isImage && (
                  <>
                    <button
                      onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 3))}
                      className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.5))}
                      className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setRotation((r) => (r + 90) % 360)}
                      className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                      title="Rotate"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                  </>
                )}

                <a
                  href={activePreviewDoc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  title="Open full document in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>

                <a
                  href={activePreviewDoc.url}
                  download={activePreviewDoc.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </a>

                <button
                  onClick={() => setActivePreviewDoc(null)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-2"
                  title="Close Viewer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Viewer Content Area */}
            <div className="flex-1 bg-slate-950 p-4 flex items-center justify-center overflow-auto relative">
              {activePreviewDoc.isImage ? (
                <div className="flex items-center justify-center max-w-full max-h-full transition-transform duration-200">
                  <img
                    src={activePreviewDoc.url}
                    alt={activePreviewDoc.name}
                    className="max-h-[72vh] max-w-full object-contain rounded-lg shadow-lg"
                    style={{
                      transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                      transition: 'transform 0.2s ease-in-out',
                    }}
                  />
                </div>
              ) : activePreviewDoc.isPdf ? (
                <iframe
                  src={`${activePreviewDoc.url}#toolbar=1`}
                  title={activePreviewDoc.name}
                  className="w-full h-full rounded-lg border border-slate-800 bg-white"
                />
              ) : (
                <div className="text-center p-8">
                  <FileText className="w-16 h-16 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-300 font-bold text-base mb-1">
                    Preview not directly available for this format ({activePreviewDoc.format})
                  </p>
                  <p className="text-slate-500 text-xs mb-4">
                    You can open the document in a new tab or download it directly.
                  </p>
                  <div className="flex justify-center gap-3">
                    <a
                      href={activePreviewDoc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg"
                    >
                      Open in New Tab
                    </a>
                    <a
                      href={activePreviewDoc.url}
                      download={activePreviewDoc.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700"
                    >
                      Download File
                    </a>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default AppointmentDetailsModal;
