import client from './api/client';
import endpoints from './api/endpoints';

export const brandService = {
  async getAll() {
    const response = await client.get(endpoints.brands.all);
    return response.data || response;
  },

  async getById(id) {
    const response = await client.get(endpoints.brands.byId(id));
    return response.data || response;
  },

  async create(brandData, token) {
    const payload = {
      nombre: brandData.nombre?.trim() || "",
      estado: brandData.estado ?? true,
    };
    const response = await client.post(endpoints.brands.base, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data || response;
  },

  async update(id, brandData, token) {
    const payload = {
      nombre: brandData.nombre?.trim() || "",
      estado: brandData.estado ?? true,
    };
    const response = await client.patch(endpoints.brands.byId(id), payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data || response;
  },

  async delete(id, token) {
    const response = await client.delete(endpoints.brands.byId(id), {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data || response;
  },
};