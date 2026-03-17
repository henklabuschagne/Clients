import { appStore } from '../appStore';
import { mockApiCall } from './config';
import type { ApiResult } from './types';
import type { ResponsiblePersonDto, CreateResponsiblePersonDto, UpdateResponsiblePersonDto } from '../../services/api';

export async function getByClient(clientId: number): Promise<ApiResult<ResponsiblePersonDto[]>> {
  return mockApiCall(() => appStore.getResponsiblePersonsByClient(clientId).map(r => ({ ...r })));
}

export async function getById(id: number): Promise<ApiResult<ResponsiblePersonDto>> {
  return mockApiCall(() => {
    const rp = appStore.responsiblePersons.find(r => r.responsiblePersonId === id);
    if (!rp) throw new Error(`Responsible person ${id} not found`);
    return { ...rp };
  });
}

export async function create(data: CreateResponsiblePersonDto): Promise<ApiResult<ResponsiblePersonDto>> {
  return mockApiCall(() => appStore.createResponsiblePerson(data as any));
}

export async function update(data: UpdateResponsiblePersonDto): Promise<ApiResult<ResponsiblePersonDto>> {
  return mockApiCall(() => {
    const result = appStore.updateResponsiblePerson(data.responsiblePersonId, data);
    if (!result) throw new Error(`Responsible person ${data.responsiblePersonId} not found`);
    return result;
  });
}

export async function deleteResponsiblePerson(id: number): Promise<ApiResult<boolean>> {
  return mockApiCall(() => {
    const result = appStore.deleteResponsiblePerson(id);
    if (!result) throw new Error(`Responsible person ${id} not found`);
    return result;
  });
}
