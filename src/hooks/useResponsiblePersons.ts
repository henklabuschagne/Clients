import { useEffect, useCallback } from 'react';
import { useAppStore } from './useAppStore';
import { useAsyncTracker, useMutationState } from './useApi';
import type { ResponsiblePersonDto, CreateResponsiblePersonDto, UpdateResponsiblePersonDto } from '../services/api';

export function useResponsiblePersons(clientId: number) {
  const { reads, actions } = useAppStore('responsiblePersons');
  const { loading, error, track } = useAsyncTracker();
  const { isMutating, mutationError, trackMutation, clearMutationError } = useMutationState();

  const responsiblePersons = reads.getResponsiblePersonsByClient(clientId);

  const refetch = useCallback(async () => {
    await track(() => actions.getResponsiblePersonsByClient(clientId));
  }, [clientId, actions, track]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const createResponsiblePerson = useCallback(async (data: CreateResponsiblePersonDto): Promise<ResponsiblePersonDto> => {
    const result = await trackMutation(() => actions.createResponsiblePerson(data));
    if (result.success) return result.data;
    throw new Error(result.error.message);
  }, [actions, trackMutation]);

  const updateResponsiblePerson = useCallback(async (data: UpdateResponsiblePersonDto): Promise<ResponsiblePersonDto> => {
    const result = await trackMutation(() => actions.updateResponsiblePerson(data));
    if (result.success) return result.data;
    throw new Error(result.error.message);
  }, [actions, trackMutation]);

  const deleteResponsiblePerson = useCallback(async (id: number): Promise<void> => {
    const result = await trackMutation(() => actions.deleteResponsiblePerson(id));
    if (!result.success) throw new Error(result.error.message);
  }, [actions, trackMutation]);

  return {
    responsiblePersons,
    isLoading: loading,
    error,
    isMutating,
    mutationError,
    clearMutationError,
    refetch,
    createResponsiblePerson,
    updateResponsiblePerson,
    deleteResponsiblePerson,
  };
}
