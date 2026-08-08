import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';

const PatientTable = ({ patients }) => {
  return (
    <div className="overflow-x-auto rounded-xs border border-text-inverse/20 bg-white shadow-3">
      <table className="min-w-full divide-y divide-text-inverse/20">
        <thead className="bg-surface-base">
          <tr>
            <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-text-secondary uppercase tracking-wider">
              Patient Name
            </th>
            <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-text-secondary uppercase tracking-wider">
              Contact
            </th>
            <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-text-secondary uppercase tracking-wider">
              Gender
            </th>
            <th scope="col" className="px-6 py-4 text-left text-sm font-bold text-text-secondary uppercase tracking-wider">
              Registered Date
            </th>
            <th scope="col" className="px-6 py-4 text-right text-sm font-bold text-text-secondary uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-text-inverse/10">
          {patients && patients.length > 0 ? (
            patients.map((patient) => (
              <tr key={patient._id} className="hover:bg-text-inverse/5 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <div className="h-10 w-10 rounded-sm bg-surface-muted border flex items-center justify-center text-text-secondary font-bold text-lg">
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
                  <div className="text-lg text-text-primary">{patient.mobile}</div>
                  <div className="text-sm text-text-inverse">{patient.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 inline-flex text-sm leading-5 font-bold rounded-sm bg-text-inverse/10 text-text-primary">
                    {patient.gender}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-lg text-text-inverse">
                  {new Date(patient.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-lg font-bold">
                  <div className="flex justify-end space-x-3">
                    <button className="text-surface-strong hover:text-surface-strong/80 p-1 focus-visible:outline-none focus-visible:shadow-2 rounded-xs">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button className="text-surface-muted hover:text-surface-muted/80 p-1 focus-visible:outline-none focus-visible:shadow-2 rounded-xs">
                      <Edit className="h-5 w-5" />
                    </button>
                    <button className="text-red-500 hover:text-red-700 p-1 focus-visible:outline-none focus-visible:shadow-2 rounded-xs">
                      <Trash2 className="h-5 w-5" />
                    </button>
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
