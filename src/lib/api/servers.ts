import { appStore } from '../appStore';
import { mockApiCall } from './config';
import type { ApiResult } from './types';
import type { ServerDto, CreateServerDto, UpdateServerDto, ServerMetricDto, CreateServerMetricDto, SoftwareInstallationDto, CreateSoftwareInstallationDto } from '../../services/api';

export async function getByClient(clientId: number): Promise<ApiResult<ServerDto[]>> {
  return mockApiCall(() => appStore.getServersByClient(clientId).map(s => ({ ...s })));
}

export async function getById(id: number): Promise<ApiResult<ServerDto>> {
  return mockApiCall(() => {
    const server = appStore.servers.find(s => s.serverId === id);
    if (!server) throw new Error(`Server ${id} not found`);
    return { ...server };
  });
}

export async function create(data: CreateServerDto): Promise<ApiResult<ServerDto>> {
  return mockApiCall(() => appStore.createServer(data as any));
}

export async function update(data: UpdateServerDto): Promise<ApiResult<ServerDto>> {
  return mockApiCall(() => {
    const result = appStore.updateServer(data.serverId, data);
    if (!result) throw new Error(`Server ${data.serverId} not found`);
    return result;
  });
}

export async function deleteServer(id: number): Promise<ApiResult<boolean>> {
  return mockApiCall(() => {
    const result = appStore.deleteServer(id);
    if (!result) throw new Error(`Server ${id} not found`);
    return result;
  });
}

export async function getMetrics(serverId: number): Promise<ApiResult<ServerMetricDto[]>> {
  return mockApiCall(() => []);
}

export async function createMetric(data: CreateServerMetricDto): Promise<ApiResult<ServerMetricDto>> {
  return mockApiCall(() => ({
    metricId: 1,
    ...data,
    recordedAt: new Date().toISOString(),
  }));
}

export async function getSoftware(serverId: number): Promise<ApiResult<SoftwareInstallationDto[]>> {
  return mockApiCall(() => []);
}

export async function createSoftware(data: CreateSoftwareInstallationDto): Promise<ApiResult<SoftwareInstallationDto>> {
  return mockApiCall(() => ({
    installationId: 1,
    ...data,
    installedAt: data.installedAt || new Date().toISOString(),
  }));
}
