import { useState, useCallback } from 'react';

/**
 * Hook for managing async operation states (loading, error, data)
 */
export const useAsync = (asyncFunction, immediate = false) => {
  const [loading, setLoading] = useState(immediate);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const response = await asyncFunction(...args);
        setData(response);
        return { data: response, error: null };
      } catch (err) {
        setError(err);
        return { data: null, error: err };
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction]
  );

  return { execute, loading, data, error, setData, setError };
};

export default useAsync;
