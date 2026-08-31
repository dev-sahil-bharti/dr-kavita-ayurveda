import React from 'react';

const statusVariants = {
  // Appointment statuses
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  completed: 'bg-blue-50 text-blue-700 border-blue-200',
  cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
  rescheduled: 'bg-indigo-50 text-indigo-700 border-indigo-200',

  // Payment statuses
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  unpaid: 'bg-orange-50 text-orange-700 border-orange-200',
  refunded: 'bg-slate-100 text-slate-700 border-slate-200',

  // Inquiry statuses
  resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',

  // General
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  archived: 'bg-slate-100 text-slate-600 border-slate-200',
  urgent: 'bg-rose-50 text-rose-600 border-rose-200',
  new: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  default: 'bg-slate-100 text-slate-700 border-slate-200',
};

export const Badge = ({
  children,
  variant,
  status,
  size = 'md',
  dot = false,
  className = '',
}) => {
  const key = (status || variant || 'default').toLowerCase();
  const variantClass = statusVariants[key] || statusVariants.default;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center font-bold uppercase tracking-wider rounded-full border ${variantClass} ${
        sizeClasses[size] || sizeClasses.md
      } ${className}`}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80" />
      )}
      {children || status}
    </span>
  );
};

export default Badge;
