import axios from 'axios';

const API_URL = '/api/usuario';

const UserService = {
  // Obtener todos los usuarios
  async getAllUsers() {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      throw error;
    }
  },

  // Obtener un usuario por ID
  async getUserById(id) {
    try {
      const token = localStorage.getItem('auth-token') || sessionStorage.getItem('auth-token');
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el usuario con ID ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al obtener el usuario.');
    }
  },

  // Crear un nuevo usuario
  async createUser(userData) {
    try {
      const response = await axios.post(API_URL, userData);
      return response.data;
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      throw new Error(error.response?.data?.message || 'No se pudo crear el usuario. Por favor, inténtelo de nuevo.');
    }
  },

  // Actualizar un usuario existente
  async updateUser(id, userData) {
    try {
      const response = await axios.patch(`${API_URL}/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el usuario con ID ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al actualizar el usuario.');
    }
  },

  // Eliminar un usuario
  async deleteUser(id) {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar el usuario con ID ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al eliminar el usuario.');
    }
  },
};

export default UserService;

import client from './api/client';
import endpoints from './api/endpoints';

export const clienteService = {
  getAll(params) {
    return client.get(endpoints.clients.all, { params });
  },
  getById(id) {
    return client.get(endpoints.clients.byId(id));
  },
  filter(body) {
    return client.post(endpoints.clients.filter, body);
  },
  search(q, params = {}) {
    return client.get(endpoints.clients.search(q), { params });
  },

  // Create / Update / Delete
  create(data) {
    return client.post(endpoints.clients.base, data);
  },
  update(id, data) {
    return client.patch(endpoints.clients.byId(id), data);
  },
  remove(id) {
    return client.delete(endpoints.clients.byId(id));
  },
};