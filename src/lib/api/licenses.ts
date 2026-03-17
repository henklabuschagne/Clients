import { appStore } from '../appStore';
import { mockApiCall } from './config';
import type { ApiResult } from './types';
import type { LicenseDto, CreateLicenseDto, UpdateLicenseDto, RenewLicenseDto } from '../../services/api';

export async function getByClient(clientId: number): Promise<ApiResult<LicenseDto[]>> {
  return mockApiCall(() => appStore.getLicensesByClient(clientId).map(l => ({ ...l })));
}

export async function getById(id: number): Promise<ApiResult<LicenseDto>> {
  return mockApiCall(() => {
    const license = appStore.licenses.find(l => l.licenseId === id);
    if (!license) throw new Error(`License ${id} not found`);
    return { ...license };
  });
}

export async function create(data: CreateLicenseDto): Promise<ApiResult<LicenseDto>> {
  return mockApiCall(() => appStore.createLicense(data as any));
}

export async function update(data: UpdateLicenseDto): Promise<ApiResult<LicenseDto>> {
  return mockApiCall(() => {
    const result = appStore.updateLicense(data.licenseId, data);
    if (!result) throw new Error(`License ${data.licenseId} not found`);
    return result;
  });
}

export async function deleteLicense(id: number): Promise<ApiResult<boolean>> {
  return mockApiCall(() => {
    const result = appStore.deleteLicense(id);
    if (!result) throw new Error(`License ${id} not found`);
    return result;
  });
}

export async function renew(data: RenewLicenseDto): Promise<ApiResult<LicenseDto>> {
  return mockApiCall(() => {
    const result = appStore.renewLicense(data.licenseId, data.newExpiryDate, data.newRenewalDate, data.cost);
    if (!result) throw new Error(`License ${data.licenseId} not found`);
    return result;
  });
}

export async function getExpiring(days: number = 30): Promise<ApiResult<LicenseDto[]>> {
  return mockApiCall(() => appStore.getExpiringLicenses(days));
}
