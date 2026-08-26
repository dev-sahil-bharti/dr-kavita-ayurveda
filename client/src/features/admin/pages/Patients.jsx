import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PatientTable from '../components/PatientTable';
import PatientModal from '../components/PatientModal';
import { Search, Filter, Plus } from 'lucide-react';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [filterOptions, setFilterOptions] = useState({ status: 'all', gender: 'all' });
  const location = useLocation();
  
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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location]);

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

  const filteredPatients = patients.filter(p => {
    // Search Filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = (p.name && p.name.toLowerCase().includes(query)) ||
                            (p.mobile && p.mobile.includes(query)) ||
                            (p.email && p.email.toLowerCase().includes(query));
      if (!matchesSearch) return false;
    }

    // Status Filter
    if (filterOptions.status !== 'all') {
      const pStatus = p.status || 'active';
      if (pStatus !== filterOptions.status) return false;
    }

    // Gender Filter
    if (filterOptions.gender !== 'all') {
      if (p.gender !== filterOptions.gender) return false;
    }

    return true;
  });

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone or email..." 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
          />
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium w-full sm:w-auto justify-center"
          >
            <Filter className="h-4 w-4 mr-2 text-slate-400" /> 
            Filters {(filterOptions.status !== 'all' || filterOptions.gender !== 'all') && <span className="ml-2 w-2 h-2 rounded-full bg-emerald-500"></span>}
          </button>
          
          {/* Filter Dropdown */}
          {showFilter && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 z-10 p-4">
              <h3 className="font-bold text-slate-800 mb-3 text-sm">Filter Patients</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
                  <select 
                    value={filterOptions.status}
                    onChange={(e) => setFilterOptions({...filterOptions, status: e.target.value})}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Gender</label>
                  <select 
                    value={filterOptions.gender}
                    onChange={(e) => setFilterOptions({...filterOptions, gender: e.target.value})}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="all">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <button 
                  onClick={() => {
                    setFilterOptions({ status: 'all', gender: 'all' });
                    setShowFilter(false);
                  }}
                  className="w-full text-center text-xs text-slate-500 hover:text-slate-800 pt-2"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <PatientTable 
          patients={filteredPatients} 
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
