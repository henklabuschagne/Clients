import { useState, useCallback, useEffect, useRef } from 'react';
import type { ApiResult } from '../lib/api';

/**
 * Lightweight loading/error tracker for async API operations.
 * Used by domain hooks to make isLoading and error reactive.
 * Data is read from the store — this only tracks the async lifecycle.
 */
export function useAsyncTracker() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const track = useCallback(async <T,>(apiFn: () => Promise<ApiResult<T>>): Promise<ApiResult<T>> => {
    setLoading(true);
    setError(null);
    const result = await apiFn();
    if (mountedRef.current) {
      setLoading(false);
      if (!result.success) setError(result.error.message);
    }
    return result;
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { loading, error, track, clearError };
}

/**
 * Hook for async data fetching with loading/error tracking.
 */
export function useApiCall<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (apiFn: () => Promise<ApiResult<T>>) => {
    setLoading(true);
    setError(null);
    const result = await apiFn();
    setLoading(false);
    if (result.success) {
      setData(result.data);
    } else {
      setError(result.error.message);
    }
    return result;
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return { data, loading, error, execute, reset };
}

/**
 * Hook for async mutations with loading/error tracking.
 */
export function useApiMutation<TInput, TOutput>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (
    apiFn: (input: TInput) => Promise<ApiResult<TOutput>>,
    input: TInput
  ) => {
    setLoading(true);
    setError(null);
    const result = await apiFn(input);
    setLoading(false);
    if (!result.success) {
      setError(result.error.message);
    }
    return result;
  }, []);

  return { loading, error, mutate };
}

/**
 * Lightweight mutation tracker for domain hooks.
 * Wraps individual CRUD operations with isMutating/mutationError state.
 * Separate from useAsyncTracker so fetch loading and mutation loading don't collide.
 */
export function useMutationState() {
  const [isMutating, setIsMutating] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const trackMutation = useCallback(async <T,>(apiFn: () => Promise<ApiResult<T>>): Promise<ApiResult<T>> => {
    setIsMutating(true);
    setMutationError(null);
    const result = await apiFn();
    if (mountedRef.current) {
      setIsMutating(false);
      if (!result.success) setMutationError(result.error.message);
    }
    return result;
  }, []);

  const clearMutationError = useCallback(() => setMutationError(null), []);

  return { isMutating, mutationError, trackMutation, clearMutationError };
}