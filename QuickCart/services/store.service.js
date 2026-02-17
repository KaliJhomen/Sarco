import client from './api/client';
import endpoints from './api/endpoints';

export const storeService = {
  async getAll() {
    const response = await client.get(endpoints.stores.all);
    return response.data || response;
  },

  async getById(id) {
    const response = await client.get(endpoints.stores.byId(id));
    return response.data || response;
  },

  async create(storeData, token) {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const response = await client.post(endpoints.stores.all, storeData, { headers });
    return response.data || response;
  },

  async update(id, storeData, token) {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const response = await client.put(endpoints.stores.byId(id), storeData, { headers });
    return response.data || response;
  },

  async delete(id, token) {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const response = await client.delete(endpoints.stores.byId(id), { headers });
    return response.data || response;
  },
};