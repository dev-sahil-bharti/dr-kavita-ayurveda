import React from 'react';
import { Sparkles, Plus } from 'lucide-react';
import Button from '../../../components/common/Button';

export const Therapies = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Therapies & Services</h1>
          <p className="text-sm text-slate-500 mt-1">Manage Panchakarma and specialized Ayurvedic services.</p>
        </div>
        <Button variant="primary" icon={Plus} disabled>
          Add Therapy
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-12 flex flex-col items-center justify-center text-center">
        <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Therapy Catalog Management</h2>
        <p className="text-slate-500 max-w-md text-sm leading-relaxed mb-6">
          This module allows administrators to configure dynamic Ayurvedic therapy packages, set session pricing, and link services to the patient booking calendar.
        </p>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          Module Active
        </span>
      </div>
    </div>
  );
};

export default Therapies;
