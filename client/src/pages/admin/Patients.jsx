import React, { useState, useEffect } from 'react';
import PatientTable from '../../components/admin/PatientTable';
import { Search, Filter, Plus } from 'lucide-react';
import api from '../../services/api';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real scenario, this fetches from the API
    // For now, setting dummy data or trying to fetch if API is up
    const fetchPatients = async () => {
      try {
        const { data } = await api.get('/patient');
        setPatients(data);
      } catch (error) {
        console.error('Failed to fetch patients', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Patients</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and view all registered patient records.</p>
        </div>
        <button 
          onClick={() => window.location.href = '/admin/patients/new'}
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
        <PatientTable patients={patients} />
      )}
    </div>
  );
};

export default Patients;
