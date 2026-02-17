import client from './api/client';
import endpoints from './api/endpoints';

const authHeader = (token) =>
  token ? { Authorization: `Bearer ${token}` } : {};

export const adService = {
  /*
  async getActive(token) {
    const response = await client.get(endpoints.anuncios.activos, {
      headers: authHeader(token),
    });
    return response.data || response;
  },
*/
  async getAll(token) {
    const response = await client.get(endpoints.anuncios.all, {
      headers: authHeader(token),
    });
    return response.data || response;
  },

  async getById(id, token) {
    const response = await client.get(endpoints.anuncios.byId(id), {
      headers: authHeader(token),
    });
    return response.data || response;
  },

  async create(formData, token) {
    const response = await client.post(endpoints.anuncios.base, formData, {
      headers: authHeader(token),
    });
    return response.data || response;
  },

  async update(id, data, token) {
    const response = await client.put(endpoints.anuncios.byId(id), data, {
      headers: authHeader(token),
    });
    return response.data || response;
  },

  async delete(id, token) {
    return client.delete(endpoints.anuncios.byId(id), {
      headers: authHeader(token),
    });
  },
};