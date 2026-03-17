import { useEffect, useCallback } from 'react';
import { useAppStore } from './useAppStore';
import { useAsyncTracker, useMutationState } from './useApi';
import type { VPNConfigurationDto, CreateVPNConfigurationDto, UpdateVPNConfigurationDto } from '../services/api';

export function useVPNConfigurations(clientId: number) {
  const { reads, actions } = useAppStore('vpns');
  const { loading, error, track } = useAsyncTracker();
  const { isMutating, mutationError, trackMutation, clearMutationError } = useMutationState();

  const vpnConfigs = reads.getVPNsByClient(clientId);

  const refetch = useCallback(async () => {
    await track(() => actions.getVPNsByClient(clientId));
  }, [clientId, actions, track]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const createVPNConfig = useCallback(async (vpn: CreateVPNConfigurationDto): Promise<VPNConfigurationDto> => {
    const result = await trackMutation(() => actions.createVPN(vpn));
    if (result.success) return result.data;
    throw new Error(result.error.message);
  }, [actions, trackMutation]);

  const updateVPNConfig = useCallback(async (vpn: UpdateVPNConfigurationDto): Promise<VPNConfigurationDto> => {
    const result = await trackMutation(() => actions.updateVPN(vpn));
    if (result.success) return result.data;
    throw new Error(result.error.message);
  }, [actions, trackMutation]);

  const deleteVPNConfig = useCallback(async (id: number): Promise<void> => {
    const result = await trackMutation(() => actions.deleteVPN(id));
    if (!result.success) throw new Error(result.error.message);
  }, [actions, trackMutation]);

  return {
    vpnConfigs,
    isLoading: loading,
    error,
    isMutating,
    mutationError,
    clearMutationError,
    refetch,
    createVPNConfig,
    updateVPNConfig,
    deleteVPNConfig,
  };
}
