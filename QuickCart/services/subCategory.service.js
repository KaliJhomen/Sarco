import client from './api/client';
import endpoints from './api/endpoints';

export const subCategoryService = {
  async create(data, token) {
    return client.post(endpoints.subCategories.base, data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  async getAll() {
    const response = await client.get(endpoints.subCategories.all);
    return response.data || response;
  },

  async getById(id) {
    const response = await client.get(endpoints.subCategories.byId(id));
    return response.data || response;
  },

  async getByCategoryId(id) {
    const response = await client.get(endpoints.subCategories.byCategoryId(id));
    return response.data || response;
  },

  async update(id, data, token) {
    return client.put(endpoints.subCategories.byId(id), data, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  async delete(id, token) {
    return client.delete(endpoints.subCategories.byId(id), {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}