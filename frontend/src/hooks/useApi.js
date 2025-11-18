import { useState, useCallback } from "react";

/**
 * A custom hook to handle API calls.
 * It manages idle, loading, success, and error states explicitly.
 * @param {Function} apiFunc - The API function to call (e.g., productService.getFeaturedProducts).
 * @returns {{
 *   data: any,
 *   error: Error|null,
 *   status: 'idle'|'loading'|'succeeded'|'failed',
 *   isIdle: boolean,
 *   isLoading: boolean,
 *   isSuccess: boolean,
 *   isError: boolean,
 *   request: Function
 * }}
 */
export const useApi = (apiFunc) => {
  const [status, setStatus] = useState("idle");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const request = useCallback(
    async (...args) => {
      setStatus("loading");
      setError(null);
      // It's often good practice to clear old data when a new request starts
      // setData(null);
      try {
        const result = await apiFunc(...args);
        setData(result);
        setStatus("succeeded");
        return result;
      } catch (err) {
        setError(err);
        setStatus("failed");
        console.error("API call failed", err);
        throw err;
      }
    },
    [apiFunc]
  );

  return {
    status,
    isIdle: status === "idle",
    isLoading: status === "loading",
    isSuccess: status === "succeeded",
    isError: status === "failed",
    data,
    error,
    request,
  };
};
