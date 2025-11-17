import { useState, useEffect, useCallback } from "react";

/**
 * A custom hook to handle API calls.
 * It manages loading, error, and data states.
 * @param {Function} apiFunc - The API function to call (e.g., productService.getFeaturedProducts).
 * @returns {{data: any, loading: boolean, error: Error|null, request: Function}}
 */
export const useApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFunc(...args);
        setData(result);
        return result;
      } catch (err) {
        setError(err);
        console.error("API call failed", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunc]
  );

  return {
    data,
    loading,
    error,
    request,
  };
};
