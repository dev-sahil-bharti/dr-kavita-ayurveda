import React from 'react';

export const Table = ({ headers = [], children, className = '' }) => {
  return (
    <div className={`overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm ${className}`}>
      <table className="w-full text-left border-collapse">
        {headers.length > 0 && (
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200/80 text-xs font-bold text-slate-500 uppercase tracking-wider">
              {headers.map((h, index) => (
                <th
                  key={index}
                  className={`p-4 ${h.className || ''}`}
                  style={h.style}
                >
                  {h.label || h}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
    </div>
  );
};

export default Table;
