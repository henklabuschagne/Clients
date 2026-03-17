import { appStore } from '../appStore';
import { mockApiCall } from './config';
import type { ApiResult } from './types';
import type { TicketDto, CreateTicketDto, UpdateTicketDto, TicketStatisticsDto } from '../../services/api';

export async function getAll(): Promise<ApiResult<TicketDto[]>> {
  return mockApiCall(() => [...appStore.tickets]);
}

export async function getByClient(clientId: number): Promise<ApiResult<TicketDto[]>> {
  return mockApiCall(() => appStore.getTicketsByClient(clientId).map(t => ({ ...t })));
}

export async function getById(id: number): Promise<ApiResult<TicketDto>> {
  return mockApiCall(() => {
    const ticket = appStore.tickets.find(t => t.ticketId === id);
    if (!ticket) throw new Error(`Ticket ${id} not found`);
    return { ...ticket };
  });
}

export async function create(data: CreateTicketDto): Promise<ApiResult<TicketDto>> {
  return mockApiCall(() => appStore.createTicket(data as any));
}

export async function update(data: UpdateTicketDto): Promise<ApiResult<TicketDto>> {
  return mockApiCall(() => {
    const result = appStore.updateTicket(data.ticketId, data);
    if (!result) throw new Error(`Ticket ${data.ticketId} not found`);
    return result;
  });
}

export async function deleteTicket(id: number): Promise<ApiResult<boolean>> {
  return mockApiCall(() => {
    const result = appStore.deleteTicket(id);
    if (!result) throw new Error(`Ticket ${id} not found`);
    return result;
  });
}

export async function getStatistics(): Promise<ApiResult<TicketStatisticsDto>> {
  return mockApiCall(() => appStore.getTicketStatistics());
}
