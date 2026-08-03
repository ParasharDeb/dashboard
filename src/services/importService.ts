import apiClient from './apiClient';
import { IImportPreview } from '../types';

export const importService = {
  parseSpreadsheetFile: async (fileUri: string, fileName: string, fileType: string): Promise<IImportPreview> => {
    const formData = new FormData();
    // @ts-ignore
    formData.append('file', {
      uri: fileUri,
      name: fileName,
      type: fileType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const res = await apiClient.post('/import/parse', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return res.data.data;
  },

  parseBase64: async (base64Data: string): Promise<IImportPreview> => {
    const res = await apiClient.post('/import/parse', { base64: base64Data });
    return res.data.data;
  },

  commitImport: async (payload: {
    todos?: any[];
    routines?: any[];
    nutrition?: any[];
    weight?: any[];
    birthdays?: any[];
  }): Promise<{ success: boolean; summary: any }> => {
    const res = await apiClient.post('/import/commit', payload);
    return res.data;
  },
};
