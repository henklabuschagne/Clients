import { useEffect, useCallback } from 'react';
import { useAppStore } from './useAppStore';
import { useAsyncTracker, useMutationState } from './useApi';
import type { TicketDto, CreateTicketDto, UpdateTicketDto } from '../services/api';

export function useTickets(clientId?: number) {
  const { tickets: allTickets, reads, actions } = useAppStore('tickets');
  const { loading, error, track } = useAsyncTracker();
  const { isMutating, mutationError, trackMutation, clearMutationError } = useMutationState();

  const tickets = clientId ? reads.getTicketsByClient(clientId) : allTickets;

  const refetch = useCallback(async () => {
    if (clientId) {
      await track(() => actions.getTicketsByClient(clientId));
    }
  }, [clientId, actions, track]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const createTicket = useCallback(async (ticket: CreateTicketDto): Promise<TicketDto> => {
    const result = await trackMutation(() => actions.createTicket(ticket));
    if (result.success) return result.data;
    throw new Error(result.error.message);
  }, [actions, trackMutation]);

  const updateTicket = useCallback(async (ticket: UpdateTicketDto): Promise<TicketDto> => {
    const result = await trackMutation(() => actions.updateTicket(ticket));
    if (result.success) return result.data;
    throw new Error(result.error.message);
  }, [actions, trackMutation]);

  const deleteTicket = useCallback(async (id: number): Promise<void> => {
    const result = await trackMutation(() => actions.deleteTicket(id));
    if (!result.success) throw new Error(result.error.message);
  }, [actions, trackMutation]);

  return {
    tickets,
    isLoading: loading,
    error,
    isMutating,
    mutationError,
    clearMutationError,
    refetch,
    createTicket,
    updateTicket,
    deleteTicket,
  };
}

export function useTicketStatistics() {
  const { reads } = useAppStore('tickets');

  const statistics = reads.getTicketStatistics();

  return {
    statistics,
    isLoading: false,
    error: null,
    refetch: () => {},
  };
}
