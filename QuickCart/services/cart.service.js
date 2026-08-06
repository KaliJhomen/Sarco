import client from './api/client';
import endpoints from './api/endpoints';

export const cartService = {
  /**
   * Obtiene el carrito del usuario autenticado.
   */
  async get({idUser, sessionToken}) {
    return client.get(endpoints.cart.get, {
      params: {
        idUser,
        sessionToken
      }
    });
  },

  /**
   * Agrega un producto al carrito.
   * Valida el stock disponible antes de enviar la petición.
   */
  async add(data) {
    if (data.quantity > data.stockDisponible) {
      throw new Error(`Solo hay ${data.stockDisponible} unidades disponibles`);
    }
    return client.post(endpoints.cart.add, data);
  },

  /**
   * Actualiza la cantidad de un producto en el carrito.
   */
  async update(idProducto, quantity) {
    return client.put(endpoints.cart.update(idProducto), {
      quantity,
    });
  },

  /**
   * Elimina un producto del carrito.
   */
  async remove(idProducto) {
    return client.delete(endpoints.cart.remove(idProducto));
  },

  /**
   * Vacía el carrito (fallback sin endpoint dedicado).
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

  async getSummary() {
    const response = await this.get();
    const payload = response?.data ?? response;
    const items = Array.isArray(payload?.items) ? payload.items : [];

    const totalItems = items.reduce((acc, it) => acc + (Number(it?.cantidad) || 0), 0);
    const totalAmount = items.reduce((acc, it) => {
      const qty = Number(it?.cantidad) || 0;
      const price = Number(it?.producto?.precioVenta) || 0;
      return acc + qty * price;
    }, 0);

    return { totalItems, totalAmount };
  },

  async generateShareToken(ident) {
    const response = await client.post(endpoints.cart.genToken, ident);
    return response?.data ?? response;
  },

  async getSharedCart(shareToken) {
    const response = await client.get(endpoints.cart.getShared(shareToken));
    return response?.data ?? response;
  },
};