import { appStore } from '../appStore';
import { mockApiCall } from './config';
import type { ApiResult } from './types';
import type { ConnectionDto, CreateConnectionDto, UpdateConnectionDto, TestConnectionResultDto } from '../../services/api';

export async function getByClient(clientId: number): Promise<ApiResult<ConnectionDto[]>> {
  return mockApiCall(() => appStore.getConnectionsByClient(clientId).map(c => ({ ...c })));
}

export async function getById(id: number): Promise<ApiResult<ConnectionDto>> {
  return mockApiCall(() => {
    const conn = appStore.connections.find(c => c.connectionId === id);
    if (!conn) throw new Error(`Connection ${id} not found`);
    return { ...conn };
  });
}

export async function create(data: CreateConnectionDto): Promise<ApiResult<ConnectionDto>> {
  return mockApiCall(() => appStore.createConnection(data as any));
}

export async function update(data: UpdateConnectionDto): Promise<ApiResult<ConnectionDto>> {
  return mockApiCall(() => {
    const result = appStore.updateConnection(data.connectionId, data);
    if (!result) throw new Error(`Connection ${data.connectionId} not found`);
    return result;
  });
}

export async function deleteConnection(id: number): Promise<ApiResult<boolean>> {
  return mockApiCall(() => {
    const result = appStore.deleteConnection(id);
    if (!result) throw new Error(`Connection ${id} not found`);
    return result;
  });
}

export async function test(connectionId: number): Promise<ApiResult<TestConnectionResultDto>> {
  return mockApiCall(() => ({
    success: true,
    message: 'Connection test successful',
    responseTime: Math.random() * 100 + 50,
  }));
}
