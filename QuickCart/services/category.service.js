import client from './api/client';
import endpoints from './api/endpoints';
export const categoryService = {
  async getAll() {
    const response = await client.get(endpoints.categories.all);
    return response.data || response;
  },
  async getById(id) {
    return client.get(endpoints.categories.byId(id));
  },
  async create(categoryData, token) {
    const payload = {
      nombre: categoryData.nombre?.trim() || "",
    }
    return client.post(endpoints.categories.base, categoryData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  async update(id, categoryData, token) {
    return client.put(endpoints.categories.byId(id), categoryData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  async delete(id, token) {
    return client.delete(endpoints.categories.byId(id), {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

}