import { useEffect, useCallback } from 'react';
import { useAppStore } from './useAppStore';
import { useAsyncTracker, useMutationState } from './useApi';
import type { ConnectionDto, CreateConnectionDto, UpdateConnectionDto } from '../services/api';

export function useConnections(clientId: number) {
  const { reads, actions } = useAppStore('connections');
  const { loading, error, track } = useAsyncTracker();
  const { isMutating, mutationError, trackMutation, clearMutationError } = useMutationState();

  const connections = reads.getConnectionsByClient(clientId);

  const refetch = useCallback(async () => {
    await track(() => actions.getConnectionsByClient(clientId));
  }, [clientId, actions, track]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const createConnection = useCallback(async (connection: CreateConnectionDto): Promise<ConnectionDto> => {
    const result = await trackMutation(() => actions.createConnection(connection));
    if (result.success) return result.data;
    throw new Error(result.error.message);
  }, [actions, trackMutation]);

  const updateConnection = useCallback(async (connection: UpdateConnectionDto): Promise<ConnectionDto> => {
    const result = await trackMutation(() => actions.updateConnection(connection));
    if (result.success) return result.data;
    throw new Error(result.error.message);
  }, [actions, trackMutation]);

  const deleteConnection = useCallback(async (id: number): Promise<void> => {
    const result = await trackMutation(() => actions.deleteConnection(id));
    if (!result.success) throw new Error(result.error.message);
  }, [actions, trackMutation]);

  const testConnection = useCallback(async (connectionId: number) => {
    const result = await trackMutation(() => actions.testConnection(connectionId));
    if (result.success) return result.data;
    throw new Error(result.error.message);
  }, [actions, trackMutation]);

  return {
    connections,
    isLoading: loading,
    error,
    isMutating,
    mutationError,
    clearMutationError,
    refetch,
    createConnection,
    updateConnection,
    deleteConnection,
    testConnection,
  };
}
