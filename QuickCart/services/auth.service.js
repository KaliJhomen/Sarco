import client from './api/client';
import endpoints from './api/endpoints';

export const authService = {
  async login(identifier, password) {
    try {
      const res = await client.post(endpoints.auth.login, {
        login: identifier, 
        clave: password,   
      });
      return { success: true, data: res.data };
    } catch (err) {
      const message = err?.response?.data?.message || err.message || 'Error en login';
      return { success: false, error: message };
    }
  },

  async register(userData) {
    try {
      const res = await client.post(endpoints.auth.register, userData);
      return { success: true, data: res.data };
    } catch (err) {
      const message = err?.response?.data?.message || err.message || 'Error en register';
      return { success: false, error: message };
    }
  },

  async logout() {
    try {
      const res = await client.post(endpoints.auth.logout);
      return { success: true, data: res.data };
    } catch (err) {
      const message = err?.response?.data?.message || err.message || 'Error en logout';
      return { success: false, error: message };
    }
  },

  async getMe() {
    try {
      const response = await client.get(endpoints.auth.me);
      console.log("Datos recibidos del backend en getMe:", response.data);
      return response.data;
    } catch (err) {
      console.error("Error al obtener los datos del usuario:", err);
      throw err;
    }
  },

  async getProfile(token) {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const res = await client.get(endpoints.auth.me, { headers });
      return { success: true, data: res.data };
    } catch (err) {
      const message = err?.response?.data?.message || err.message || 'Error obteniendo perfil';
      return { success: false, error: message };
    }
  },

  async refreshToken() {
    return client.post(endpoints.auth.refresh);
  },

  async forgotPassword(email) {
    return client.post(endpoints.auth.forgotPassword, { email });
  },

  async resetPassword(token, newPassword) {
    return client.post(endpoints.auth.resetPassword, { token, newPassword });
  },

  async verifyEmail(token) {
    return client.post(endpoints.auth.verifyEmail, { token });
  },
};