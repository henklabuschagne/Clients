import { appStore } from '../appStore';
import { mockApiCall } from './config';
import type { ApiResult } from './types';
import type { ClientNoteDto, CreateClientNoteDto, UpdateClientNoteDto } from '../../services/api';

export async function getByClient(clientId: number): Promise<ApiResult<ClientNoteDto[]>> {
  return mockApiCall(() => appStore.getNotesByClient(clientId).map(n => ({ ...n })));
}

export async function create(data: CreateClientNoteDto): Promise<ApiResult<ClientNoteDto>> {
  return mockApiCall(() => {
    const currentUser = appStore.currentUser;
    return appStore.createNote({
      clientId: data.clientId,
      content: data.content,
      createdBy: currentUser?.userId || 1,
      createdByUsername: currentUser?.username || 'admin',
    });
  });
}

export async function update(data: UpdateClientNoteDto): Promise<ApiResult<ClientNoteDto>> {
  return mockApiCall(() => {
    const result = appStore.updateNote(data.noteId, data.content);
    if (!result) throw new Error(`Note ${data.noteId} not found`);
    return result;
  });
}

export async function deleteNote(id: number): Promise<ApiResult<boolean>> {
  return mockApiCall(() => {
    const result = appStore.deleteNote(id);
    if (!result) throw new Error(`Note ${id} not found`);
    return result;
  });
}
