import client from './api/client';
import endpoints from './api/endpoints';
export const productTypeService = {

  async create(data) {
    const response = await client.post(endpoints.productTypes.base, data);
    return await response.data || response;
  },
  async getAll() {
    const response = await client.get(endpoints.productTypes.all);
    return await response.data || response;
  },
  async getById(id) {
    return await client.get(endpoints.productTypes.byId(id));
  },
  async getBySubCategoryId(id) {
    const response = await client.get(endpoints.productTypes.bySubCategoryId(id));
    return await response.data || response;
  },
  async getByProductId(idProducto) {
    const response = await client.get(endpoints.productTypes.byProductId(idProducto));
    return await response.data || response;       
  }, 
  async update(id, data) {
    const response = await client.put(endpoints.productTypes.byId(id), data);
    return await response.data || response;
  },
  async delete(id, token) {
    const response = await client.delete(endpoints.productTypes.byId(id), {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data || response;
  }
}