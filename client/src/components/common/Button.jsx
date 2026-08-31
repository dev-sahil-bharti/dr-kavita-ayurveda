import React from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20 active:scale-[0.98]',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 active:scale-[0.98]',
  accent: 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm shadow-amber-600/20 active:scale-[0.98]',
  danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-600/20 active:scale-[0.98]',
  outline: 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 active:scale-[0.98]',
  ghost: 'text-slate-600 hover:bg-slate-100 active:scale-[0.98]',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs font-semibold rounded-lg',
  md: 'px-4 py-2.5 text-sm font-semibold rounded-xl',
  lg: 'px-6 py-3.5 text-base font-bold rounded-xl',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  type = 'button',
  ...props
}) => {
  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.md;

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : Icon && iconPosition === 'left' ? (
        <Icon className="w-4 h-4 mr-2" />
      ) : null}

      <span>{children}</span>

      {!isLoading && Icon && iconPosition === 'right' && (
        <Icon className="w-4 h-4 ml-2" />
      )}
    </button>
  );
};

export default Button;
