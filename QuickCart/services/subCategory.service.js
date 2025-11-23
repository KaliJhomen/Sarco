import client from './api/client';
import endpoints from './api/endpoints';
export const subCategoryService = {

  async create(data) {
    const response = await client.post(endpoints.subCategories.base, data);
    return await response.data || response;
  },
  async getAll() {
    const response = await client.get(endpoints.subCategories.all);
    return await response.data || response;
  },
  async getById(id) {
    return await client.get(endpoints.subCategories.byId(id));
  },
  async getByCategoryId(id) {
    const response = await client.get(endpoints.subCategories.byCategoryId(id));
    return await response.data || response;
  },

  async update(id, data) {
    const response = await client.put(endpoints.subCategories.byId(id), data);
    return await response.data || response;
  },

  async delete (id) {
    const response= await client.delete(endpoints.subCategories.delete(id));
  } 
}