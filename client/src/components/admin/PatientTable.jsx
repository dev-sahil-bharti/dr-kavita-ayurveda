import React from 'react';
import { Eye, Edit, Archive, RefreshCw } from 'lucide-react';

const PatientTable = ({ patients, onView, onEdit, onArchiveToggle }) => {
  return (
    <div className="overflow-x-auto rounded-xs border border-text-inverse/20 bg-white shadow-3">
      <table className="min-w-full divide-y divide-text-inverse/20">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">
              Patient Name
            </th>
            <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">
              Contact
            </th>
            <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">
              Status & Gender
            </th>
            <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">
              Registered Date
            </th>
            <th scope="col" className="px-6 py-4 text-right text-sm font-bold text-slate-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-text-inverse/10">
          {patients && patients.length > 0 ? (
            patients.map((patient) => (
              <tr key={patient._id} className={`transition-colors ${patient.status === 'archived' ? 'bg-slate-50 opacity-75' : 'hover:bg-text-inverse/5'}`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <div className={`h-10 w-10 rounded-sm border flex items-center justify-center font-bold text-lg ${patient.status === 'archived' ? 'bg-slate-200 text-slate-500' : 'bg-surface-muted text-text-secondary'}`}>
                        {patient.name.charAt(0)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-lg font-bold text-text-primary">{patient.name}</div>
                      <div className="text-sm text-text-inverse">ID: {patient._id.substring(0,8)}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-lg text-text-primary">
                    {patient.mobile ? `+91 ${patient.mobile.replace(/\D/g, '').slice(-10)}` : '-'}
                  </div>
                  <div className="text-sm text-text-inverse">{patient.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-2 items-start">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${patient.status === 'archived' ? 'bg-slate-100 text-slate-600 border border-slate-200' : 'bg-green-100 text-green-800 border border-green-200'}`}>
                      {patient.status === 'archived' ? 'Archived' : 'Active'}
                    </span>
                    <span className="text-sm font-medium text-text-inverse ml-1">
                      {patient.gender}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-lg text-text-inverse">
                  {new Date(patient.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-lg font-bold">
                  <div className="flex justify-end space-x-3">
                    <button 
                      onClick={() => onView(patient)}
                      className="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 p-1.5 transition-colors rounded-md"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => onEdit(patient)}
                      className="text-amber-500 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 p-1.5 transition-colors rounded-md"
                      title="Edit Patient"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    {patient.status === 'archived' ? (
                      <button 
                        onClick={() => onArchiveToggle(patient._id, 'active')}
                        className="text-emerald-500 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 p-1.5 transition-colors rounded-md"
                        title="Unarchive Patient"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => onArchiveToggle(patient._id, 'archived')}
                        className="text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-1.5 transition-colors rounded-md"
                        title="Archive Patient"
                      >
                        <Archive className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="p-8 text-center text-text-inverse text-lg">
                No patients found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PatientTable;
