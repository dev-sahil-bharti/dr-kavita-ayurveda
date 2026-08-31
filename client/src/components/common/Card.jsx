import React from 'react';

export const Card = ({
  children,
  className = '',
  header,
  footer,
  padding = true,
  hover = false,
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden ${
        hover ? 'hover:shadow-md hover:border-slate-300 transition-all duration-200' : ''
      } ${className}`}
      {...props}
    >
      {header && (
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          {typeof header === 'string' ? (
            <h3 className="font-bold text-slate-800 text-base">{header}</h3>
          ) : (
            header
          )}
        </div>
      )}
      <div className={padding ? 'p-6' : ''}>{children}</div>
      {footer && (
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
