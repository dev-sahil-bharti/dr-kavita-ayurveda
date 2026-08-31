import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from '../common/Button';

export const ErrorState = ({
  title = 'Something Went Wrong',
  message = 'We encountered an error while processing your request.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-10 text-center bg-rose-50/50 rounded-2xl border border-rose-100 ${className}`}
    >
      <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-600 max-w-sm mb-6 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button variant="danger" size="md" onClick={onRetry} icon={RefreshCw}>
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
