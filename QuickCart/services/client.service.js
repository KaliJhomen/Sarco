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