import { appStore } from '../appStore';
import { mockApiCall } from './config';
import type { ApiResult } from './types';
import type { VPNConfigurationDto, CreateVPNConfigurationDto, UpdateVPNConfigurationDto } from '../../services/api';

export async function getByClient(clientId: number): Promise<ApiResult<VPNConfigurationDto[]>> {
  return mockApiCall(() => appStore.getVPNsByClient(clientId).map(v => ({ ...v })));
}

export async function getById(id: number): Promise<ApiResult<VPNConfigurationDto>> {
  return mockApiCall(() => {
    const vpn = appStore.vpns.find(v => v.vpnId === id);
    if (!vpn) throw new Error(`VPN ${id} not found`);
    return { ...vpn };
  });
}

export async function create(data: CreateVPNConfigurationDto): Promise<ApiResult<VPNConfigurationDto>> {
  return mockApiCall(() => appStore.createVPN(data as any));
}

export async function update(data: UpdateVPNConfigurationDto): Promise<ApiResult<VPNConfigurationDto>> {
  return mockApiCall(() => {
    const result = appStore.updateVPN(data.vpnId, data);
    if (!result) throw new Error(`VPN ${data.vpnId} not found`);
    return result;
  });
}

export async function deleteVPN(id: number): Promise<ApiResult<boolean>> {
  return mockApiCall(() => {
    const result = appStore.deleteVPN(id);
    if (!result) throw new Error(`VPN ${id} not found`);
    return result;
  });
}
