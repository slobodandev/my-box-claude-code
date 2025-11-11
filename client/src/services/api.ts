import axios from 'axios';
import { FileInfo, LinkInfo } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const linkAPI = {
  create: async (email?: string): Promise<LinkInfo> => {
    const response = await api.post('/links/create', { email });
    return response.data.link;
  },

  getInfo: async (token: string): Promise<LinkInfo> => {
    const response = await api.get(`/links/${token}`);
    return response.data;
  },
};

export const fileAPI = {
  upload: async (token: string, file: File, onProgress?: (progress: number) => void): Promise<FileInfo> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(`/files/${token}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });

    return response.data.file;
  },

  getFiles: async (token: string): Promise<FileInfo[]> => {
    const response = await api.get(`/files/${token}/files`);
    return response.data.files;
  },

  delete: async (token: string, fileId: string): Promise<void> => {
    await api.delete(`/files/${token}/files/${fileId}`);
  },

  getDownloadUrl: (token: string, fileId: string): string => {
    return `${API_BASE_URL}/files/${token}/files/${fileId}/download`;
  },
};
