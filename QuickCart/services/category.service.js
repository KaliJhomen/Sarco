import client from './api/client';
import endpoints from './api/endpoints';

export const categoryService = {
  async getAll() {
    const response = await client.get(endpoints.categories.all);
    return response.data || response;
  },
  
  async getById(id) {
    const response = await client.get(endpoints.categories.byId(id));
    return response.data || response;
  },
  
  async create(categoryData, token) {
    const payload = {
      nombre: categoryData.nombre?.trim() || "",
      estado: categoryData.estado ?? true, // ✅ Agregar estado
    };
    return client.post(endpoints.categories.base, payload, { // ✅ Enviar payload, no categoryData
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  async update(id, categoryData, token) {
    const payload = {
      nombre: categoryData.nombre?.trim() || "",
      estado: categoryData.estado ?? true,
    };
    return client.put(endpoints.categories.byId(id), payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  async delete(id, token) {
    return client.delete(endpoints.categories.byId(id), {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
}