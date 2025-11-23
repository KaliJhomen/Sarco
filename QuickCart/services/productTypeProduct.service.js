import client from './api/client';
import endpoints from './api/endpoints';
export const productTypeProductService = {

  async create(formData, token) {
    const payload = {
      idProducto: parseInt(formData.idProducto) || "",
      idTipoProducto: parseInt(formData.idTipoProducto) || "",
    };
    const response = await client.post(endpoints.productTypeProducts.base, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async getAll(){
    const response = await client.get(endpoints.productTypeProducts.all);
    return await response.data || response;
  },
  async getbyId(id){
    
    return await client.get(endpoints.productTypeProducts.byId(id));
  },
    async getByProductId(id){
    const response = await client.get(endpoints.productTypeProducts.byProductId(id));
    return await response.data || response;
  },
}