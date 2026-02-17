import client from './api/client';
import endpoints from './api/endpoints';

export const cartService = {
  /**
   * Obtiene el carrito del usuario autenticado.
   * @returns {Promise} Respuesta del servidor con los datos del carrito.
   */
  async get(userId) {
    return client.get(`${endpoints.cart.get}?userId=${userId}`);
  },

  /**
   * Agrega un producto al carrito del usuario autenticado.
   * @param {number} userId - ID del usuario.
   * @param {number} productId - ID del producto.
   * @param {number} quantity - Cantidad del producto.
   * @returns {Promise} Respuesta del servidor con el producto agregado.
   */
  async add(userId, productId, quantity = 1) {
    return client.post(endpoints.cart.add, {
      userId,
      productId,
      quantity,
    });
  },

  /**
   * Actualiza la cantidad de un producto en el carrito.
   * @param {number} userId - ID del usuario.
   * @param {number} productId - ID del producto.
   * @param {number} quantity - Nueva cantidad del producto.
   * @returns {Promise} Respuesta del servidor con el producto actualizado.
   */
  async update(userId, productId, quantity) {
    return client.put(endpoints.cart.update(productId), {
      userId,
      quantity,
    });
  },

  /**
   * Elimina un producto del carrito.
   * @param {number} userId - ID del usuario.
   * @param {number} productId - ID del producto.
   * @returns {Promise} Respuesta del servidor con el producto eliminado.
   */
  async remove(userId, productId) {
    return client.delete(endpoints.cart.remove(productId), {
      params: { userId },
    });
  },

  /**
   * Vacía el carrito del usuario.
   * @param {number} userId - ID del usuario.
   * @returns {Promise} Respuesta del servidor confirmando el vaciado del carrito.
   */
  async clear(userId) {
    return client.delete(endpoints.cart.clear, {
      params: { userId },
    });
  },

  /**
   * Obtiene un resumen del carrito del usuario.
   * @param {number} userId - ID del usuario.
   * @returns {Promise} Resumen del carrito con el total de productos y el costo total.
   */
  async getSummary(userId) {
    return client.get(`${endpoints.cart.summary}?userId=${userId}`);
  },
};