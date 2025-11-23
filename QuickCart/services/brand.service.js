import client from './api/client';
import endpoints from './api/endpoints';

export const brandService = {
  async getAll() {
    const response = await client.get(endpoints.brands.all);
    return response.data || response;
  },

  async getById(id) {
    return client.get(endpoints.brands.byId(id));
  },

  async create(brandData, token) {
    const payload = {
      nombre: formData.nombre?.trim() || "",
    }
    const response = await client.post(endpoints.brands.base, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async update(id, brandData, token) {
    const payload = {
      nombre: formData.nombre?.trim() || "",
    }
    return client.put(endpoints.brands.byId(id), payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  async delete(id, token) {
    return client.delete(endpoints.brands.byId(id), {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
};