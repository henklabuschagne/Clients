import { appStore } from '../appStore';
import { mockApiCall } from './config';
import type { ApiResult } from './types';
import type { SectionConfig } from '../appStore';

export async function getSectionOrder(clientId: string): Promise<ApiResult<SectionConfig[]>> {
  return mockApiCall(() => appStore.getSectionOrder(clientId));
}

export async function setSectionOrder(clientId: string, sections: SectionConfig[]): Promise<ApiResult<SectionConfig[]>> {
  return mockApiCall(() => {
    appStore.setSectionOrder(clientId, sections);
    return sections;
  });
}

export async function setSelectedClient(clientId: number | null): Promise<ApiResult<void>> {
  return mockApiCall(() => {
    appStore.setSelectedClientId(clientId);
  });
}

export async function setTimelineFilter(timeline: string): Promise<ApiResult<void>> {
  return mockApiCall(() => {
    appStore.setTimelineFilter(timeline);
  });
}
