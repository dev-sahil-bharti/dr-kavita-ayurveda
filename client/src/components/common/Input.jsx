import React, { forwardRef } from 'react';

export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      icon: Icon,
      rightIcon: RightIcon,
      onRightIconClick,
      className = '',
      wrapperClassName = '',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={`space-y-1.5 ${wrapperClassName}`}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-semibold text-slate-700">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full py-2.5 text-sm rounded-xl border bg-slate-50 transition-all outline-none text-slate-800 placeholder-slate-400 focus:bg-white ${
              Icon ? 'pl-10' : 'pl-3.5'
            } ${RightIcon ? 'pr-10' : 'pr-3.5'} ${
              error
                ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
            } ${className}`}
            {...props}
          />
          {RightIcon && (
            <button
              type="button"
              tabIndex={-1}
              onClick={onRightIconClick}
              className={`absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 ${
                onRightIconClick ? 'hover:text-slate-600 cursor-pointer' : 'pointer-events-none'
              }`}
            >
              <RightIcon className="h-4 w-4" />
            </button>
          )}
        </div>
        {error ? (
          <p className="text-xs text-rose-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
