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
  async remove(payload) {
    const { idProducto, sessionToken } = payload || {};
    return client.delete(endpoints.favorites.remove(idProducto), {
      params: { sessionToken },
    });
  },

  /**
   * Vacía todos los favoritos del usuario
   */
  async clear(ident) {
    const response = await this.get(ident);
    const payload = response?.data ?? response;
    const items = Array.isArray(payload?.items) ? payload.items : [];

    await Promise.all(
      items.map((item) =>
        this.remove({
          idProducto: item.idProducto,
          sessionToken: ident?.sessionToken,
        })
      )
    );

    return { ok: true };
  },
};