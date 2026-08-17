import axios from 'axios';
import client from './api/client';
import endpoints from './api/endpoints';

export const ClienteService = {
  // Obtener todos los clientes
  async getAll() {
    try {
      return client.get(endpoints.clientes.all, {params});
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      throw error;
    }
  },

  // Obtener un usuario por ID
  async getById(id) {
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
  async create(userData) {
    try {
      const response = await axios.post(API_URL, userData);
      return response.data;
    } catch (error) {
      console.error('Error al crear el usuario:', error);
      throw new Error(error.response?.data?.message || 'No se pudo crear el usuario. Por favor, inténtelo de nuevo.');
    }
  },

  // Actualizar un usuario existente
  async update(id, userData) {
    try {
      const response = await axios.patch(`${API_URL}/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el usuario con ID ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al actualizar el usuario.');
    }
  },

  // Eliminar un usuario
  async delete(id) {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar el usuario con ID ${id}:`, error);
      throw new Error(error.response?.data?.message || 'Error al eliminar el usuario.');
    }
  },
};

export default ClienteService;