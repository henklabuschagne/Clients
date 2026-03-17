import { useEffect, useCallback } from 'react';
import { useAppStore } from './useAppStore';
import { useAsyncTracker, useMutationState } from './useApi';
import type { LicenseDto, CreateLicenseDto, UpdateLicenseDto, RenewLicenseDto } from '../services/api';

export function useLicenses(clientId: number) {
  const { reads, actions } = useAppStore('licenses');
  const { loading, error, track } = useAsyncTracker();
  const { isMutating, mutationError, trackMutation, clearMutationError } = useMutationState();

  const licenses = reads.getLicensesByClient(clientId);

  const refetch = useCallback(async () => {
    await track(() => actions.getLicensesByClient(clientId));
  }, [clientId, actions, track]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const createLicense = useCallback(async (license: CreateLicenseDto): Promise<LicenseDto> => {
    const result = await trackMutation(() => actions.createLicense(license));
    if (result.success) return result.data;
    throw new Error(result.error.message);
  }, [actions, trackMutation]);

  const updateLicense = useCallback(async (license: UpdateLicenseDto): Promise<LicenseDto> => {
    const result = await trackMutation(() => actions.updateLicense(license));
    if (result.success) return result.data;
    throw new Error(result.error.message);
  }, [actions, trackMutation]);

  const deleteLicense = useCallback(async (id: number): Promise<void> => {
    const result = await trackMutation(() => actions.deleteLicense(id));
    if (!result.success) throw new Error(result.error.message);
  }, [actions, trackMutation]);

  const renewLicense = useCallback(async (renewal: RenewLicenseDto): Promise<LicenseDto> => {
    const result = await trackMutation(() => actions.renewLicense(renewal));
    if (result.success) return result.data;
    throw new Error(result.error.message);
  }, [actions, trackMutation]);

  return {
    licenses,
    isLoading: loading,
    error,
    isMutating,
    mutationError,
    clearMutationError,
    refetch,
    createLicense,
    updateLicense,
    deleteLicense,
    renewLicense,
  };
}

export function useExpiringLicenses(days: number = 30) {
  const { reads } = useAppStore('licenses');

  const licenses = reads.getExpiringLicenses(days);

  return {
    licenses,
    isLoading: false,
    error: null,
    refetch: () => {},
  };
}
