import React from 'react';

const Loader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-text-inverse/20 border-t-surface-muted rounded-sm animate-spin"></div>
        <p className="mt-4 text-text-inverse text-lg font-bold">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
