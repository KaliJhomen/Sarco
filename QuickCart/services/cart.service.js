import client from './api/client';
import endpoints from './api/endpoints';

export const cartService = {
  /**
   * Obtiene el carrito del usuario autenticado.
   */
  async get() {
    return client.get(endpoints.cart.get);
  },

  /**
   * Agrega un producto al carrito.
   * Valida el stock disponible antes de enviar la petición.
   */
  async add(idProducto, quantity = 1, stockDisponible) {
    if (quantity > stockDisponible) {
      throw new Error(`Solo hay ${stockDisponible} unidades disponibles`);
    }
    return client.post(endpoints.cart.add, {
      idProducto,
      quantity,
    });
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

  /**
   * Resumen calculado en frontend.
   */
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
};