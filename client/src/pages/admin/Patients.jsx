import React, { useState, useEffect } from 'react';
import PatientTable from '../../components/admin/PatientTable';
import PatientModal from '../../components/admin/PatientModal';
import { Search, Filter, Plus } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [actionConfirm, setActionConfirm] = useState({ id: null, newStatus: null });

  const fetchPatients = async () => {
    try {
      const { data } = await api.get('/patient');
      setPatients(data);
    } catch (error) {
      console.error('Failed to fetch patients', error);
      toast.error('Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleView = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleArchiveToggle = (id, newStatus) => {
    setActionConfirm({ id, newStatus });
  };

  const executeArchiveToggle = async () => {
    const { id, newStatus } = actionConfirm;
    if (!id) return;
    
    try {
      await api.put(`/patient/updatePatientProfile/${id}`, { status: newStatus });
      toast.success(`Patient ${newStatus === 'archived' ? 'archived' : 'unarchived'} successfully`);
      fetchPatients(); // refresh data
    } catch (error) {
      console.error('Error toggling status', error);
      toast.error('Failed to change patient status');
    } finally {
      setActionConfirm({ id: null, newStatus: null });
    }
  };

  const handleSavePatient = async (id, updatedData) => {
    await api.put(`/patient/updatePatientProfile/${id}`, updatedData);
    fetchPatients(); // refresh table
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Patients</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and view all registered patient records.</p>
        </div>
        <button 
          onClick={() => window.location.href = '/patient/register'}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-medium transition-colors shadow-sm shadow-emerald-600/20 flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" /> Add Patient
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, phone or ID..." 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
          />
        </div>
        <button className="flex items-center px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium w-full sm:w-auto justify-center">
          <Filter className="h-4 w-4 mr-2 text-slate-400" /> Filter Options
        </button>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <PatientTable 
          patients={patients} 
          onView={handleView}
          onEdit={handleEdit}
          onArchiveToggle={handleArchiveToggle}
        />
      )}

      {/* Action Confirmation Modal */}
      {actionConfirm.id && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in-up">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col p-6 border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Confirm {actionConfirm.newStatus === 'archived' ? 'Archive' : 'Unarchive'}
            </h3>
            <p className="text-slate-500 mb-6">
              Are you sure you want to {actionConfirm.newStatus === 'archived' ? 'archive' : 'unarchive'} this patient? 
              {actionConfirm.newStatus === 'archived' && " They will be moved to the archives and marked as inactive."}
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setActionConfirm({ id: null, newStatus: null })}
                className="px-4 py-2 font-bold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={executeArchiveToggle}
                className={`px-4 py-2 font-bold text-white rounded-lg transition-colors ${
                  actionConfirm.newStatus === 'archived' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Patient Modal */}
      <PatientModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        patient={selectedPatient}
        onSave={handleSavePatient}
      />
    </div>
  );
};

export default Patients;
