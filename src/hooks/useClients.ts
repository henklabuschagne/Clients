import { useEffect, useCallback } from 'react';
import { useAppStore } from './useAppStore';
import { useAsyncTracker, useMutationState } from './useApi';
import type { ClientDto, CreateClientDto, UpdateClientDto } from '../services/api';

export function useClients() {
  const { clients, actions } = useAppStore('clients');
  const { loading, error, track } = useAsyncTracker();
  const { isMutating, mutationError, trackMutation, clearMutationError } = useMutationState();

  const refetch = useCallback(async () => {
    await track(() => actions.getClients());
  }, [actions, track]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const createClient = useCallback(async (client: CreateClientDto): Promise<ClientDto> => {
    const result = await trackMutation(() => actions.createClient(client));
    if (result.success) return result.data;
    throw new Error(result.error.message);
  }, [actions, trackMutation]);

  const updateClient = useCallback(async (client: UpdateClientDto): Promise<ClientDto> => {
    const result = await trackMutation(() => actions.updateClient(client));
    if (result.success) return result.data;
    throw new Error(result.error.message);
  }, [actions, trackMutation]);

  const deleteClient = useCallback(async (id: number): Promise<void> => {
    const result = await trackMutation(() => actions.deleteClient(id));
    if (!result.success) throw new Error(result.error.message);
  }, [actions, trackMutation]);

  return {
    clients,
    isLoading: loading,
    error,
    isMutating,
    mutationError,
    clearMutationError,
    refetch,
    createClient,
    updateClient,
    deleteClient,
  };
}
