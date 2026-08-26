import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../../services/api';

const PatientModal = ({ isOpen, onClose, patient, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loadingAppts, setLoadingAppts] = useState(false);

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || '',
        mobile: patient.mobile || '',
        email: patient.email || '',
        gender: patient.gender || 'Other',
        dob: patient.dob ? new Date(patient.dob).toISOString().split('T')[0] : '',
        address: patient.address || '',
        healthConditions: patient.healthConditions || '',
        currentMedications: patient.currentMedications || '',
        consultationType: patient.consultationType || 'In-person'
      });
      setIsEditing(false);
      setActiveTab('profile');

      if (isOpen) {
        const fetchAppointments = async () => {
          setLoadingAppts(true);
          try {
            const res = await api.get(`/appointment/patient/${patient._id}`);
            setAppointments(res.data.data);
          } catch (error) {
            console.error('Failed to fetch patient appointments');
          } finally {
            setLoadingAppts(false);
          }
        };
        fetchAppointments();
      }
    }
  }, [patient, isOpen]);

  if (!isOpen || !patient) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSave(patient._id, formData);
      setIsEditing(false);
      // Let parent handle toast for success/error
    } catch (error) {
      toast.error('Failed to update patient details.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">
            {isEditing ? 'Edit Patient' : 'Patient Details'}
          </h2>
          <div className="flex gap-3">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-sm font-bold text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
              >
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors focus-visible:outline-none"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          {isEditing ? (
            <form id="edit-patient-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mobile *</label>
                  <input
                    type="text"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Consultation Type</label>
                  <select
                    name="consultationType"
                    value={formData.consultationType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    <option value="In-person">In-person</option>
                    <option value="Online">Online</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                  placeholder="e.g., 123 Main St, City"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Health Conditions</label>
                <textarea
                  name="healthConditions"
                  value={formData.healthConditions}
                  onChange={handleChange}
                  rows="2"
                  placeholder="e.g., Diabetes, Hypertension (or leave blank)"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Current Medications</label>
                <textarea
                  name="currentMedications"
                  value={formData.currentMedications}
                  onChange={handleChange}
                  rows="2"
                  placeholder="e.g., Metformin 500mg (or leave blank)"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-2xl">
                  {patient.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">{patient.name}</h3>
                  <p className="text-slate-500">ID: {patient._id}</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-200">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-4 py-2 font-bold text-sm ${activeTab === 'profile' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`px-4 py-2 font-bold text-sm ${activeTab === 'appointments' ? 'border-b-2 border-emerald-600 text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Appointments
                </button>
              </div>

              {activeTab === 'profile' ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Contact Details</label>
                      <p className="text-slate-800 font-medium">📞 {patient.mobile}</p>
                      {patient.email && <p className="text-slate-800">✉️ {patient.email}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Demographics</label>
                      <p className="text-slate-800">Gender: <span className="font-medium">{patient.gender || 'N/A'}</span></p>
                      <p className="text-slate-800">DOB: <span className="font-medium">{patient.dob ? new Date(patient.dob).toLocaleDateString() : 'N/A'}</span></p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Address</label>
                      <p className="text-slate-800">{patient.address || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Preferences</label>
                      <p className="text-slate-800">Consultation: <span className="font-medium">{patient.consultationType || 'N/A'}</span></p>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-6 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Health Conditions</label>
                      <p className="text-slate-800 text-sm">
                        {patient.healthConditions || 'None reported.'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current Medications</label>
                      <p className="text-slate-800 text-sm">
                        {patient.currentMedications || 'None reported.'}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="mt-4 space-y-4 max-h-80 overflow-y-auto pr-2">
                  {loadingAppts ? (
                    <div className="flex justify-center p-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
                    </div>
                  ) : appointments.length > 0 ? (
                    appointments.map(appt => (
                      <div key={appt._id} className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                          <p className="font-bold text-slate-800">{new Date(appt.date).toLocaleDateString()} at {appt.timeSlot}</p>
                          <p className="text-sm text-slate-600">Service: <span className="font-medium">{appt.preferredService}</span></p>
                          <p className="text-sm text-slate-600">Consultation: <span className="font-medium">{appt.consultationType}</span></p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider 
                            ${appt.status === 'pending' ? 'bg-amber-100 text-amber-700' : ''}
                            ${appt.status === 'confirmed' ? 'bg-blue-100 text-blue-700' : ''}
                            ${appt.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : ''}
                            ${appt.status === 'cancelled' ? 'bg-red-100 text-red-700' : ''}
                            ${appt.status === 'rescheduled' ? 'bg-purple-100 text-purple-700' : ''}
                          `}>
                            {appt.status}
                          </span>
                          <span className="text-xs text-slate-500 mt-2">ID: {appt._id.substring(0,8)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 text-center py-6">No appointments booked yet.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-2.5 font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="edit-patient-form"
                className="px-6 py-2.5 font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-2.5 font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientModal;
