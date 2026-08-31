import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState = ({
  message = 'Loading...',
  size = 'md',
  fullScreen = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <Loader2 className={`${sizeClasses[size] || sizeClasses.md} text-emerald-600 animate-spin mb-3`} />
      {message && <p className="text-sm font-medium text-slate-500">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingState;
