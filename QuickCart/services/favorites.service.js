import client from './api/client';
import endpoints from './api/endpoints';

export const favoritesService = {
  /**
   * Obtiene los favoritos del usuario
   */
  async get(payload) {
    const res = await client.get("/favoritos", { params: payload });
    return res.data;
  },

  /**
   * Agrega un producto a los favoritos del usuario 
   */
  async add(payload) {
    return client.post(endpoints.favorites.add,
      payload);
  },

  /**
   * Elimina un producto de los favoritos del usuario
   */
  async remove(idProducto) {
    return client.delete(endpoints.favorites.remove(idProducto));
  },

  /**
   * Actualiza la cantidad de un producto en los favoritos del usuario
   */
  async update(idProducto) {
    return client.put(endpoints.favorites.update(idProducto), {
      quantity,
    });
  },

  /**
   * Vacía todos los favoritos del usuario
   */
  async clear() {
    const response = await this.get();
    const payload = response?.data ?? response;
    const items = Array.isArray(payload?.items) ? payload.items : [];

    await Promise.all(
      items.map((item) => this.remove(item?.producto?.idProducto))
    );

    return { ok: true };
  },

  /**
   * Resumen calculado en frontend.
   */
  async getSummary() {
    const totalItems = items.reduce((acc, it) => acc + (Number(it?.cantidad) || 0), 0);
    const totalAmount = items.reduce((acc, it) => {
      const qty = Number(it?.cantidad) || 0;
      const price = Number(it?.producto?.precioVenta) || 0;
      return acc + qty * price;
    }, 0);
    const response = await this.get();
    const payload = response?.data ?? response;
    const items = Array.isArray(payload?.items) ? payload.items : [];
    return { totalItems, totalAmount };
  },
};