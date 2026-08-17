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
      return { success: true, data: res };
    } catch (err) {
      const message = 'Error en auth service login';
      return { success: false, error: message };
    }
  },

  async register(clientData) {
    try {
      const res = await client.post(endpoints.auth.register, clientData);
      return { success: true, data: res };
    } catch (err) {
      const message = 'Error en auth service register';
      return { success: false, error: message };
    }
  },

  async logout() {
    try {
      const res = await client.post(endpoints.auth.logout);
      return { success: true, data: res };
    } catch (err) {
      const message = 'Error en auth service logout';
      return { success: false, error: message };
    }
  },
/*
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
*/
  async getProfile() {
    try {
      const res = await client.get(endpoints.auth.me);
      return { success: true, data: res };
    } catch (err) {
      const message = err?.response?.data?.message || err.message || 'Error obteniendo perfil';
      const errorType = err?.response?.data?.error;
      return { success: false, error: message };
    }
  },

  async refreshToken() {
    try {
      const res = await client.post(endpoints.auth.refresh);
      return { success: true, data: res };
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || 'Error refreshing token' };
    }
  },

  async forgotPassword(email) {
    try {
      const res = await client.post(endpoints.auth.forgotPassword, { email });
      return { success: true, data: res};
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || 'Error' };
    }
  },

  async resetPassword(token, nuevaClave) {
    try {
      const res = await client.post(endpoints.auth.resetPassword, { token, nuevaClave });
      return { success: true, data: res };
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || 'Error' };
    }
  },

  async verifyEmail(token) {
    try {
      const res = await client.post(endpoints.auth.verifyEmail, { token });
      return { success: true, data: res };
    } catch (err) {
      return { success: false, error: err?.response?.data?.message || 'Error' };
    }
  },
};