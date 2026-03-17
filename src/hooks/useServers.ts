import { useEffect, useCallback } from 'react';
import { useAppStore } from './useAppStore';
import { useAsyncTracker, useMutationState } from './useApi';
import type { ServerDto, CreateServerDto, UpdateServerDto } from '../services/api';

export function useServers(clientId: number) {
  const { reads, actions } = useAppStore('servers');
  const { loading, error, track } = useAsyncTracker();
  const { isMutating, mutationError, trackMutation, clearMutationError } = useMutationState();

  const servers = reads.getServersByClient(clientId);

  const refetch = useCallback(async () => {
    await track(() => actions.getServersByClient(clientId));
  }, [clientId, actions, track]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const createServer = useCallback(async (server: CreateServerDto): Promise<ServerDto> => {
    const result = await trackMutation(() => actions.createServer(server));
    if (result.success) return result.data;
    throw new Error(result.error.message);
  }, [actions, trackMutation]);

  const updateServer = useCallback(async (server: UpdateServerDto): Promise<ServerDto> => {
    const result = await trackMutation(() => actions.updateServer(server));
    if (result.success) return result.data;
    throw new Error(result.error.message);
  }, [actions, trackMutation]);

  const deleteServer = useCallback(async (id: number): Promise<void> => {
    const result = await trackMutation(() => actions.deleteServer(id));
    if (!result.success) throw new Error(result.error.message);
  }, [actions, trackMutation]);

  return {
    servers,
    isLoading: loading,
    error,
    isMutating,
    mutationError,
    clearMutationError,
    refetch,
    createServer,
    updateServer,
    deleteServer,
  };
}
