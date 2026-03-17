import { appStore } from '../appStore';
import { mockApiCall } from './config';
import type { ApiResult } from './types';
import type { ContactDto, CreateContactDto, UpdateContactDto } from '../../services/api';

export async function getByClient(clientId: number): Promise<ApiResult<ContactDto[]>> {
  return mockApiCall(() => appStore.getContactsByClient(clientId).map(c => ({ ...c })));
}

export async function getById(id: number): Promise<ApiResult<ContactDto>> {
  return mockApiCall(() => {
    const contact = appStore.contacts.find(c => c.contactId === id);
    if (!contact) throw new Error(`Contact ${id} not found`);
    return { ...contact };
  });
}

export async function create(data: CreateContactDto): Promise<ApiResult<ContactDto>> {
  return mockApiCall(() => appStore.createContact(data as any));
}

export async function update(data: UpdateContactDto): Promise<ApiResult<ContactDto>> {
  return mockApiCall(() => {
    const result = appStore.updateContact(data.contactId, data);
    if (!result) throw new Error(`Contact ${data.contactId} not found`);
    return result;
  });
}

export async function deleteContact(id: number): Promise<ApiResult<boolean>> {
  return mockApiCall(() => {
    const result = appStore.deleteContact(id);
    if (!result) throw new Error(`Contact ${id} not found`);
    return result;
  });
}
