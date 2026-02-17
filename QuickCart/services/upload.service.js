import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const client = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { 'Accept': 'application/json' },
});

export const uploadService = {
  async uploadProductImage(file, { onProgress } = {}) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await client.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress && e.total) onProgress(Math.round((e.loaded * 100) / e.total));
      },
    });

    const url = res?.data?.url || '';
    // devolver URL absoluta
    return url.startsWith('http') ? url : `${API_BASE.replace(/\/api\/?$/,'')}${url}`;
  },
};