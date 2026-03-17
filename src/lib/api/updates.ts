import { appStore } from '../appStore';
import { mockApiCall } from './config';
import type { ApiResult } from './types';
import type { UpdateDto, CreateUpdateDto, UpdateUpdateDto } from '../../services/api';

export async function getAll(): Promise<ApiResult<UpdateDto[]>> {
  return mockApiCall(() => [...appStore.updates]);
}

export async function getByClient(clientId: number): Promise<ApiResult<UpdateDto[]>> {
  return mockApiCall(() => appStore.getUpdatesByClient(clientId).map(u => ({ ...u })));
}

export async function getById(id: number): Promise<ApiResult<UpdateDto>> {
  return mockApiCall(() => {
    const upd = appStore.updates.find(u => u.updateId === id);
    if (!upd) throw new Error(`Update ${id} not found`);
    return { ...upd };
  });
}

export async function create(data: CreateUpdateDto): Promise<ApiResult<UpdateDto>> {
  return mockApiCall(() => appStore.createUpdate(data as any));
}

export async function update(data: UpdateUpdateDto): Promise<ApiResult<UpdateDto>> {
  return mockApiCall(() => {
    const result = appStore.updateUpdate(data.updateId, data);
    if (!result) throw new Error(`Update ${data.updateId} not found`);
    return result;
  });
}

export async function deleteUpdate(id: number): Promise<ApiResult<boolean>> {
  return mockApiCall(() => {
    const result = appStore.deleteUpdate(id);
    if (!result) throw new Error(`Update ${id} not found`);
    return result;
  });
}

export async function getUpcoming(days: number = 7): Promise<ApiResult<UpdateDto[]>> {
  return mockApiCall(() => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    return appStore.updates.filter(u => {
      if (!u.scheduledDate || u.status === 'completed') return false;
      const scheduled = new Date(u.scheduledDate);
      return scheduled >= now && scheduled <= futureDate;
    });
  });
}
