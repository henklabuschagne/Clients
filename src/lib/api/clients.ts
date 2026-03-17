import { appStore } from '../appStore';
import { mockApiCall, errorResponse } from './config';
import type { ApiResult } from './types';
import type { ClientDto, CreateClientDto, UpdateClientDto } from '../../services/api';

export async function getAll(): Promise<ApiResult<ClientDto[]>> {
  return mockApiCall(() => [...appStore.clients]);
}

export async function getById(id: number): Promise<ApiResult<ClientDto>> {
  return mockApiCall(() => {
    const client = appStore.clients.find(c => c.clientId === id);
    if (!client) throw new Error(`Client ${id} not found`);
    return { ...client };
  });
}

export async function create(data: CreateClientDto): Promise<ApiResult<ClientDto>> {
  if (!data.name.trim()) {
    return errorResponse('VALIDATION_ERROR', 'Client name is required');
  }
  return mockApiCall(() => appStore.createClient(data as any));
}

export async function update(data: UpdateClientDto): Promise<ApiResult<ClientDto>> {
  return mockApiCall(() => {
    const result = appStore.updateClient(data.clientId, data);
    if (!result) throw new Error(`Client ${data.clientId} not found`);
    return result;
  });
}

export async function deleteClient(id: number): Promise<ApiResult<boolean>> {
  return mockApiCall(() => {
    const result = appStore.deleteClient(id);
    if (!result) throw new Error(`Client ${id} not found`);
    return result;
  });
}
