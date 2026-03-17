import { useEffect, useCallback } from 'react';
import { useAppStore } from './useAppStore';
import { useAsyncTracker, useMutationState } from './useApi';
import type { UpdateDto, CreateUpdateDto, UpdateUpdateDto } from '../services/api';

export function useUpdates(clientId?: number) {
  const { updates: allUpdates, reads, actions } = useAppStore('updates');
  const { loading, error, track } = useAsyncTracker();
  const { isMutating, mutationError, trackMutation, clearMutationError } = useMutationState();

  const updates = clientId ? reads.getUpdatesByClient(clientId) : allUpdates;

  const refetch = useCallback(async () => {
    if (clientId) {
      await track(() => actions.getUpdatesByClient(clientId));
    }
  }, [clientId, actions, track]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const createUpdate = useCallback(async (update: CreateUpdateDto): Promise<UpdateDto> => {
    const result = await trackMutation(() => actions.createUpdate(update));
    if (result.success) return result.data;
    throw new Error(result.error.message);
  }, [actions, trackMutation]);

  const updateUpdate = useCallback(async (update: UpdateUpdateDto): Promise<UpdateDto> => {
    const result = await trackMutation(() => actions.updateUpdate(update));
    if (result.success) return result.data;
    throw new Error(result.error.message);
  }, [actions, trackMutation]);

  const deleteUpdate = useCallback(async (id: number): Promise<void> => {
    const result = await trackMutation(() => actions.deleteUpdate(id));
    if (!result.success) throw new Error(result.error.message);
  }, [actions, trackMutation]);

  return {
    updates,
    isLoading: loading,
    error,
    isMutating,
    mutationError,
    clearMutationError,
    refetch,
    createUpdate,
    updateUpdate,
    deleteUpdate,
  };
}

export function useUpcomingUpdates(days: number = 7) {
  const { reads } = useAppStore('updates');
  const { loading, error, track } = useAsyncTracker();

  // Read upcoming updates from the store (updates within `days`)
  const allUpdates = reads.getUpdatesByClient(0); // placeholder — upcoming is cross-client
  const now = new Date();
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  const upcoming = allUpdates.filter(u => {
    if (!u.scheduledDate) return false;
    const scheduled = new Date(u.scheduledDate);
    return scheduled >= now && scheduled <= futureDate && u.status !== 'completed';
  });

  return {
    updates: upcoming,
    isLoading: loading,
    error,
    refetch: async () => {
      await track(() => Promise.resolve({ success: true as const, data: undefined }));
    },
  };
}
