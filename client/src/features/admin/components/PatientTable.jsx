import React from 'react';
import { Eye, Edit, Archive, RefreshCw } from 'lucide-react';
import Badge from '../../../components/common/Badge';

export const PatientTable = ({ patients, onView, onEdit, onArchiveToggle }) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-100">
        <thead className="bg-slate-50 border-b border-slate-200/80">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
              Patient Name
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
              Contact Details
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
              Status & Gender
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
              Registered Date
            </th>
            <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100 text-sm">
          {patients && patients.length > 0 ? (
            patients.map((patient) => (
              <tr
                key={patient._id}
                className={`transition-colors ${
                  patient.status === 'archived'
                    ? 'bg-slate-50 opacity-75'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 shrink-0">
                      <div
                        className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-base ${
                          patient.status === 'archived'
                            ? 'bg-slate-200 text-slate-500'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {patient.name?.charAt(0) || 'P'}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="font-bold text-slate-800">{patient.name}</div>
                      <div className="text-xs text-slate-400">
                        ID: {patient._id?.substring(0, 8)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-semibold text-slate-700">
                    {patient.mobile
                      ? `+91 ${patient.mobile.replace(/\D/g, '').slice(-10)}`
                      : '-'}
                  </div>
                  <div className="text-xs text-slate-400">{patient.email || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1 items-start">
                    <Badge status={patient.status || 'active'} size="sm" />
                    <span className="text-xs text-slate-500 ml-1">
                      {patient.gender || 'Not specified'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-xs font-medium">
                  {new Date(patient.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onView(patient)}
                      className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 p-2 transition-colors rounded-lg"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(patient)}
                      className="text-amber-600 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 p-2 transition-colors rounded-lg"
                      title="Edit Patient"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    {patient.status === 'archived' ? (
                      <button
                        onClick={() => onArchiveToggle(patient._id, 'active')}
                        className="text-emerald-600 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 p-2 transition-colors rounded-lg"
                        title="Unarchive Patient"
                      >
                        <RefreshCw className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => onArchiveToggle(patient._id, 'archived')}
                        className="text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 transition-colors rounded-lg"
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
              <td colSpan="5" className="p-8 text-center text-slate-400 text-sm">
                No patients found matching your search.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PatientTable;
