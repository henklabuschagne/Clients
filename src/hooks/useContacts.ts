import { useEffect, useCallback } from 'react';
import { useAppStore } from './useAppStore';
import { useAsyncTracker, useMutationState } from './useApi';
import type { ContactDto, CreateContactDto, UpdateContactDto } from '../services/api';

export function useContacts(clientId: number) {
  const { reads, actions } = useAppStore('contacts');
  const { loading, error, track } = useAsyncTracker();
  const { isMutating, mutationError, trackMutation, clearMutationError } = useMutationState();

  const contacts = reads.getContactsByClient(clientId);

  const refetch = useCallback(async () => {
    await track(() => actions.getContactsByClient(clientId));
  }, [clientId, actions, track]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const createContact = useCallback(async (contact: CreateContactDto): Promise<ContactDto> => {
    const result = await trackMutation(() => actions.createContact(contact));
    if (result.success) return result.data;
    throw new Error(result.error.message);
  }, [actions, trackMutation]);

  const updateContact = useCallback(async (contact: UpdateContactDto): Promise<ContactDto> => {
    const result = await trackMutation(() => actions.updateContact(contact));
    if (result.success) return result.data;
    throw new Error(result.error.message);
  }, [actions, trackMutation]);

  const deleteContact = useCallback(async (id: number): Promise<void> => {
    const result = await trackMutation(() => actions.deleteContact(id));
    if (!result.success) throw new Error(result.error.message);
  }, [actions, trackMutation]);

  return {
    contacts,
    isLoading: loading,
    error,
    isMutating,
    mutationError,
    clearMutationError,
    refetch,
    createContact,
    updateContact,
    deleteContact,
  };
}
