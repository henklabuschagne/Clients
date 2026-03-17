import { appStore } from '../appStore';
import { mockApiCall } from './config';
import { simulateLatency, successResponse } from './config';
import type { ApiResult } from './types';
import type { CustomizationDto, CreateCustomizationDto, UpdateCustomizationDto, CustomizationDocumentDto, UpdateCustomizationDocumentDto, CustomizationSummaryDto } from '../../services/api';

export async function getAll(): Promise<ApiResult<CustomizationDto[]>> {
  return mockApiCall(() => [...appStore.customizations]);
}

export async function getByClient(clientId: number): Promise<ApiResult<CustomizationDto[]>> {
  return mockApiCall(() => appStore.getCustomizationsByClient(clientId).map(c => ({ ...c })));
}

export async function getById(id: number): Promise<ApiResult<CustomizationDto>> {
  return mockApiCall(() => {
    const cust = appStore.customizations.find(c => c.customizationId === id);
    if (!cust) throw new Error(`Customization ${id} not found`);
    return { ...cust };
  });
}

export async function create(data: CreateCustomizationDto): Promise<ApiResult<CustomizationDto>> {
  return mockApiCall(() => appStore.createCustomization(data as any));
}

export async function update(data: UpdateCustomizationDto): Promise<ApiResult<CustomizationDto>> {
  return mockApiCall(() => {
    const result = appStore.updateCustomization(data.customizationId, data);
    if (!result) throw new Error(`Customization ${data.customizationId} not found`);
    return result;
  });
}

export async function deleteCustomization(id: number): Promise<ApiResult<boolean>> {
  return mockApiCall(() => {
    const result = appStore.deleteCustomization(id);
    if (!result) throw new Error(`Customization ${id} not found`);
    return result;
  });
}

export async function getDocuments(customizationId: number): Promise<ApiResult<CustomizationDocumentDto[]>> {
  return mockApiCall(() => appStore.getDocumentsByCustomization(customizationId).map(d => ({ ...d })));
}

export async function uploadDocument(
  customizationId: number,
  file: File,
  documentType?: string,
  description?: string,
  uploadedBy?: string
): Promise<ApiResult<CustomizationDocumentDto>> {
  await simulateLatency();
  try {
    const doc = appStore.createDocument({
      customizationId,
      fileName: file.name,
      filePath: `/clients/mock/customizations/${customizationId}/${file.name}`,
      fileSize: file.size,
      fileType: file.type,
      documentType: documentType as any,
      description,
      uploadedBy,
      uploadedAt: new Date().toISOString(),
      isArchived: false,
    });
    return successResponse(doc);
  } catch (e) {
    return { success: false, error: { code: 'UPLOAD_ERROR', message: e instanceof Error ? e.message : 'Upload failed' } };
  }
}

export async function updateDocument(data: UpdateCustomizationDocumentDto): Promise<ApiResult<CustomizationDocumentDto>> {
  return mockApiCall(() => {
    const result = appStore.updateDocument(data.documentId, {
      fileName: data.fileName,
      documentType: data.documentType as any,
      description: data.description,
    });
    if (!result) throw new Error(`Document ${data.documentId} not found`);
    return result;
  });
}

export async function deleteDocument(id: number): Promise<ApiResult<boolean>> {
  return mockApiCall(() => {
    const result = appStore.deleteDocument(id);
    if (!result) throw new Error(`Document ${id} not found`);
    return result;
  });
}

export async function downloadDocument(documentId: number, fileName: string): Promise<ApiResult<void>> {
  await simulateLatency();
  const blob = new Blob(['Mock document content for: ' + fileName], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
  return successResponse(undefined as any);
}

export async function getSummary(clientId: number): Promise<ApiResult<CustomizationSummaryDto>> {
  return mockApiCall(() => {
    const clientCusts = appStore.getCustomizationsByClient(clientId);
    return {
      totalCustomizations: clientCusts.length,
      activeCustomizations: clientCusts.filter(c => c.status === 'active').length,
      deprecatedCustomizations: clientCusts.filter(c => c.status === 'deprecated').length,
      plannedCustomizations: clientCusts.filter(c => c.status === 'planned').length,
      testingCustomizations: clientCusts.filter(c => c.status === 'testing').length,
      totalDocuments: clientCusts.reduce((sum, c) => sum + c.documentCount, 0),
    };
  });
}
