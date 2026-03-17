import { useEffect, useCallback } from 'react';
import { useAppStore } from './useAppStore';
import { useAsyncTracker, useMutationState } from './useApi';
import type { ClientNoteDto, CreateClientNoteDto, UpdateClientNoteDto } from '../services/api';

export function useClientNotes(clientId: number) {
  const { reads, actions } = useAppStore('notes');
  const { loading, error, track } = useAsyncTracker();
  const { isMutating, mutationError, trackMutation, clearMutationError } = useMutationState();

  const notes = reads.getNotesByClient(clientId);

  const refetch = useCallback(async () => {
    await track(() => actions.getNotesByClient(clientId));
  }, [clientId, actions, track]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const createNote = useCallback(async (note: CreateClientNoteDto): Promise<ClientNoteDto> => {
    const result = await trackMutation(() => actions.createNote(note));
    if (result.success) return result.data;
    throw new Error(result.error.message);
  }, [actions, trackMutation]);

  const updateNote = useCallback(async (note: UpdateClientNoteDto): Promise<ClientNoteDto> => {
    const result = await trackMutation(() => actions.updateNote(note));
    if (result.success) return result.data;
    throw new Error(result.error.message);
  }, [actions, trackMutation]);

  const deleteNote = useCallback(async (id: number): Promise<void> => {
    const result = await trackMutation(() => actions.deleteNote(id));
    if (!result.success) throw new Error(result.error.message);
  }, [actions, trackMutation]);

  return {
    notes,
    isLoading: loading,
    error,
    isMutating,
    mutationError,
    clearMutationError,
    refetch,
    createNote,
    updateNote,
    deleteNote,
  };
}
