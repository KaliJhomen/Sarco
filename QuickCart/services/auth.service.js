import client from './api/client';
import endpoints from './api/endpoints';
import { getOrCreateSessionToken } from '@/utils/constants/session';

export const authService = {
  async login(email, clave) {
    try {
      const res = await client.post(endpoints.auth.login, {
        email: email, 
        clave: clave,   
        sessionToken: getOrCreateSessionToken(),
      });
      return { success: true, data: res.data };
    } catch (err) {
      const message = 'Error en auth service login';
      return { success: false, error: message };
    }
  },

  async register(clientData) {
    try {
      const res = await client.post(endpoints.auth.register, clientData);
      return { success: true, data: res.data };
    } catch (err) {
      const message = 'Error en auth service register';
      return { success: false, error: message };
    }
  },

  async logout() {
    try {
      const res = await client.post(endpoints.auth.logout);
      return { success: true, data: res.data };
    } catch (err) {
      const message = 'Error en auth service logout';
      return { success: false, error: message };
    }
  },

  async getMe() {
    try {
      const response = await client.get(endpoints.auth.me);
      console.log("Datos recibidos del backend en getMe:", response.data);
      return response.data;
    } catch (err) {
      console.error("Error al obtener los datos del usuario auth service getMe:", err);
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
    return client.post(endpoints.auth.forgotclave, { email });
  },

  async resetPassword(token, nuevaClave) {
    return client.post(endpoints.auth.resetclave, { token, nuevaClave });
  },

  async verifyEmail(token) {
    return client.post(endpoints.auth.verifyEmail, { token });
  },
};