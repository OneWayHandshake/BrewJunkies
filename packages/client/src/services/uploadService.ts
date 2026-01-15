import { api } from './api';

export interface UploadedImage {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
}

export async function uploadImage(file: File): Promise<UploadedImage> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data;
}

export function getImageUrl(imageId: string): string {
  const baseUrl = import.meta.env.VITE_API_URL || '/api';
  return `${baseUrl}/upload/${imageId}`;
}
